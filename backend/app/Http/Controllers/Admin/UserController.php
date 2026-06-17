<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }
        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }
        if ($request->filled('kelas')) {
            $query->where('kelas', $request->kelas);
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%");
            });
        }

        $users = $query->with('teachingGroups')->orderBy('created_at', 'desc')->paginate($request->per_page ?? 20);

        return response()->json($users);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['nullable', Password::min(8)],
            'role' => 'required|in:superadmin,guru,siswa',
            'nis' => 'nullable|string|max:50',
            'nip' => 'nullable|string|max:50',
            'specialty' => 'nullable|string|max:100',
            'kelas' => 'nullable|string|max:50',
            'angkatan' => 'nullable|integer',
            'phone' => 'nullable|string|max:20',
        ]);

        $user = DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password ?? 'password123',
                'role' => $request->role,
                'nis' => $request->nis,
                'nip' => $request->nip,
                'specialty' => $request->specialty,
                'kelas' => $request->kelas,
                'angkatan' => $request->angkatan,
                'phone' => $request->phone,
                'is_active' => true,
            ]);

            if ($request->role === 'guru' && $request->filled('teaching_group_ids')) {
                $user->teachingGroups()->sync($request->teaching_group_ids);
            }

            return $user;
        });

        NotificationService::logActivity('create_user', "Created user: {$user->name} ({$user->role})");

        return response()->json(['message' => 'User berhasil dibuat', 'user' => $user->load('teachingGroups')], 201);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json(['user' => $user]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => "sometimes|email|unique:users,email,{$id}",
            'role' => 'sometimes|in:superadmin,guru,siswa',
            'nis' => 'nullable|string|max:50',
            'nip' => 'nullable|string|max:50',
            'specialty' => 'nullable|string|max:100',
            'kelas' => 'nullable|string|max:50',
            'angkatan' => 'nullable|integer',
            'phone' => 'nullable|string|max:20',
            'is_active' => 'sometimes|boolean',
        ]);

        DB::transaction(function () use ($request, $user) {
            $user->update($request->only([
                'name', 'email', 'role', 'specialty', 'nis', 'nip', 'kelas', 'angkatan', 'phone', 'is_active',
            ]));

            if ($request->role === 'guru' && $request->has('teaching_group_ids')) {
                $user->teachingGroups()->sync($request->teaching_group_ids ?? []);
            }
        });

        NotificationService::logActivity('update_user', "Updated user: {$user->name}");

        return response()->json(['message' => 'User berhasil diperbarui', 'user' => $user->load('teachingGroups')]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        NotificationService::logActivity('delete_user', "Deleted user: {$user->name}");
        return response()->json(['message' => 'User berhasil dihapus']);
    }

    public function resetPassword(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $newPassword = $request->password ?? Str::random(10);
        $user->update(['password' => $newPassword]);
        NotificationService::logActivity('reset_password', "Reset password for: {$user->name}");

        return response()->json([
            'message' => 'Password berhasil direset',
            'new_password' => $newPassword, // Show to admin only
        ]);
    }
}
