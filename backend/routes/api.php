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
use App\Http\Controllers\Guru\ClassTaskController;
use App\Http\Controllers\Stats\PerformanceController;
use App\Http\Controllers\PublicTrackerController;

// Public routes
Route::get('/system-info', [AuthController::class, 'systemInfo']);
Route::get('/parent/track/{nis}', [PublicTrackerController::class, 'trackByNis']);

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
    });

    // Shared Stats for Guru/Admin (Already covered by role limits if needed, but let's add them specifically for Guru too)
    Route::group(['middleware' => 'role:guru,superadmin', 'prefix' => 'stats'], function() {
        Route::get('/performance/classes', [PerformanceController::class, 'getClasses']);
        Route::get('/performance/categories', [PerformanceController::class, 'getCategories']);
        Route::get('/performance/data/{classId}/{categoryId}', [PerformanceController::class, 'getPerformanceData']);
        Route::get('/performance/class-monitoring/{classId}', [PerformanceController::class, 'getClassMonitoring']);
    });
});
