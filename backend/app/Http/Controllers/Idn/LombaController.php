<?php

namespace App\Http\Controllers\Idn;

use App\Http\Controllers\Controller;
use App\Models\Lomba;
use App\Models\LombaTim;
use App\Models\LombaPeserta;
use App\Models\LombaPendamping;
use App\Models\LombaFoto;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class LombaController extends Controller
{
    private function userCanAccess($user)
    {
        return $user->isSuperadmin() || $user->isKepalaSekolah() || $user->hasPermissionTo('lomba', 'view');
    }

    private function userCanEdit($user)
    {
        return $user->isSuperadmin() || $user->hasPermissionTo('lomba', 'create');
    }

    private function userCanDelete($user)
    {
        return $user->isSuperadmin() || $user->hasPermissionTo('lomba', 'delete');
    }

    public function dashboard(Request $request)
    {
        $user = $request->user();
        if (!$this->userCanAccess($user)) return response()->json(['message' => 'Unauthorized'], 403);

        $query = Lomba::query();
        if ($request->year) $query->whereYear('tanggal_mulai', $request->year);

        $totalLomba = (clone $query)->count();
        $totalPeserta = LombaPeserta::whereIn('lomba_tim_id', function ($q) use ($query) {
            $q->select('id')->from('lomba_tim')->whereIn('lomba_id', (clone $query)->pluck('id'));
        })->count();

        $totalTim = LombaTim::whereIn('lomba_id', (clone $query)->pluck('id'))->count();
        $totalPendamping = LombaPendamping::whereIn('lomba_id', (clone $query)->pluck('id'))->count();
        $totalJuara = (clone $query)->where('status_hasil', 'juara')->count();
        $persentaseJuara = $totalLomba > 0 ? round(($totalJuara / $totalLomba) * 100, 1) : 0;

        $perBulan = (clone $query)
            ->selectRaw('MONTH(tanggal_mulai) as bulan, COUNT(*) as total')
            ->whereNotNull('tanggal_mulai')
            ->groupBy('bulan')
            ->orderBy('bulan')
            ->pluck('total', 'bulan');

        $juaraPerBulan = (clone $query)
            ->where('status_hasil', 'juara')
            ->selectRaw('MONTH(tanggal_mulai) as bulan, COUNT(*) as total')
            ->whereNotNull('tanggal_mulai')
            ->groupBy('bulan')
            ->orderBy('bulan')
            ->pluck('total', 'bulan');

        $perTingkat = (clone $query)
            ->selectRaw('tingkat, COUNT(*) as total')
            ->groupBy('tingkat')
            ->orderBy('total', 'desc')
            ->pluck('total', 'tingkat');

        $perKategori = (clone $query)
            ->selectRaw('kategori, COUNT(*) as total')
            ->groupBy('kategori')
            ->orderBy('total', 'desc')
            ->take(10)
            ->pluck('total', 'kategori');

        $bulanData = collect(range(1, 12))->map(fn($b) => [
            'bulan' => $b,
            'total' => (int) ($perBulan[$b] ?? 0),
            'juara' => (int) ($juaraPerBulan[$b] ?? 0),
        ]);

        return response()->json([
            'stats' => compact('totalLomba', 'totalPeserta', 'totalTim', 'totalPendamping', 'totalJuara', 'persentaseJuara'),
            'perBulan' => $bulanData,
            'perTingkat' => $perTingkat,
            'perKategori' => $perKategori,
        ]);
    }

    public function index(Request $request)
    {
        $user = $request->user();
        if (!$this->userCanAccess($user)) return response()->json(['message' => 'Unauthorized'], 403);

        $query = Lomba::with(['tim', 'pendamping', 'foto', 'creator:id,name']);

        if ($request->search) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('nama_lomba', 'like', "%{$s}%")
                  ->orWhere('lokasi', 'like', "%{$s}%")
                  ->orWhere('penyelenggara', 'like', "%{$s}%");
            });
        }
        if ($request->tahun) $query->whereYear('tanggal_mulai', $request->tahun);
        if ($request->bulan) $query->whereMonth('tanggal_mulai', $request->bulan);
        if ($request->tingkat) $query->where('tingkat', $request->tingkat);
        if ($request->status === 'juara') $query->where('status_hasil', 'juara');
        if ($request->status === 'belum_juara') $query->whereIn('status_hasil', ['belum_ada_hasil', 'tidak_juara']);

        $lomba = $query->orderBy('created_at', 'desc')->paginate($request->per_page ?? 20);

        $lomba->getCollection()->transform(function ($l) {
            return [
                'id' => $l->id,
                'nama_lomba' => $l->nama_lomba,
                'tingkat' => $l->tingkat,
                'kategori' => $l->kategori,
                'penyelenggara' => $l->penyelenggara,
                'lokasi' => $l->lokasi,
                'tanggal_mulai' => $l->tanggal_mulai?->format('Y-m-d'),
                'tanggal_selesai' => $l->tanggal_selesai?->format('Y-m-d'),
                'status_hasil' => $l->status_hasil,
                'juara_ke' => $l->juara_ke,
                'juara_ke_lainnya' => $l->juara_ke_lainnya,
                'total_tim' => $l->tim->count(),
                'total_peserta' => $l->tim->sum(fn($t) => $t->peserta->count()),
                'total_foto' => $l->foto->count(),
                'pendamping' => $l->pendamping->pluck('nama')->implode(', '),
                'created_by' => $l->creator?->name,
            ];
        });

        return response()->json($lomba);
    }

    public function show($id)
    {
        $lomba = Lomba::with([
            'tim.peserta.siswa:id,name,nis,kelas',
            'pendamping.guru:id,name',
            'foto',
            'creator:id,name',
        ])->findOrFail($id);

        return response()->json([
            'lomba' => [
                'id' => $lomba->id,
                'nama_lomba' => $lomba->nama_lomba,
                'tingkat' => $lomba->tingkat,
                'kategori' => $lomba->kategori,
                'penyelenggara' => $lomba->penyelenggara,
                'lokasi' => $lomba->lokasi,
                'alamat' => $lomba->alamat,
                'tanggal_mulai' => $lomba->tanggal_mulai?->format('Y-m-d'),
                'tanggal_selesai' => $lomba->tanggal_selesai?->format('Y-m-d'),
                'deskripsi' => $lomba->deskripsi,
                'status_hasil' => $lomba->status_hasil,
                'juara_ke' => $lomba->juara_ke,
                'juara_ke_lainnya' => $lomba->juara_ke_lainnya,
                'total_tim' => $lomba->total_tim,
                'total_peserta' => $lomba->total_peserta,
                'created_by' => $lomba->creator?->name,
                'tim' => $lomba->tim->map(fn($t) => [
                    'id' => $t->id,
                    'nama_tim' => $t->nama_tim,
                    'jenis_tim' => $t->jenis_tim,
                    'jumlah_anggota' => $t->jumlah_anggota,
                    'peserta' => $t->peserta->map(fn($p) => [
                        'id' => $p->id,
                        'user_id' => $p->user_id,
                        'nama' => $p->nama,
                        'nis' => $p->nis,
                        'kelas' => $p->kelas,
                    ]),
                ]),
                'pendamping' => $lomba->pendamping->map(fn($p) => [
                    'id' => $p->id,
                    'user_id' => $p->user_id,
                    'nama' => $p->nama,
                    'jabatan' => $p->jabatan,
                ]),
                'foto' => $lomba->foto->map(fn($f) => [
                    'id' => $f->id,
                    'url' => Storage::disk('public')->url($f->file_path),
                    'original_name' => $f->original_name,
                ]),
            ],
        ]);
    }

    private function parseJsonField($request, $key)
    {
        if ($request->has($key) && is_string($request->input($key))) {
            return json_decode($request->input($key), true) ?? [];
        }
        return $request->input($key, []);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if (!$this->userCanEdit($user)) return response()->json(['message' => 'Unauthorized'], 403);

        $timData = $this->parseJsonField($request, 'tim');
        $pendampingData = $this->parseJsonField($request, 'pendamping');

        $validated = $request->validate(array_merge([
            'nama_lomba' => 'required|string|max:255',
            'tingkat' => 'required|in:sekolah,kecamatan,kabupaten,provinsi,nasional,internasional',
            'kategori' => 'required|string|max:255',
            'penyelenggara' => 'nullable|string|max:255',
            'lokasi' => 'required|string|max:255',
            'alamat' => 'nullable|string',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date',
            'deskripsi' => 'nullable|string',
            'status_hasil' => 'required|in:belum_ada_hasil,juara,tidak_juara',
            'juara_ke' => 'required_if:status_hasil,juara|nullable|string',
            'juara_ke_lainnya' => 'nullable|string|max:255',
            'foto' => 'nullable|array',
            'foto.*' => 'image|max:20480',
        ]));

        if (empty($timData)) return response()->json(['message' => 'Data tim harus diisi'], 422);

        if ($validated['status_hasil'] === 'juara' && empty($validated['juara_ke'])) {
            return response()->json(['message' => 'Juara ke wajib diisi'], 422);
        }

        $lomba = DB::transaction(function () use ($validated, $timData, $pendampingData, $user) {
            $totalTim = count($timData);
            $totalPeserta = collect($timData)->sum(fn($t) => count($t['peserta'] ?? []));

            $lomba = Lomba::create([
                'nama_lomba' => $validated['nama_lomba'],
                'tingkat' => $validated['tingkat'],
                'kategori' => $validated['kategori'],
                'penyelenggara' => $validated['penyelenggara'] ?? null,
                'lokasi' => $validated['lokasi'],
                'alamat' => $validated['alamat'] ?? null,
                'tanggal_mulai' => $validated['tanggal_mulai'] ?? null,
                'tanggal_selesai' => $validated['tanggal_selesai'] ?? null,
                'deskripsi' => $validated['deskripsi'] ?? null,
                'status_hasil' => $validated['status_hasil'],
                'juara_ke' => $validated['status_hasil'] === 'juara' ? $validated['juara_ke'] : null,
                'juara_ke_lainnya' => ($validated['juara_ke'] ?? '') === 'lainnya' ? ($validated['juara_ke_lainnya'] ?? null) : null,
                'total_tim' => $totalTim,
                'total_peserta' => $totalPeserta,
                'created_by' => $user->id,
            ]);

            foreach ($timData as $t) {
                $tim = LombaTim::create([
                    'lomba_id' => $lomba->id,
                    'nama_tim' => $t['nama_tim'],
                    'jenis_tim' => $t['jenis_tim'],
                    'jumlah_anggota' => $t['jumlah_anggota'],
                ]);

                foreach ($t['peserta'] ?? [] as $pesertaData) {
                    $siswa = User::find($pesertaData['user_id']);
                    LombaPeserta::create([
                        'lomba_tim_id' => $tim->id,
                        'user_id' => $pesertaData['user_id'],
                        'nama' => $siswa->name,
                        'nis' => $siswa->nis,
                        'kelas' => $siswa->kelas,
                    ]);
                }
            }

            if (!empty($pendampingData)) {
                foreach ($pendampingData as $p) {
                    $guru = User::find($p['user_id']);
                    LombaPendamping::create([
                        'lomba_id' => $lomba->id,
                        'user_id' => $p['user_id'],
                        'nama' => $guru->name,
                        'jabatan' => $guru->specialty ?? 'Guru',
                    ]);
                }
            }

            return $lomba;
        });

        if ($request->hasFile('foto')) {
            $urutan = 0;
            foreach ($request->file('foto') as $file) {
                if ($file->isValid()) {
                    $path = $this->uploadPhoto($file);
                    LombaFoto::create([
                        'lomba_id' => $lomba->id,
                        'file_path' => $path,
                        'original_name' => $file->getClientOriginalName(),
                        'file_size' => $file->getSize(),
                        'urutan' => $urutan++,
                    ]);
                }
            }
        }

        return response()->json(['message' => 'Lomba berhasil ditambahkan', 'id' => $lomba->id], 201);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        if (!$this->userCanEdit($user)) return response()->json(['message' => 'Unauthorized'], 403);

        $lomba = Lomba::findOrFail($id);

        $timData = $this->parseJsonField($request, 'tim');
        $pendampingData = $this->parseJsonField($request, 'pendamping');

        $validated = $request->validate([
            'nama_lomba' => 'required|string|max:255',
            'tingkat' => 'required|in:sekolah,kecamatan,kabupaten,provinsi,nasional,internasional',
            'kategori' => 'required|string|max:255',
            'penyelenggara' => 'nullable|string|max:255',
            'lokasi' => 'required|string|max:255',
            'alamat' => 'nullable|string',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date',
            'deskripsi' => 'nullable|string',
            'status_hasil' => 'required|in:belum_ada_hasil,juara,tidak_juara',
            'juara_ke' => 'required_if:status_hasil,juara|nullable|string',
            'juara_ke_lainnya' => 'nullable|string|max:255',
            'foto' => 'nullable|array',
            'foto.*' => 'image|max:20480',
        ]);

        if (empty($timData)) return response()->json(['message' => 'Data tim harus diisi'], 422);

        DB::transaction(function () use ($validated, $timData, $pendampingData, $lomba) {
            $totalTim = count($timData);
            $totalPeserta = collect($timData)->sum(fn($t) => count($t['peserta'] ?? []));

            $lomba->update([
                'nama_lomba' => $validated['nama_lomba'],
                'tingkat' => $validated['tingkat'],
                'kategori' => $validated['kategori'],
                'penyelenggara' => $validated['penyelenggara'] ?? null,
                'lokasi' => $validated['lokasi'],
                'alamat' => $validated['alamat'] ?? null,
                'tanggal_mulai' => $validated['tanggal_mulai'] ?? null,
                'tanggal_selesai' => $validated['tanggal_selesai'] ?? null,
                'deskripsi' => $validated['deskripsi'] ?? null,
                'status_hasil' => $validated['status_hasil'],
                'juara_ke' => $validated['status_hasil'] === 'juara' ? $validated['juara_ke'] : null,
                'juara_ke_lainnya' => ($validated['juara_ke'] ?? '') === 'lainnya' ? ($validated['juara_ke_lainnya'] ?? null) : null,
                'total_tim' => $totalTim,
                'total_peserta' => $totalPeserta,
            ]);

            $lomba->tim()->delete();
            foreach ($timData as $t) {
                $tim = LombaTim::create([
                    'lomba_id' => $lomba->id,
                    'nama_tim' => $t['nama_tim'],
                    'jenis_tim' => $t['jenis_tim'],
                    'jumlah_anggota' => $t['jumlah_anggota'],
                ]);
                foreach ($t['peserta'] ?? [] as $pesertaData) {
                    $siswa = User::find($pesertaData['user_id']);
                    LombaPeserta::create([
                        'lomba_tim_id' => $tim->id,
                        'user_id' => $pesertaData['user_id'],
                        'nama' => $siswa->name,
                        'nis' => $siswa->nis,
                        'kelas' => $siswa->kelas,
                    ]);
                }
            }

            $lomba->pendamping()->delete();
            if (!empty($pendampingData)) {
                foreach ($pendampingData as $p) {
                    $guru = User::find($p['user_id']);
                    LombaPendamping::create([
                        'lomba_id' => $lomba->id,
                        'user_id' => $p['user_id'],
                        'nama' => $guru->name,
                        'jabatan' => $guru->specialty ?? 'Guru',
                    ]);
                }
            }
        });

        if ($request->hasFile('foto')) {
            $urutan = $lomba->foto()->max('urutan') + 1;
            foreach ($request->file('foto') as $file) {
                if ($file->isValid()) {
                    $path = $this->uploadPhoto($file);
                    LombaFoto::create([
                        'lomba_id' => $lomba->id,
                        'file_path' => $path,
                        'original_name' => $file->getClientOriginalName(),
                        'file_size' => $file->getSize(),
                        'urutan' => $urutan++,
                    ]);
                }
            }
        }

        return response()->json(['message' => 'Lomba berhasil diperbarui']);
    }

    public function destroy($id)
    {
        $user = request()->user();
        if (!$this->userCanDelete($user)) return response()->json(['message' => 'Unauthorized'], 403);

        $lomba = Lomba::findOrFail($id);
        DB::transaction(function () use ($lomba) {
            foreach ($lomba->foto as $f) {
                Storage::disk('public')->delete($f->file_path);
            }
            $lomba->delete();
        });

        return response()->json(['message' => 'Lomba berhasil dihapus']);
    }

    public function deleteFoto($id)
    {
        $foto = LombaFoto::findOrFail($id);
        Storage::disk('public')->delete($foto->file_path);
        $foto->delete();
        return response()->json(['message' => 'Foto berhasil dihapus']);
    }

    public function uploadFoto(Request $request, $id)
    {
        $lomba = Lomba::findOrFail($id);
        $request->validate(['foto' => 'required|array', 'foto.*' => 'image|max:20480']);

        $paths = [];
        $urutan = $lomba->foto()->max('urutan') + 1;
        foreach ($request->file('foto') as $file) {
            $path = $this->uploadPhoto($file);
            $f = LombaFoto::create([
                'lomba_id' => $lomba->id,
                'file_path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'file_size' => $file->getSize(),
                'urutan' => $urutan++,
            ]);
            $paths[] = ['id' => $f->id, 'url' => Storage::disk('public')->url($path)];
        }

        return response()->json(['message' => 'Foto berhasil diupload', 'foto' => $paths]);
    }

    private function uploadPhoto($file)
    {
        $ext = strtolower($file->getClientOriginalExtension());
        $supported = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'tif'];
        $image = null;

        if (in_array($ext, $supported)) {
            try {
                $image = match ($ext) {
                    'jpg', 'jpeg' => @imagecreatefromjpeg($file->getRealPath()),
                    'png' => @imagecreatefrompng($file->getRealPath()),
                    'gif' => @imagecreatefromgif($file->getRealPath()),
                    'webp' => @imagecreatefromwebp($file->getRealPath()),
                    'bmp' => @imagecreatefrombmp($file->getRealPath()),
                    'tiff', 'tif' => null,
                    default => null,
                };
            } catch (\Exception $e) {
                $image = null;
            }
        }

        if ($image) {
            $filename = 'lomba/' . uniqid() . '.webp';
            $tempPath = sys_get_temp_dir() . '/' . basename($filename);

            $maxDim = 1920;
            $origW = imagesx($image);
            $origH = imagesy($image);

            if ($origW > $maxDim || $origH > $maxDim) {
                $ratio = min($maxDim / $origW, $maxDim / $origH);
                    $newW = (int) round($origW * $ratio);
                    $newH = (int) round($origH * $ratio);
                    $resized = imagecreatetruecolor($newW, $newH);
                    imagecopyresampled($resized, $image, 0, 0, 0, 0, $newW, $newH, $origW, $origH);
                    imagedestroy($image);
                    $image = $resized;
            }

            $quality = 85;
            imagewebp($image, $tempPath, $quality);
            $fileSize = filesize($tempPath);
            if ($fileSize > 300 * 1024) {
                $quality = 80;
                imagewebp($image, $tempPath, $quality);
            }
            if ($fileSize > 500 * 1024) {
                $quality = 75;
                imagewebp($image, $tempPath, $quality);
            }

            Storage::disk('public')->put($filename, file_get_contents($tempPath));
            unlink($tempPath);
            imagedestroy($image);
            return $filename;
        }

        return $file->store('lomba', 'public');
    }

    public function exportExcel(Request $request)
    {
        $query = Lomba::with(['tim.peserta', 'pendamping']);
        if ($request->tahun) $query->whereYear('tanggal_mulai', $request->tahun);
        if ($request->tingkat) $query->where('tingkat', $request->tingkat);

        $lomba = $query->orderBy('created_at', 'desc')->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Data Lomba');

        $headers = ['Nama Lomba', 'Tingkat', 'Kategori', 'Penyelenggara', 'Lokasi',
            'Tanggal Mulai', 'Tanggal Selesai', 'Jumlah Tim', 'Jumlah Peserta',
            'Pendamping', 'Status Hasil', 'Juara'];
        $col = 'A';
        foreach ($headers as $h) {
            $sheet->setCellValue($col . '1', $h);
            $sheet->getColumnDimension($col)->setAutoSize(true);
            $col++;
        }

        $row = 2;
        foreach ($lomba as $l) {
            $sheet->setCellValue('A' . $row, $l->nama_lomba);
            $sheet->setCellValue('B' . $row, ucfirst($l->tingkat));
            $sheet->setCellValue('C' . $row, $l->kategori);
            $sheet->setCellValue('D' . $row, $l->penyelenggara ?? '-');
            $sheet->setCellValue('E' . $row, $l->lokasi);
            $sheet->setCellValue('F' . $row, $l->tanggal_mulai?->format('Y-m-d') ?? '-');
            $sheet->setCellValue('G' . $row, $l->tanggal_selesai?->format('Y-m-d') ?? '-');
            $sheet->setCellValue('H' . $row, $l->tim->count());
            $sheet->setCellValue('I' . $row, $l->tim->sum(fn($t) => $t->peserta->count()));
            $sheet->setCellValue('J' . $row, $l->pendamping->pluck('nama')->implode(', '));
            $sheet->setCellValue('K' . $row, str_replace('_', ' ', ucfirst($l->status_hasil)));
            $sheet->setCellValue('L' . $row, $l->status_hasil === 'juara' ? str_replace('_', ' ', ucfirst($l->juara_ke)) . ($l->juara_ke_lainnya ? ': ' . $l->juara_ke_lainnya : '') : '-');
            $row++;
        }

        $writer = new Xlsx($spreadsheet);
        $filename = 'data-lomba-' . now()->format('Ymd') . '.xlsx';
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
        $query = Lomba::with(['tim.peserta', 'pendamping']);
        if ($request->tahun) $query->whereYear('tanggal_mulai', $request->tahun);
        if ($request->tingkat) $query->where('tingkat', $request->tingkat);

        $lomba = $query->orderBy('created_at', 'desc')->get();

        $html = '<html><head><style>
            body { font-family: Arial, sans-serif; font-size: 11px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 5px; text-align: left; }
            th { background: #f4f4f4; font-weight: bold; }
            h2 { text-align: center; }
        </style></head><body>
            <h2>Data Lomba</h2>
            <p style="text-align:center;color:#666;">' . now()->format('d F Y') . '</p>
            <table>
                <tr><th>Nama</th><th>Tingkat</th><th>Lokasi</th><th>Tanggal</th><th>Tim</th><th>Peserta</th><th>Hasil</th></tr>';

        foreach ($lomba as $l) {
            $html .= '<tr>
                <td>' . e($l->nama_lomba) . '</td>
                <td>' . ucfirst($l->tingkat) . '</td>
                <td>' . e($l->lokasi) . '</td>
                <td>' . ($l->tanggal_mulai?->format('d/m/Y') ?? '-') . '</td>
                <td>' . $l->tim->count() . '</td>
                <td>' . $l->tim->sum(fn($t) => $t->peserta->count()) . '</td>
                <td>' . ($l->status_hasil === 'juara' ? 'Juara ' . str_replace('_', ' ', $l->juara_ke) : str_replace('_', ' ', ucfirst($l->status_hasil))) . '</td>
            </tr>';
        }

        $html .= '</table></body></html>';

        $pdf = new \Dompdf\Dompdf();
        $pdf->loadHtml($html);
        $pdf->setPaper('A4', 'landscape');
        $pdf->render();

        return response($pdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="data-lomba-' . now()->format('Ymd') . '.pdf"',
        ]);
    }

    public function referensi()
    {
        return response()->json([
            'siswa' => User::where('role', 'siswa')->where('is_active', true)
                ->orderBy('name')->get(['id', 'name', 'nis', 'kelas']),
            'guru' => User::where('role', 'guru')->where('is_active', true)
                ->orderBy('name')->get(['id', 'name', 'specialty']),
        ]);
    }
}
