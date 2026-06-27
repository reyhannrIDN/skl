<?php

namespace App\Http\Controllers\Chat;

use App\Http\Controllers\Controller;
use App\Models\ChatGroup;
use App\Models\ChatGroupMember;
use App\Models\ChatMessage;
use App\Models\User;
use App\Models\SystemSetting;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ChatController extends Controller
{
    public function groups(Request $request)
    {
        $user = $request->user();
        $groups = ChatGroup::whereHas('members', fn($q) => $q->where('user_id', $user->id))
            ->with(['lastMessage.sender', 'memberUsers' => function ($q) {
                $q->select('users.id', 'users.name', 'users.role', 'users.avatar', 'users.last_activity_at');
            }])
            ->orderByDesc(
                ChatMessage::select('created_at')
                    ->whereColumn('group_id', 'chat_groups.id')
                    ->latest()
                    ->take(1)
            )
            ->get()
            ->map(function ($group) use ($user) {
                $member = $group->members->firstWhere('user_id', $user->id);
                $unreadCount = 0;
                if ($member && $member->last_read_at) {
                    $unreadCount = $group->messages()
                        ->where('sender_id', '!=', $user->id)
                        ->where('created_at', '>', $member->last_read_at)
                        ->count();
                } elseif ($member && !$member->last_read_at) {
                    $unreadCount = $group->messages()
                        ->where('sender_id', '!=', $user->id)
                        ->count();
                }
                $group->unread_count = $unreadCount;
                unset($group->members);
                return $group;
            });

        return response()->json(['groups' => $groups]);
    }

    public function createGroup(Request $request)
    {
        $rules = [
            'type' => 'required|in:personal,class_group,group',
            'member_ids' => 'required|array|min:1',
            'member_ids.*' => 'exists:users,id',
            'reference_id' => 'nullable|exists:student_groups,id',
        ];

        if ($request->type === 'group') {
            $rules['name'] = 'required|string|max:255';
        } else {
            $rules['name'] = 'nullable|string|max:255';
        }

        $request->validate($rules);

        $user = $request->user();

        if ($request->type === 'personal') {
            $otherUserId = $request->member_ids[0];
            $existingGroup = ChatGroup::where('type', 'personal')
                ->whereHas('members', fn($q) => $q->where('user_id', $user->id))
                ->whereHas('members', fn($q) => $q->where('user_id', $otherUserId))
                ->whereDoesntHave('members', function ($q) use ($user, $otherUserId) {
                    $q->whereNotIn('user_id', [$user->id, $otherUserId]);
                })
                ->first();
            if ($existingGroup) {
                return response()->json(['group' => $existingGroup->load('memberUsers')]);
            }
        }

        $group = DB::transaction(function () use ($request, $user) {
            $group = ChatGroup::create([
                'name' => $request->name,
                'type' => $request->type,
                'created_by' => $user->id,
                'reference_id' => $request->reference_id,
            ]);

            $memberIds = array_merge([$user->id], $request->member_ids);
            foreach (array_unique($memberIds) as $memberId) {
                ChatGroupMember::create([
                    'group_id' => $group->id,
                    'user_id' => $memberId,
                    'joined_at' => now(),
                    'is_admin' => $memberId === $user->id,
                ]);
            }

            return $group;
        });

        $group->load('memberUsers');

        return response()->json(['group' => $group], 201);
    }

    public function getGroup(Request $request, $id)
    {
        $user = $request->user();
        $group = ChatGroup::whereHas('members', fn($q) => $q->where('user_id', $user->id))
            ->with(['lastMessage.sender', 'memberUsers' => function ($q) {
                $q->select('users.id', 'users.name', 'users.role', 'users.avatar', 'users.last_activity_at', 'users.nip');
            }])
            ->findOrFail($id);

        return response()->json(['group' => $group]);
    }

    public function messages(Request $request, $id)
    {
        $user = $request->user();
        ChatGroup::whereHas('members', fn($q) => $q->where('user_id', $user->id))->findOrFail($id);

        $perPage = 50;
        $messages = ChatMessage::where('group_id', $id)
            ->where(function ($q) use ($user) {
                $q->where('is_deleted', false)
                  ->orWhereNull('is_deleted');
            })
            ->where(function ($q) use ($user) {
                $q->whereNull('deleted_for')
                  ->orWhereJsonDoesntContain('deleted_for', (string) $user->id);
            })
            ->with('sender:id,name,role,avatar')
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return response()->json([
            'messages' => $messages->items(),
            'next_page' => $messages->nextPageUrl(),
            'has_more' => $messages->hasMorePages(),
        ]);
    }

    public function sendMessage(Request $request, $id)
    {
        $user = $request->user();
        $group = ChatGroup::whereHas('members', fn($q) => $q->where('user_id', $user->id))->findOrFail($id);

        $request->validate([
            'message_type' => 'required|in:text,emoji,sticker,file,image',
            'message' => 'nullable|string|max:10000',
            'sticker_id' => 'nullable|string|max:50',
        ]);

        $data = [
            'group_id' => $group->id,
            'sender_id' => $user->id,
            'message_type' => $request->message_type,
            'message' => $request->message,
            'sticker_id' => $request->sticker_id,
        ];

        if (in_array($request->message_type, ['file', 'image']) && $request->hasFile('file')) {
            $fileSettings = [
                'enabled' => SystemSetting::getValue('chat_file_upload_enabled', 'true'),
                'max_size' => (int) SystemSetting::getValue('chat_max_file_size_mb', '10'),
                'allowed_types' => json_decode(SystemSetting::getValue('chat_allowed_file_types', '["jpg","jpeg","png","gif","pdf","doc","docx","xls","xlsx","zip","rar"]'), true),
            ];

            if ($fileSettings['enabled'] !== 'true') {
                return response()->json(['message' => 'Upload file di chat dinonaktifkan oleh admin'], 403);
            }

            $file = $request->file('file');
            $ext = strtolower($file->getClientOriginalExtension());
            if (!in_array($ext, $fileSettings['allowed_types'])) {
                return response()->json(['message' => 'Tipe file tidak diizinkan'], 422);
            }

            $maxBytes = $fileSettings['max_size'] * 1024 * 1024;
            if ($file->getSize() > $maxBytes) {
                return response()->json(['message' => "Ukuran file maksimal {$fileSettings['max_size']} MB"], 422);
            }

            $path = $file->store('chat-files', 'public');
            $data['file_path'] = $path;
            $data['file_name'] = $file->getClientOriginalName();
            $data['file_size'] = $file->getSize();
            $data['mime_type'] = $file->getMimeType();
        }

        $message = ChatMessage::create($data);
        $message->load('sender:id,name,role,avatar');

        if ($request->has('mentioned_ids')) {
            $validIds = User::whereIn('id', (array) $request->mentioned_ids)->pluck('id')->toArray();
            $message->update(['mentions' => $validIds]);
        }

        return response()->json(['message' => $message], 201);
    }

    public function togglePinMessage(Request $request, $id, $messageId)
    {
        $user = $request->user();
        $group = ChatGroup::whereHas('members', fn($q) => $q->where('user_id', $user->id))->findOrFail($id);
        $message = ChatMessage::where('group_id', $group->id)->findOrFail($messageId);

        $message->update(['is_pinned' => !$message->is_pinned]);

        return response()->json([
            'message' => $message,
            'is_pinned' => $message->is_pinned,
        ]);
    }

    public function pinnedMessages(Request $request, $id)
    {
        $user = $request->user();
        ChatGroup::whereHas('members', fn($q) => $q->where('user_id', $user->id))->findOrFail($id);

        $messages = ChatMessage::where('group_id', $id)
            ->where('is_pinned', true)
            ->with('sender:id,name,role,avatar')
            ->orderByDesc('updated_at')
            ->get();

        return response()->json(['messages' => $messages]);
    }

    public function uploadGroupPhoto(Request $request, $id)
    {
        $user = $request->user();
        $group = ChatGroup::whereHas('members', fn($q) => $q->where('user_id', $user->id))->findOrFail($id);

        $request->validate([
            'photo' => 'required|image|mimes:jpg,jpeg,png,gif,webp|max:2048',
        ]);

        if ($group->photo) {
            Storage::disk('public')->delete($group->photo);
        }

        $path = $request->file('photo')->store('chat-photos', 'public');
        $group->update(['photo' => $path]);
        $group->load('memberUsers');

        return response()->json(['group' => $group, 'message' => 'Foto grup berhasil diperbarui']);
    }

    public function groupMembers(Request $request, $id)
    {
        $user = $request->user();
        $group = ChatGroup::whereHas('members', fn($q) => $q->where('user_id', $user->id))->findOrFail($id);

        $members = $group->memberUsers()
            ->select('users.id', 'users.name', 'users.role', 'users.avatar')
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'name' => $m->name,
                'role' => $m->role,
                'avatar' => $m->avatar,
                'is_admin' => (bool) ($m->pivot->is_admin ?? false),
            ]);

        return response()->json(['members' => $members]);
    }

    public function markAsRead(Request $request, $id)
    {
        $user = $request->user();
        $member = ChatGroupMember::where('group_id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();
        $member->update(['last_read_at' => now()]);

        return response()->json(['message' => 'Marked as read']);
    }

    public function contacts(Request $request)
    {
        $user = $request->user();
        $contacts = collect();

        if ($user->isSuperadmin()) {
            $contacts = User::where('role', 'guru')
                ->where('is_active', true)
                ->select('id', 'name', 'role', 'avatar', 'last_activity_at', 'nip')
                ->get();
        } elseif ($user->isGuru()) {
            $admin = User::where('role', 'superadmin')
                ->where('is_active', true)
                ->select('id', 'name', 'role', 'avatar', 'last_activity_at')
                ->get();
            $studentIds = DB::table('student_group_user')
                ->whereIn('student_group_id', function ($q) use ($user) {
                    $q->select('id')->from('student_groups')
                        ->where('wali_kelas_id', $user->id);
                })
                ->pluck('user_id');
            $students = User::whereIn('id', $studentIds)
                ->where('is_active', true)
                ->select('id', 'name', 'role', 'avatar', 'last_activity_at', 'nis')
                ->get();
            $contacts = $admin->concat($students);
        } elseif ($user->isSiswa()) {
            $admin = User::where('role', 'superadmin')
                ->where('is_active', true)
                ->select('id', 'name', 'role', 'avatar', 'last_activity_at')
                ->get();
            $waliKelasIds = DB::table('student_groups')
                ->whereIn('id', function ($q) use ($user) {
                    $q->select('student_group_id')->from('student_group_user')
                        ->where('user_id', $user->id);
                })
                ->pluck('wali_kelas_id');
            $gurus = User::whereIn('id', $waliKelasIds)
                ->where('is_active', true)
                ->where('role', 'guru')
                ->select('id', 'name', 'role', 'avatar', 'last_activity_at', 'nip')
                ->get();
            $contacts = $admin->concat($gurus);
        }

        $contacts = $contacts->map(fn($c) => [
            'id' => $c->id,
            'name' => $c->name,
            'role' => $c->role,
            'avatar' => $c->avatar,
            'nip' => $c->nip ?? null,
            'nis' => $c->nis ?? null,
            'is_online' => $c->last_activity_at && $c->last_activity_at->gt(now()->subMinutes(5)),
        ]);

        return response()->json(['contacts' => $contacts->values()]);
    }

    public function addMembers(Request $request, $id)
    {
        $user = $request->user();
        $group = ChatGroup::whereHas('members', fn($q) => $q->where('user_id', $user->id))
            ->findOrFail($id);

        if ($group->type !== 'personal') {
            $isAdmin = ChatGroupMember::where('group_id', $group->id)
                ->where('user_id', $user->id)
                ->where('is_admin', true)
                ->exists();
            if (!$isAdmin) {
                return response()->json(['message' => 'Hanya admin grup yang dapat menambah anggota'], 403);
            }
        }

        $request->validate([
            'member_ids' => 'required|array|min:1',
            'member_ids.*' => 'exists:users,id',
        ]);

        $existingIds = ChatGroupMember::where('group_id', $group->id)
            ->pluck('user_id')
            ->toArray();

        $newIds = array_diff($request->member_ids, $existingIds);

        if (empty($newIds)) {
            return response()->json(['message' => 'Anggota sudah ada dalam grup']);
        }

        foreach ($newIds as $memberId) {
            ChatGroupMember::create([
                'group_id' => $group->id,
                'user_id' => $memberId,
                'joined_at' => now(),
            ]);
        }

        $group->load('memberUsers');

        NotificationService::logActivity('chat_add_members', "Added members to chat group #{$group->id}");

        return response()->json(['group' => $group, 'message' => count($newIds) . ' anggota berhasil ditambahkan']);
    }

    public function updateGroup(Request $request, $id)
    {
        $user = $request->user();
        $group = ChatGroup::whereHas('members', fn($q) => $q->where('user_id', $user->id))
            ->findOrFail($id);

        $isAdmin = ChatGroupMember::where('group_id', $group->id)
            ->where('user_id', $user->id)
            ->where('is_admin', true)
            ->exists();

        $request->validate([
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:5000',
            'notes' => 'nullable|string|max:5000',
        ]);

        $updateData = [];
        if ($request->has('name')) $updateData['name'] = $request->name;
        if ($request->has('description')) {
            if (!$isAdmin) return response()->json(['message' => 'Hanya admin yang dapat mengubah deskripsi grup'], 403);
            $updateData['description'] = $request->description;
        }
        if ($request->has('notes')) {
            if (!$isAdmin) return response()->json(['message' => 'Hanya admin yang dapat mengubah catatan grup'], 403);
            $updateData['notes'] = $request->notes;
        }

        if (!empty($updateData)) {
            $group->update($updateData);
        }

        $group->load('memberUsers');

        return response()->json(['group' => $group, 'message' => 'Grup berhasil diperbarui']);
    }

    public function toggleAdmin(Request $request, $id, $userId)
    {
        $user = $request->user();
        $group = ChatGroup::whereHas('members', fn($q) => $q->where('user_id', $user->id))
            ->findOrFail($id);

        $isAdmin = ChatGroupMember::where('group_id', $group->id)
            ->where('user_id', $user->id)
            ->where('is_admin', true)
            ->exists();

        if (!$isAdmin) {
            return response()->json(['message' => 'Hanya admin grup yang dapat mengelola admin'], 403);
        }

        $member = ChatGroupMember::where('group_id', $group->id)
            ->where('user_id', $userId)
            ->firstOrFail();

        $member->update(['is_admin' => !$member->is_admin]);

        return response()->json([
            'message' => $member->is_admin ? 'Anggota dijadikan admin' : 'Admin diturunkan menjadi anggota',
            'is_admin' => $member->is_admin,
            'user_id' => (int) $userId,
        ]);
    }

    public function removeMember(Request $request, $id, $userId)
    {
        $user = $request->user();
        $group = ChatGroup::whereHas('members', fn($q) => $q->where('user_id', $user->id))
            ->findOrFail($id);

        if ((int) $userId === (int) $user->id) {
            return response()->json(['message' => 'Tidak dapat mengeluarkan diri sendiri'], 422);
        }

        $isAdmin = ChatGroupMember::where('group_id', $group->id)
            ->where('user_id', $user->id)
            ->where('is_admin', true)
            ->exists();

        if (!$isAdmin) {
            return response()->json(['message' => 'Hanya admin grup yang dapat mengeluarkan anggota'], 403);
        }

        $member = ChatGroupMember::where('group_id', $group->id)
            ->where('user_id', $userId)
            ->firstOrFail();

        if ($member->is_admin) {
            return response()->json(['message' => 'Tidak dapat mengeluarkan admin grup'], 422);
        }

        $member->delete();

        return response()->json(['message' => 'Anggota berhasil dikeluarkan dari grup']);
    }

    public function deleteMessage(Request $request, $id, $messageId)
    {
        $user = $request->user();
        $group = ChatGroup::whereHas('members', fn($q) => $q->where('user_id', $user->id))
            ->findOrFail($id);

        $message = ChatMessage::where('group_id', $group->id)
            ->findOrFail($messageId);

        $request->validate([
            'type' => 'required|in:me,everyone',
        ]);

        if ($request->type === 'everyone') {
            if ((int) $message->sender_id !== (int) $user->id) {
                return response()->json(['message' => 'Hanya pengirim yang dapat menghapus pesan untuk semua'], 403);
            }
            $message->update([
                'is_deleted' => true,
                'deleted_at' => now(),
            ]);
        } else {
            $deletedFor = $message->deleted_for ?? [];
            if (!in_array((string) $user->id, $deletedFor)) {
                $deletedFor[] = (string) $user->id;
            }
            $message->update(['deleted_for' => $deletedFor]);
        }

        return response()->json(['message' => 'Pesan berhasil dihapus']);
    }

    public function onlineUsers(Request $request)
    {
        $user = $request->user();
        $threshold = now()->subMinutes(5);

        $query = User::where('last_activity_at', '>=', $threshold)
            ->where('is_active', true)
            ->select('id', 'name', 'role', 'avatar', 'last_activity_at');

        if ($user->isSuperadmin()) {
            $query->where('role', 'guru');
        } elseif ($user->isGuru()) {
            $studentIds = DB::table('student_group_user')
                ->whereIn('student_group_id', function ($q) use ($user) {
                    $q->select('id')->from('student_groups')
                        ->where('wali_kelas_id', $user->id);
                })
                ->pluck('user_id');
            $query->where(function ($q) use ($user, $studentIds) {
                $q->where('role', 'superadmin')
                  ->orWhereIn('id', $studentIds);
            });
        } elseif ($user->isSiswa()) {
            $waliKelasIds = DB::table('student_groups')
                ->whereIn('id', function ($q) use ($user) {
                    $q->select('student_group_id')->from('student_group_user')
                        ->where('user_id', $user->id);
                })
                ->pluck('wali_kelas_id');
            $query->where(function ($q) use ($user, $waliKelasIds) {
                $q->where('role', 'superadmin')
                  ->orWhereIn('id', $waliKelasIds);
            });
        } else {
            return response()->json(['users' => []]);
        }

        $users = $query->get()->map(fn($u) => [
            'id' => $u->id,
            'name' => $u->name,
            'role' => $u->role,
            'avatar' => $u->avatar,
            'is_online' => true,
        ]);

        return response()->json(['users' => $users->values()]);
    }
}
