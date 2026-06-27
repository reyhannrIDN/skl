<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Siswa\SubmissionController as SiswaSubmissionController;
use App\Http\Controllers\Guru\SubmissionController as GuruSubmissionController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Guru\GuruCategoryController;
use App\Http\Controllers\Guru\StudentGroupController;
use App\Http\Controllers\Admin\ClassController;
use App\Http\Controllers\Admin\BackupController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Guru\ClassTaskController;
use App\Http\Controllers\Stats\PerformanceController;
use App\Http\Controllers\PublicTrackerController;
use App\Http\Controllers\Chat\ChatController;
use App\Http\Controllers\Idn\IdnController;
use App\Http\Controllers\Idn\LombaController;
use App\Http\Controllers\Guru\IncomeController;

// Public routes
Route::get('/system-info', [AuthController::class, 'systemInfo']);
Route::get('/parent/track/{nis}', [PublicTrackerController::class, 'trackByNis']);
Route::get('/public/lomba-showcase', function () {
    return \App\Models\Lomba::with([
        'tim.peserta:id,nama,nis,kelas,lomba_tim_id',
        'foto',
        'pendamping:id,nama',
    ])->whereHas('foto')
      ->latest()
      ->take(12)
      ->get()
      ->map(fn($l) => [
        'id' => $l->id,
        'nama_lomba' => $l->nama_lomba,
        'tingkat' => $l->tingkat,
        'kategori' => $l->kategori,
        'lokasi' => $l->lokasi,
        'tanggal_mulai' => $l->tanggal_mulai?->format('d M Y'),
        'status_hasil' => $l->status_hasil,
        'juara_ke' => $l->juara_ke,
        'total_tim' => $l->tim->count(),
        'tim' => $l->tim->map(fn($t) => [
            'nama_tim' => $t->nama_tim,
            'jenis_tim' => $t->jenis_tim,
            'peserta' => $t->peserta->map(fn($p) => [
                'nama' => $p->nama,
                'nis' => $p->nis,
                'kelas' => $p->kelas,
            ]),
        ]),
        'pendamping' => $l->pendamping->pluck('nama')->implode(', '),
        'foto' => $l->foto->map(fn($f) => \Illuminate\Support\Facades\Storage::disk('public')->url($f->file_path)),
    ]);
});
Route::get('/public/idn-stats', function () {
    return response()->json([
        'total_students' => \App\Models\IdnStudent::where('is_active', true)->count(),
        'total_schools'  => \App\Models\IdnSchoolVisit::distinct('school_name')->count('school_name'),
        'total_audience' => \App\Models\IdnSchoolVisit::sum('total_audience'),
        'total_teams'    => \App\Models\IdnSchoolVisit::distinct('team_name')->count('team_name'),
        'total_lomba'    => \App\Models\Lomba::count(),
    ]);
});

// Auth routes
Route::group(['prefix' => 'auth', 'middleware' => 'throttle:auth_limit'], function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/google', [AuthController::class, 'googleLogin']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
});

// Protected routes
Route::group(['middleware' => 'auth:sanctum'], function () {

    // Auth
    Route::group(['prefix' => 'auth'], function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
        Route::get('/lock-settings', [AuthController::class, 'getLockSettings']);
        Route::put('/lock-settings', [AuthController::class, 'updateLockSettings']);
        Route::post('/verify-lock', [AuthController::class, 'verifyLock']);
    });

    // Notifications (all roles)
    Route::group(['prefix' => 'notifications'], function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::put('/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::put('/read-all', [NotificationController::class, 'markAllAsRead']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
    });

    // Siswa routes
    Route::group(['middleware' => 'role:siswa', 'prefix' => 'submissions'], function () {
        Route::get('/categories', [SiswaSubmissionController::class, 'getCategories']);
        Route::get('/my', [SiswaSubmissionController::class, 'my']);
        Route::post('/', [SiswaSubmissionController::class, 'store']);
        Route::get('/{submission}', [SiswaSubmissionController::class, 'show']);
        Route::put('/{submission}', [SiswaSubmissionController::class, 'update']);
        Route::delete('/{submission}', [SiswaSubmissionController::class, 'destroy']);
        Route::post('/{submission}/files', [SiswaSubmissionController::class, 'uploadFiles']);
        Route::delete('/{submission}/files/{fileId}', [SiswaSubmissionController::class, 'deleteFile']);
    });

    // Guru routes
    Route::group(['middleware' => 'role:guru', 'prefix' => 'guru'], function () {
        Route::get('/submissions', [GuruSubmissionController::class, 'index']);
        Route::get('/submissions/{submission}', [GuruSubmissionController::class, 'show']);
        Route::post('/submissions/{submission}/review', [GuruSubmissionController::class, 'review']);
        Route::put('/submissions/{submission}/checklist/{itemId}', [GuruSubmissionController::class, 'updateChecklistItem']);
        Route::post('/submissions/{submission}/issue-skl', [GuruSubmissionController::class, 'issueSkl']);
        Route::post('/submissions/{submission}/request-revision', [GuruSubmissionController::class, 'requestRevision']);
        Route::get('/statistics', [GuruSubmissionController::class, 'statistics']);

        // Category Management (Guru)
        Route::apiResource('categories', GuruCategoryController::class);
        Route::post('/categories/{id}/requirements', [GuruCategoryController::class, 'updateRequirements']);

        // Student Group Management (Guru)
        Route::get('/students/available', [StudentGroupController::class, 'availableStudents']);
        Route::get('/my-class', [StudentGroupController::class, 'myClass']); // New: get my wali kelas class
        Route::post('/groups/{id}/students', [StudentGroupController::class, 'addStudents']);
        Route::delete('/groups/{id}/students/{studentId}', [StudentGroupController::class, 'removeStudent']);
        Route::put('/students/{studentId}', [StudentGroupController::class, 'updateStudentDetail']);

        // Class Task Management (Wali Kelas)
        Route::apiResource('tasks', ClassTaskController::class);

        // Income Management (Wali Kelas)
        Route::prefix('income')->group(function () {
            Route::get('/dashboard', [IncomeController::class, 'dashboard']);
            Route::get('/students', [IncomeController::class, 'students']);
            Route::post('/transactions', [IncomeController::class, 'store']);
            Route::get('/transactions/{studentId}', [IncomeController::class, 'transactions']);
            Route::put('/transactions/{id}', [IncomeController::class, 'update']);
            Route::delete('/transactions/{id}', [IncomeController::class, 'destroy']);
            Route::get('/charts', [IncomeController::class, 'charts']);
            Route::get('/export/excel', [IncomeController::class, 'exportExcel']);
            Route::get('/export/pdf', [IncomeController::class, 'exportPdf']);
        });
    });

    // Admin routes
    Route::group(['middleware' => 'role:superadmin', 'prefix' => 'admin'], function () {
        // User management
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::post('/users/{id}/reset-password', [UserController::class, 'resetPassword']);

        // Settings
        Route::get('/settings', [SettingController::class, 'index']);
        Route::put('/settings', [SettingController::class, 'update']);
        Route::put('/settings/registration', [SettingController::class, 'toggleRegistration']);
        Route::post('/settings/logo', [SettingController::class, 'uploadLogo']);

        // Export & Stats
        Route::get('/statistics', [ReportController::class, 'statistics']);
        Route::get('/activity-logs', [ReportController::class, 'activityLogs']);
        Route::get('/export/submissions', [ReportController::class, 'exportSubmissions']);

        // Class Management (Admin)
        Route::get('/eligible-teachers', [ClassController::class, 'getEligibleTeachers']);
        Route::apiResource('classes', ClassController::class);

        // Stats & Performance (Admin)
        Route::group(['prefix' => 'performance'], function() {
            Route::get('/classes', [PerformanceController::class, 'getClasses']);
            Route::get('/categories', [PerformanceController::class, 'getCategories']);
            Route::get('/data/{classId}/{categoryId}', [PerformanceController::class, 'getPerformanceData']);
        });

        // Backup Management
        Route::group(['prefix' => 'backups'], function () {
            Route::get('/', [BackupController::class, 'index']);
            Route::post('/', [BackupController::class, 'store']);
            Route::post('/restore-upload', [BackupController::class, 'restoreFromUpload']);
            Route::get('/{filename}/download', [BackupController::class, 'download'])->where('filename', '.*');
            Route::post('/{filename}/restore', [BackupController::class, 'restore'])->where('filename', '.*');
            Route::delete('/{filename}', [BackupController::class, 'destroy'])->where('filename', '.*');
            Route::get('/schedule', [BackupController::class, 'getSchedule']);
            Route::put('/schedule', [BackupController::class, 'updateSchedule']);
        });

        // Income Management (Admin - read only & monitoring)
        Route::prefix('income')->group(function () {
            Route::get('/dashboard', [IncomeController::class, 'dashboard']);
            Route::get('/students', [IncomeController::class, 'students']);
            Route::get('/transactions/{studentId}', [IncomeController::class, 'transactions']);
            Route::get('/charts', [IncomeController::class, 'charts']);
            Route::get('/export/excel', [IncomeController::class, 'exportExcel']);
            Route::get('/export/pdf', [IncomeController::class, 'exportPdf']);
        });

        // Permission Management
        Route::get('/permissions', [PermissionController::class, 'index']);
        Route::put('/permissions/{id}', [PermissionController::class, 'update']);
    });

    // Chat routes (Guru, Admin, and Siswa)
    Route::group(['middleware' => 'role:guru,superadmin,siswa', 'prefix' => 'chat'], function () {
        Route::get('/groups', [ChatController::class, 'groups']);
        Route::post('/groups', [ChatController::class, 'createGroup']);
        Route::get('/groups/{id}', [ChatController::class, 'getGroup']);
        Route::get('/groups/{id}/messages', [ChatController::class, 'messages']);
        Route::post('/groups/{id}/messages', [ChatController::class, 'sendMessage']);
        Route::post('/groups/{id}/messages/{messageId}/pin', [ChatController::class, 'togglePinMessage']);
        Route::post('/groups/{id}/messages/{messageId}/delete', [ChatController::class, 'deleteMessage']);
        Route::get('/groups/{id}/pinned', [ChatController::class, 'pinnedMessages']);
        Route::post('/groups/{id}/members', [ChatController::class, 'addMembers']);
        Route::get('/groups/{id}/members', [ChatController::class, 'groupMembers']);
        Route::post('/groups/{id}/photo', [ChatController::class, 'uploadGroupPhoto']);
        Route::put('/groups/{id}', [ChatController::class, 'updateGroup']);
        Route::post('/groups/{id}/admin/{userId}', [ChatController::class, 'toggleAdmin']);
        Route::delete('/groups/{id}/members/{userId}', [ChatController::class, 'removeMember']);
        Route::post('/groups/{id}/read', [ChatController::class, 'markAsRead']);
        Route::get('/contacts', [ChatController::class, 'contacts']);
        Route::get('/online-users', [ChatController::class, 'onlineUsers']);
    });

    // IDN routes
    Route::group(['middleware' => 'role:idn', 'prefix' => 'idn'], function () {
        Route::get('/dashboard', [IdnController::class, 'dashboard']);

        Route::get('/students', [IdnController::class, 'students']);
        Route::post('/students', [IdnController::class, 'storeStudent']);
        Route::put('/students/{student}', [IdnController::class, 'updateStudent']);
        Route::delete('/students/{student}', [IdnController::class, 'destroyStudent']);

        Route::get('/school-visits', [IdnController::class, 'schoolVisits']);
        Route::post('/school-visits', [IdnController::class, 'storeSchoolVisit']);
        Route::put('/school-visits/{visit}', [IdnController::class, 'updateSchoolVisit']);
        Route::delete('/school-visits/{visit}', [IdnController::class, 'destroySchoolVisit']);
    });

    // Lomba routes (Superadmin, IDN, Guru, Kepala Sekolah)
    Route::group(['middleware' => 'role:superadmin,idn,guru,kepala_sekolah', 'prefix' => 'lomba'], function () {
        Route::get('/dashboard', [LombaController::class, 'dashboard']);
        Route::get('/referensi/siswa-guru', [LombaController::class, 'referensi']);
        Route::get('/export/excel', [LombaController::class, 'exportExcel']);
        Route::get('/export/pdf', [LombaController::class, 'exportPdf']);
        Route::get('/', [LombaController::class, 'index']);
        Route::post('/', [LombaController::class, 'store']);
        Route::get('/{id}', [LombaController::class, 'show']);
        Route::put('/{id}', [LombaController::class, 'update']);
        Route::delete('/{id}', [LombaController::class, 'destroy']);
        Route::delete('/foto/{id}', [LombaController::class, 'deleteFoto']);
        Route::post('/{id}/foto', [LombaController::class, 'uploadFoto']);
    });

    // Shared Stats for Guru/Admin (Already covered by role limits if needed, but let's add them specifically for Guru too)
    Route::group(['middleware' => 'role:guru,superadmin', 'prefix' => 'stats'], function() {
        Route::get('/performance/classes', [PerformanceController::class, 'getClasses']);
        Route::get('/performance/categories', [PerformanceController::class, 'getCategories']);
        Route::get('/performance/data/{classId}/{categoryId}', [PerformanceController::class, 'getPerformanceData']);
        Route::get('/performance/class-monitoring/{classId}', [PerformanceController::class, 'getClassMonitoring']);
    });
});
