<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        $settings = SystemSetting::all()->pluck('value', 'key');
        return response()->json(['settings' => $settings]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
        ]);

        foreach ($request->settings as $key => $value) {
            SystemSetting::setValue($key, $value, $request->user()->id);
        }

        NotificationService::logActivity('update_settings', 'Updated system settings');

        return response()->json(['message' => 'Settings berhasil diperbarui']);
    }

    public function toggleRegistration(Request $request)
    {
        $current = SystemSetting::getValue('registration_open', 'true');
        $newVal = $current === 'true' ? 'false' : 'true';
        SystemSetting::setValue('registration_open', $newVal, $request->user()->id);

        NotificationService::logActivity('toggle_registration', "Registration toggled to: {$newVal}");

        return response()->json([
            'message' => 'Status registrasi diubah',
            'registration_open' => $newVal === 'true',
        ]);
    }

    public function uploadLogo(Request $request)
    {
        $request->validate(['logo' => 'required|image|max:2048']);
        $path = $request->file('logo')->store('settings', 'public');
        SystemSetting::setValue('school_logo', $path, $request->user()->id);
        NotificationService::logActivity('upload_logo', 'Uploaded school logo');
        return response()->json(['message' => 'Logo berhasil diupload', 'path' => $path]);
    }
}
