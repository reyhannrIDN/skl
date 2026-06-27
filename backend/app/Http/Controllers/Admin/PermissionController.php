<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function index(Request $request)
    {
        $query = User::whereIn('role', ['guru', 'siswa', 'idn']);

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->orderBy('role')->orderBy('name')->get(['id', 'name', 'email', 'role', 'permissions']);

        return response()->json([
            'users' => $users->map(function ($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'role' => $u->role,
                    'permissions' => $u->permissions,
                ];
            }),
            'available_permissions' => User::availablePermissions(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'permissions' => 'nullable|array',
        ]);

        $user->update(['permissions' => $request->permissions]);

        return response()->json([
            'message' => 'Permissions berhasil diperbarui',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->role,
                'permissions' => $user->permissions,
            ],
        ]);
    }
}
