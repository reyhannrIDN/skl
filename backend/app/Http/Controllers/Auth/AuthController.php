<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\SystemSetting;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    public function googleLogin(Request $request)
    {
        $request->validate(['token' => 'required|string']);
        
        $response = Http::withToken($request->token)
            ->get("https://www.googleapis.com/oauth2/v3/userinfo");

        if ($response->failed()) {
            return response()->json(['message' => 'Token Google tidak valid atau sudah kadaluarsa.'], 401);
        }

        $payload = $response->json();
        
        // Use 'sub' as google_id
        $google_id = $payload['sub'];
        $email = $payload['email'];
        $name = $payload['name'];
        $picture = $payload['picture'] ?? null;

        $user = User::where('google_id', $google_id)
            ->orWhere('email', $email)
            ->first();

        if (!$user) {
            // Auto register as student (pending approval)
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'google_id' => $google_id,
                'password' => Hash::make(\Illuminate\Support\Str::random(24)),
                'role' => 'siswa',
                'is_active' => false,
                'avatar' => $picture,
            ]);
            
            NotificationService::logActivity('register_google', 'New user registered via Google: ' . $user->name, $user->id);
            
            return response()->json([
                'message' => 'Registrasi via Google berhasil. Akun Anda menunggu persetujuan admin.',
                'user' => $user,
            ], 201);
        }

        // Update google_id if not set
        if (!$user->google_id) {
            $user->update(['google_id' => $google_id]);
        }

        if (!$user->is_active) {
            return response()->json(['message' => 'Akun Anda sedang menunggu persetujuan admin atau dinonaktifkan.'], 403);
        }

        // Generate Access Token (15 menit)
        $accessToken = $user->createToken('access-token', ['*'], now()->addMinutes(15))->plainTextToken;
        
        // Generate Refresh Token (7 hari)
        $refreshToken = $user->createToken('refresh-token', ['refresh'], now()->addDays(7))->plainTextToken;
        
        NotificationService::logActivity('login_google', 'User logged in via Google', $user->id);

        $cookie = cookie(
            'refresh_token', 
            $refreshToken, 
            60 * 24 * 7,
            '/', 
            null, 
            config('app.env') === 'production',
            true,
            false,
            'Strict'
        );

        return response()->json([
            'message' => 'Login berhasil',
            'user' => $user,
            'access_token' => $accessToken,
        ])->withCookie($cookie);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        $identity = trim($request->email);
        
        // Basic sanitization: only allow alphanumeric, @, . and -
        if (!preg_match('/^[a-zA-Z0-9@\.\-_]+$/', $identity)) {
             return response()->json(['message' => 'Format identitas tidak valid.'], 422);
        }

        $user = User::where('email', $identity)
            ->orWhere('nis', $identity)
            ->orWhere('nip', $identity)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            NotificationService::logActivity('login_failed', 'Failed login attempt for: ' . $identity);
            return response()->json(['message' => 'Kredensial atau password salah.'], 401);
        }

        // Defense in Depth: Validasi is_active
        if (!$user->is_active) {
            return response()->json(['message' => 'Akun Anda sedang menunggu persetujuan admin atau dinonaktifkan.'], 403);
        }

        // Generate Access Token (15 menit)
        $accessToken = $user->createToken('access-token', ['*'], now()->addMinutes(15))->plainTextToken;
        
        // Generate Refresh Token (7 hari)
        $refreshToken = $user->createToken('refresh-token', ['refresh'], now()->addDays(7))->plainTextToken;

        NotificationService::logActivity('login', 'User logged in', $user->id);

        // Kirim Refresh Token via HttpOnly Cookie
        $cookie = cookie(
            'refresh_token', 
            $refreshToken, 
            60 * 24 * 7, // 7 days in minutes
            '/', 
            null, 
            config('app.env') === 'production', // Secure only in prod
            true, // HttpOnly
            false, // Raw
            'Strict' // SameSite
        );

        return response()->json([
            'message' => 'Login berhasil',
            'user' => $user,
            'access_token' => $accessToken,
        ])->withCookie($cookie);
    }

    public function register(Request $request)
    {
        $registrationOpen = SystemSetting::getValue('registration_open', 'true');
        if ($registrationOpen !== 'true') {
            return response()->json(['message' => 'Registrasi sedang ditutup.'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'confirmed', Password::min(8)],
            'nis' => 'nullable|string|max:50',
            'kelas' => 'nullable|string|max:50',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => 'siswa',
            'nis' => $request->nis,
            'kelas' => $request->kelas,
            'is_active' => false, // Require admin approval
        ]);

        NotificationService::logActivity('register', 'New student registered (pending approval): ' . $user->name, $user->id);

        return response()->json([
            'message' => 'Registrasi berhasil. Akun Anda sedang menunggu persetujuan admin sebelum dapat digunakan.',
            'user' => $user,
        ], 201);
    }

    public function logout(Request $request)
    {
        NotificationService::logActivity('logout', 'User logged out');
        
        // Revoke the access token
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        // We also want to revoke the refresh token if possible, but Sanctum PAT doesn't easily let us find it from the cookie unless we parse the token.
        // For simplicity in this architecture, we clear the cookie.
        $cookie = cookie()->forget('refresh_token');

        return response()->json(['message' => 'Logout berhasil'])->withCookie($cookie);
    }

    public function refresh(Request $request)
    {
        $refreshToken = $request->cookie('refresh_token');

        if (!$refreshToken) {
            return response()->json(['message' => 'Refresh token tidak ditemukan.'], 401);
        }

        // Validate the refresh token using Sanctum
        $token = \Laravel\Sanctum\PersonalAccessToken::findToken($refreshToken);

        if (!$token || !$token->can('refresh') || $token->expires_at->isPast()) {
            return response()->json(['message' => 'Refresh token tidak valid atau sudah kadaluarsa.'], 401);
        }

        $user = $token->tokenable;

        if (!$user || !$user->is_active) {
            return response()->json(['message' => 'Akun dinonaktifkan.'], 403);
        }

        // Revoke old refresh token (Token Rotation)
        $token->delete();

        // Issue new tokens
        $newAccessToken = $user->createToken('access-token', ['*'], now()->addMinutes(15))->plainTextToken;
        $newRefreshToken = $user->createToken('refresh-token', ['refresh'], now()->addDays(7))->plainTextToken;

        $cookie = cookie(
            'refresh_token', 
            $newRefreshToken, 
            60 * 24 * 7,
            '/', 
            null, 
            config('app.env') === 'production',
            true,
            false,
            'Lax'
        );

        return response()->json([
            'access_token' => $newAccessToken,
            'user' => $user
        ])->withCookie($cookie);
    }

    public function me(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'avatar' => 'nullable|image|max:2048',
        ]);

        if ($request->has('name')) {
            $user->name = $request->name;
        }

        if ($request->has('email')) {
            $user->email = $request->email;
        }

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $path;
        }

        if ($request->has('phone')) {
            $user->phone = $request->phone;
        }

        $user->save();
        NotificationService::logActivity('update_profile', 'User updated profile');

        return response()->json(['message' => 'Profile updated', 'user' => $user]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Password saat ini salah.'], 422);
        }

        $user->update(['password' => $request->password]);
        NotificationService::logActivity('change_password', 'User changed password');

        return response()->json(['message' => 'Password berhasil diubah']);
    }

    public function getLockSettings(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'lock_enabled' => (bool) $user->lock_enabled,
            'lock_type' => $user->lock_type,
        ]);
    }

    public function updateLockSettings(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'lock_enabled' => 'boolean',
            'lock_type' => 'required_if:lock_enabled,true|string|in:pin,pattern',
            'lock_code' => 'required_if:lock_enabled,true|string|min:3|max:32',
        ]);

        if ($request->lock_enabled) {
            $user->lock_enabled = true;
            $user->lock_type = $request->lock_type;
            $user->lock_code = bcrypt($request->lock_code);
        } else {
            $user->lock_enabled = false;
            $user->lock_type = null;
            $user->lock_code = null;
        }

        $user->save();

        NotificationService::logActivity('update_lock_settings', 'Lock settings updated');

        return response()->json([
            'message' => 'Pengaturan kunci berhasil diperbarui',
            'lock_enabled' => (bool) $user->lock_enabled,
            'lock_type' => $user->lock_type,
        ]);
    }

    public function verifyLock(Request $request)
    {
        $request->validate([
            'lock_code' => 'required|string',
        ]);

        $user = $request->user();

        if (!$user->lock_enabled || !$user->lock_code) {
            return response()->json(['message' => 'Kunci aplikasi tidak aktif'], 400);
        }

        if (!Hash::check($request->lock_code, $user->lock_code)) {
            return response()->json(['message' => 'Kode kunci salah'], 422);
        }

        return response()->json(['message' => 'Verifikasi berhasil', 'verified' => true]);
    }

    public function systemInfo()
    {
        return response()->json([
            'school_name' => SystemSetting::getValue('school_name', 'SMK Digital Nusantara'),
            'academic_year' => SystemSetting::getValue('academic_year', '2025/2026'),
            'registration_open' => SystemSetting::getValue('registration_open', 'true') === 'true',
            'school_logo' => SystemSetting::getValue('school_logo'),
        ]);
    }
}
