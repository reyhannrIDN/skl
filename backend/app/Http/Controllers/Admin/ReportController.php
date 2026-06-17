<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\ProjectSubmission;
use App\Models\User;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function statistics()
    {
        return response()->json([
            'users' => [
                'total' => User::count(),
                'siswa' => User::where('role', 'siswa')->count(),
                'guru' => User::where('role', 'guru')->count(),
            ],
            'submissions' => [
                'total' => ProjectSubmission::count(),
                'draft' => ProjectSubmission::where('status', 'draft')->count(),
                'submitted' => ProjectSubmission::where('status', 'submitted')->count(),
                'under_review' => ProjectSubmission::where('status', 'under_review')->count(),
                'revision' => ProjectSubmission::where('status', 'revision')->count(),
                'approved' => ProjectSubmission::where('status', 'approved')->count(),
                'skl_issued' => ProjectSubmission::where('status', 'skl_issued')->count(),
            ],
        ]);
    }

    public function activityLogs(Request $request)
    {
        $query = ActivityLog::with('user:id,name,role');

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }
        if ($request->filled('date_from')) {
            $query->where('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('created_at', '<=', $request->date_to);
        }

        $logs = $query->orderBy('created_at', 'desc')->paginate($request->per_page ?? 30);

        return response()->json($logs);
    }

    public function exportSubmissions()
    {
        $submissions = ProjectSubmission::with(['user:id,name,kelas,nis', 'reviewer:id,name'])->get();

        return response()->json(['submissions' => $submissions]);
    }
}
