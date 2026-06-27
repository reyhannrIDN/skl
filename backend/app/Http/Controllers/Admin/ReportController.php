<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\ProjectSubmission;
use App\Models\User;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

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
        $submissions = ProjectSubmission::with(['user:id,name,kelas,nis', 'reviewer:id,name', 'category'])->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Rekap SKL');

        // ─── Header styling ───
        $headerStyle = [
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF'], 'size' => 11],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '4338CA']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
        ];

        $headers = ['No', 'NIS', 'Nama Siswa', 'Kelas', 'Judul Project', 'Kategori', 'Status', 'File', 'Reviewer', 'Tanggal Upload'];
        $col = 'A';
        foreach ($headers as $i => $header) {
            $sheet->setCellValue($col . '1', $header);
            $col++;
        }

        // ─── Set column widths ───
        $sheet->getColumnDimension('A')->setWidth(5);
        $sheet->getColumnDimension('B')->setWidth(14);
        $sheet->getColumnDimension('C')->setWidth(30);
        $sheet->getColumnDimension('D')->setWidth(12);
        $sheet->getColumnDimension('E')->setWidth(40);
        $sheet->getColumnDimension('F')->setWidth(18);
        $sheet->getColumnDimension('G')->setWidth(16);
        $sheet->getColumnDimension('H')->setWidth(40);
        $sheet->getColumnDimension('I')->setWidth(22);
        $sheet->getColumnDimension('J')->setWidth(18);

        $sheet->getRowDimension(1)->setRowHeight(20);
        $sheet->getStyle('A1:J1')->applyFromArray($headerStyle);

        // ─── Data rows ───
        $row = 2;
        $statusMap = [
            'draft' => 'Draft',
            'submitted' => 'Submitted',
            'under_review' => 'Under Review',
            'revision' => 'Revisi',
            'approved' => 'Disetujui',
            'skl_issued' => 'SKL Terbit',
        ];

        $borderStyle = [
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
            'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
        ];

        foreach ($submissions as $i => $s) {
            $sheet->setCellValue('A' . $row, $i + 1);
            $sheet->setCellValue('B' . $row, $s->user->nis ?? '');
            $sheet->setCellValue('C' . $row, $s->user->name ?? '');
            $sheet->setCellValue('D' . $row, $s->user->kelas ?? '');
            $sheet->setCellValue('E' . $row, $s->project_title ?? '');
            $sheet->setCellValue('F' . $row, $s->category?->name ?? '');
            $sheet->setCellValue('G' . $row, $statusMap[$s->status] ?? $s->status ?? '');
            $sheet->setCellValue('H' . $row, $s->file_path ?? '');
            $sheet->setCellValue('I' . $row, $s->reviewer->name ?? '-');
            $sheet->setCellValue('J' . $row, $s->created_at ? $s->created_at->format('d/m/Y') : '');

            $sheet->getStyle('A' . $row . ':J' . $row)->applyFromArray($borderStyle);
            $sheet->getRowDimension($row)->setRowHeight(18);
            $row++;
        }

        // ─── Auto filter ───
        $sheet->setAutoFilter('A1:J' . ($row - 1));

        // ─── Write to output ───
        $writer = new Xlsx($spreadsheet);
        ob_start();
        $writer->save('php://output');
        $content = ob_get_clean();

        return response($content, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="Rekap_SKL_' . date('Y-m-d') . '.xlsx"',
            'Content-Length' => strlen($content),
        ]);
    }
}
