<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\StudentIncome;
use App\Models\User;
use App\Models\StudentGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class IncomeController extends Controller
{
    private function getStudentIds($user)
    {
        if ($user->isSuperadmin()) {
            return User::where('role', 'siswa')->where('is_active', true)->pluck('id');
        }
        $groupIds = $user->waliKelasGroups()->pluck('id');
        return DB::table('student_group_user')
            ->whereIn('student_group_id', $groupIds)
            ->pluck('user_id');
    }

    public function dashboard(Request $request)
    {
        $user = $request->user();
        $studentIds = $this->getStudentIds($user);

        $query = StudentIncome::whereIn('user_id', $studentIds);

        $month = $request->month;
        $year = $request->year;

        if ($month) {
            $query->whereMonth('transaction_date', $month);
        }
        if ($year) {
            $query->whereYear('transaction_date', $year);
        }

        $totalIncome = (float) $query->sum('amount');
        $totalTransactions = $query->count();
        $studentsWithIncome = $query->distinct('user_id')->count('user_id');
        $totalStudents = $studentIds->count();
        $studentsWithoutIncome = $totalStudents - $studentsWithIncome;

        return response()->json([
            'stats' => [
                'total_income' => $totalIncome,
                'total_transactions' => $totalTransactions,
                'students_with_income' => $studentsWithIncome,
                'students_without_income' => max(0, $studentsWithoutIncome),
                'total_students' => $totalStudents,
            ],
        ]);
    }

    public function students(Request $request)
    {
        $user = $request->user();
        $studentIds = $this->getStudentIds($user);

        if ($studentIds->isEmpty()) {
            return response()->json(['students' => [], 'kelas_list' => []]);
        }

        $students = User::whereIn('id', $studentIds)
            ->where('role', 'siswa')
            ->when($request->search, fn($q, $v) => $q->where('name', 'like', "%{$v}%"))
            ->when($request->kelas, fn($q, $v) => $q->where('kelas', $v))
            ->get(['id', 'name', 'kelas', 'nis'])
            ->keyBy('id');

        $stats = StudentIncome::whereIn('user_id', $students->keys())
            ->selectRaw('user_id, SUM(amount) as total_income, COUNT(*) as transaction_count, MAX(transaction_date) as last_date')
            ->groupBy('user_id')
            ->get()
            ->keyBy('user_id');

        $result = $students->map(function ($student) use ($stats) {
            $s = $stats->get($student->id);
            return [
                'id' => $student->id,
                'name' => $student->name,
                'kelas' => $student->kelas,
                'nis' => $student->nis,
                'total_income' => $s ? (float) $s->total_income : 0,
                'transaction_count' => $s ? (int) $s->transaction_count : 0,
                'last_amount' => null,
                'last_date' => $s ? $s->last_date : null,
            ];
        })->sortByDesc('total_income')->values();

        $kelasList = User::whereIn('id', $studentIds)
            ->where('role', 'siswa')
            ->whereNotNull('kelas')
            ->distinct()
            ->pluck('kelas')
            ->sort()
            ->values();

        return response()->json([
            'students' => $result,
            'kelas_list' => $kelasList,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user->isGuru() && !$user->isSuperadmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:0',
            'transaction_date' => 'required|date',
            'description' => 'nullable|string|max:1000',
            'file' => 'nullable|file|max:10240',
        ]);

        if ($user->isGuru()) {
            $studentIds = $this->getStudentIds($user);
            if (!in_array($validated['user_id'], $studentIds->toArray())) {
                return response()->json(['message' => 'Siswa bukan anggota kelas Anda'], 403);
            }
        }

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $this->uploadProofFile($request->file('file'));
        }

        $income = StudentIncome::create([
            'user_id' => $validated['user_id'],
            'amount' => $validated['amount'],
            'transaction_date' => $validated['transaction_date'],
            'description' => $validated['description'],
            'file_path' => $filePath,
            'input_by' => $user->id,
        ]);

        $income->load(['student:id,name,kelas,nis', 'inputter:id,name']);

        return response()->json([
            'message' => 'Pendapatan berhasil ditambahkan',
            'income' => $income,
        ], 201);
    }

    private function uploadProofFile($file)
    {
        $ext = strtolower($file->getClientOriginalExtension());
        $supported = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];

        if (in_array($ext, $supported)) {
            $image = match ($ext) {
                'jpg', 'jpeg' => @imagecreatefromjpeg($file->getRealPath()),
                'png' => @imagecreatefrompng($file->getRealPath()),
                'gif' => @imagecreatefromgif($file->getRealPath()),
                'webp' => @imagecreatefromwebp($file->getRealPath()),
                'bmp' => @imagecreatefrombmp($file->getRealPath()),
                default => null,
            };

            if ($image) {
                $filename = 'income-proof/' . uniqid() . '.webp';
                $tempPath = sys_get_temp_dir() . '/' . basename($filename);

                if (imagewebp($image, $tempPath, 80)) {
                    Storage::disk('public')->put($filename, file_get_contents($tempPath));
                    unlink($tempPath);
                    imagedestroy($image);
                    return $filename;
                }
                imagedestroy($image);
            }
        }

        return $file->store('income-proof', 'public');
    }

    public function transactions(Request $request, $studentId)
    {
        $user = $request->user();

        if ($user->isGuru()) {
            $studentIds = $this->getStudentIds($user);
            if (!in_array((int) $studentId, $studentIds->toArray())) {
                return response()->json(['message' => 'Siswa bukan anggota kelas Anda'], 403);
            }
        }

        $student = User::where('role', 'siswa')->findOrFail($studentId);

        $incomes = StudentIncome::where('user_id', $studentId)
            ->with('inputter:id,name')
            ->orderByDesc('transaction_date')
            ->orderByDesc('created_at')
            ->get();

        $total = $incomes->sum('amount');

        return response()->json([
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'kelas' => $student->kelas,
                'nis' => $student->nis,
            ],
            'transactions' => $incomes->map(function ($inc) {
                return [
                    'id' => $inc->id,
                    'amount' => (float) $inc->amount,
                    'transaction_date' => $inc->transaction_date->format('Y-m-d'),
                    'description' => $inc->description,
                    'file_url' => $inc->file_path ? Storage::disk('public')->url($inc->file_path) : null,
                    'input_by_name' => $inc->inputter?->name,
                    'created_at' => $inc->created_at,
                ];
            }),
            'total_income' => (float) $total,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $income = StudentIncome::findOrFail($id);

        if ($user->isGuru()) {
            $studentIds = $this->getStudentIds($user);
            if (!in_array($income->user_id, $studentIds->toArray())) {
                return response()->json(['message' => 'Siswa bukan anggota kelas Anda'], 403);
            }
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'transaction_date' => 'required|date',
            'description' => 'nullable|string|max:1000',
        ]);

        $income->update($validated);

        return response()->json([
            'message' => 'Transaksi berhasil diperbarui',
            'income' => $income->fresh()->load(['student:id,name,kelas,nis', 'inputter:id,name']),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $income = StudentIncome::findOrFail($id);

        if ($user->isGuru()) {
            $studentIds = $this->getStudentIds($user);
            if (!in_array($income->user_id, $studentIds->toArray())) {
                return response()->json(['message' => 'Siswa bukan anggota kelas Anda'], 403);
            }
        }

        $income->delete();

        return response()->json(['message' => 'Transaksi berhasil dihapus']);
    }

    public function charts(Request $request)
    {
        $user = $request->user();
        $studentIds = $this->getStudentIds($user);

        $year = $request->year ?? now()->year;

        $monthly = StudentIncome::whereIn('user_id', $studentIds)
            ->whereYear('transaction_date', $year)
            ->select(
                DB::raw('MONTH(transaction_date) as month'),
                DB::raw('SUM(amount) as total')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month');

        $monthlyData = collect(range(1, 12))->map(function ($m) use ($monthly) {
            return [
                'month' => $m,
                'month_name' => date('F', mktime(0, 0, 0, $m, 1)),
                'total' => (float) ($monthly[$m]->total ?? 0),
            ];
        });

        $perKelas = StudentIncome::whereIn('student_incomes.user_id', $studentIds)
            ->join('users', 'student_incomes.user_id', '=', 'users.id')
            ->select('users.kelas', DB::raw('SUM(student_incomes.amount) as total'))
            ->whereNotNull('users.kelas')
            ->groupBy('users.kelas')
            ->orderByDesc('total')
            ->get();

        $topStudents = StudentIncome::whereIn('user_id', $studentIds)
            ->select('user_id', DB::raw('SUM(amount) as total'), DB::raw('COUNT(*) as count'))
            ->groupBy('user_id')
            ->orderByDesc('total')
            ->take(10)
            ->with('student:id,name,kelas')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->student?->name ?? 'Unknown',
                    'kelas' => $item->student?->kelas ?? '-',
                    'total' => (float) $item->total,
                    'count' => $item->count,
                ];
            });

        $target = (float) ($request->target ?? 10000000);
        $realization = (float) StudentIncome::whereIn('user_id', $studentIds)
            ->whereYear('transaction_date', $year)
            ->sum('amount');

        return response()->json([
            'monthly' => $monthlyData,
            'per_kelas' => $perKelas,
            'top_students' => $topStudents,
            'target_vs_realization' => [
                'target' => $target,
                'realization' => $realization,
                'percentage' => $target > 0 ? round(($realization / $target) * 100, 2) : 0,
            ],
        ]);
    }

    public function exportExcel(Request $request)
    {
        $user = $request->user();
        $studentIds = $this->getStudentIds($user);

        $query = StudentIncome::whereIn('user_id', $studentIds)
            ->with(['student:id,name,kelas,nis', 'inputter:id,name'])
            ->orderByDesc('transaction_date');

        if ($request->month) {
            $query->whereMonth('transaction_date', $request->month);
        }
        if ($request->year) {
            $query->whereYear('transaction_date', $request->year);
        }
        if ($request->kelas) {
            $query->whereHas('student', fn($q) => $q->where('kelas', $request->kelas));
        }

        $incomes = $query->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Data Pendapatan');

        $headers = ['Nama Siswa', 'Kelas', 'NIS', 'Tanggal', 'Nominal', 'Keterangan', 'Diinput Oleh'];
        $col = 'A';
        foreach ($headers as $header) {
            $sheet->setCellValue($col . '1', $header);
            $sheet->getColumnDimension($col)->setAutoSize(true);
            $col++;
        }

        $row = 2;
        foreach ($incomes as $inc) {
            $sheet->setCellValue('A' . $row, $inc->student?->name ?? '-');
            $sheet->setCellValue('B' . $row, $inc->student?->kelas ?? '-');
            $sheet->setCellValue('C' . $row, $inc->student?->nis ?? '-');
            $sheet->setCellValue('D' . $row, $inc->transaction_date->format('Y-m-d'));
            $sheet->setCellValue('E' . $row, $inc->amount);
            $sheet->setCellValue('F' . $row, $inc->description ?? '-');
            $sheet->setCellValue('G' . $row, $inc->inputter?->name ?? '-');
            $row++;
        }

        $sheet->setCellValue('A' . $row, 'TOTAL');
        $sheet->setCellValue('E' . $row, $incomes->sum('amount'));
        $sheet->getStyle('A' . $row)->getFont()->setBold(true);
        $sheet->getStyle('E' . $row)->getFont()->setBold(true);

        $writer = new Xlsx($spreadsheet);
        $filename = 'data-pendapatan-' . now()->format('Ymd') . '.xlsx';

        ob_start();
        $writer->save('php://output');
        $content = ob_get_clean();

        return response($content, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    public function exportPdf(Request $request)
    {
        $user = $request->user();
        $studentIds = $this->getStudentIds($user);

        $query = StudentIncome::whereIn('user_id', $studentIds)
            ->with(['student:id,name,kelas,nis', 'inputter:id,name'])
            ->orderByDesc('transaction_date');

        if ($request->month) {
            $query->whereMonth('transaction_date', $request->month);
        }
        if ($request->year) {
            $query->whereYear('transaction_date', $request->year);
        }
        if ($request->kelas) {
            $query->whereHas('student', fn($q) => $q->where('kelas', $request->kelas));
        }

        $incomes = $query->get();
        $total = $incomes->sum('amount');

        $html = '<html><head><style>
            body { font-family: Arial, sans-serif; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
            th { background: #f4f4f4; font-weight: bold; }
            h2 { text-align: center; margin-bottom: 5px; }
            .total { font-weight: bold; margin-top: 10px; }
            .footer { text-align: center; margin-top: 20px; font-size: 10px; color: #666; }
        </style></head><body>
            <h2>Laporan Data Pendapatan</h2>
            <p style="text-align:center;color:#666;font-size:10px;">' . now()->format('d F Y') . '</p>
            <table>
                <tr><th>Nama Siswa</th><th>Kelas</th><th>Tanggal</th><th>Nominal</th><th>Keterangan</th><th>Input Oleh</th></tr>';

        foreach ($incomes as $inc) {
            $html .= '<tr>
                <td>' . ($inc->student?->name ?? '-') . '</td>
                <td>' . ($inc->student?->kelas ?? '-') . '</td>
                <td>' . $inc->transaction_date->format('d/m/Y') . '</td>
                <td>Rp ' . number_format($inc->amount, 0, ',', '.') . '</td>
                <td>' . ($inc->description ?? '-') . '</td>
                <td>' . ($inc->inputter?->name ?? '-') . '</td>
            </tr>';
        }

        $html .= '</table>
            <p class="total">Total Pendapatan: Rp ' . number_format($total, 0, ',', '.') . '</p>
            <p class="footer">Dicetak dari Sistem IPSA</p>
        </body></html>';

        $pdf = new \Dompdf\Dompdf();
        $pdf->loadHtml($html);
        $pdf->setPaper('A4', 'landscape');
        $pdf->render();

        return response($pdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="laporan-pendapatan-' . now()->format('Ymd') . '.pdf"',
        ]);
    }
}
