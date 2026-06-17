<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\ProjectSubmission;

class SubmissionLockMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $submissionId = $request->route('id') ?? $request->route('submission');

        if ($submissionId) {
            $submission = ProjectSubmission::find($submissionId);

            if ($submission && $submission->is_locked) {
                return response()->json([
                    'message' => 'Submission ini sudah terkunci. Tidak dapat diubah.',
                ], 403);
            }
        }

        return $next($request);
    }
}
