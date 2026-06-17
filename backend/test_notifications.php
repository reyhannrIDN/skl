<?php

use App\Models\User;
use App\Models\ProjectSubmission;
use App\Models\ProjectCategory;
use App\Models\StudentGroup;
use App\Services\NotificationService;
use Illuminate\Support\Facades\DB;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Test Notification logic
function testNotifications() {
    $student = User::where('role', 'siswa')->first();
    if (!$student) return "No student found";

    $submission = ProjectSubmission::where('user_id', $student->id)->latest()->first();
    if (!$submission) return "No submission found";

    echo "Testing notifyProjectTeachers for student: " . $student->name . " and project: " . $submission->judul_project . "\n";
    
    // Clear old notifications for testing
    // DB::table('notifications')->truncate();

    NotificationService::notifyProjectTeachers($submission, "Test Title", "Test Message");
    
    $notifs = DB::table('notifications')->latest()->limit(5)->get();
    echo "Recent Notifications Created: " . $notifs->count() . "\n";
    foreach ($notifs as $n) {
        $u = User::find($n->user_id);
        echo "- User: " . $u->name . " (Role: " . $u->role . ") - Title: " . $n->title . "\n";
    }
}

testNotifications();
