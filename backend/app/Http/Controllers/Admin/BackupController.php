<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class BackupController extends Controller
{
    protected $backupDir = '';

    public function __construct()
    {
        $this->backupDir = storage_path('app/backups');
        if (!is_dir($this->backupDir)) {
            mkdir($this->backupDir, 0755, true);
        }
    }

    public function index()
    {
        $files = glob($this->backupDir . '/*.tar.gz');
        $backups = [];

        foreach ($files as $path) {
            $filename = basename($path);
            $backups[] = [
                'filename' => $filename,
                'size' => filesize($path),
                'size_formatted' => $this->formatBytes(filesize($path)),
                'created_at' => date('Y-m-d H:i:s', filemtime($path)),
            ];
        }

        usort($backups, fn($a, $b) => strcmp($b['created_at'], $a['created_at']));

        return response()->json(['backups' => $backups]);
    }

    public function store()
    {
        try {
            $result = $this->runBackup();
            NotificationService::logActivity('backup_created', "Manual backup created: {$result['filename']}");
            return response()->json(['message' => 'Backup berhasil dibuat', 'backup' => $result]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Backup gagal: ' . $e->getMessage()], 500);
        }
    }

    public function download($filename)
    {
        $path = $this->backupDir . '/' . $filename;
        if (!file_exists($path)) {
            return response()->json(['message' => 'File backup tidak ditemukan'], 404);
        }

        return response()->download($path, $filename);
    }

    public function destroy($filename)
    {
        $path = $this->backupDir . '/' . $filename;
        if (!file_exists($path)) {
            return response()->json(['message' => 'File backup tidak ditemukan'], 404);
        }

        unlink($path);
        NotificationService::logActivity('backup_deleted', "Backup deleted: {$filename}");

        return response()->json(['message' => 'Backup berhasil dihapus']);
    }

    public function restore(Request $request, $filename)
    {
        $path = $this->backupDir . '/' . $filename;
        if (!file_exists($path)) {
            return response()->json(['message' => 'File backup tidak ditemukan'], 404);
        }

        $request->validate([
            'restore_database' => 'boolean',
            'restore_files' => 'boolean',
        ]);

        $restoreDb = $request->boolean('restore_database', true);
        $restoreFiles = $request->boolean('restore_files', true);

        if (!$restoreDb && !$restoreFiles) {
            return response()->json(['message' => 'Pilih minimal satu opsi restore'], 422);
        }

        try {
            $result = $this->executeRestore($path, $restoreDb, $restoreFiles);

            NotificationService::logActivity('backup_restored', "Backup restored: {$filename} (" . implode(', ', $result['restored']) . ')');

            return response()->json([
                'message' => 'Restore berhasil: ' . implode(' dan ', $result['restored']) . ' berhasil dipulihkan',
                'restored' => $result['restored'],
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Restore gagal: ' . $e->getMessage()], 500);
        }
    }

    protected function executeRestore($archivePath, $restoreDb, $restoreFiles)
    {
        $timestamp = date('YmdHis');
        $extractDir = $this->backupDir . '/.restore_' . $timestamp;
        $databaseSql = null;
        $uploadsDir = null;

        try {
            if (!is_dir($extractDir)) {
                mkdir($extractDir, 0755, true);
            }

            $phar = new \PharData($archivePath);
            $phar->extractTo($extractDir);
            unset($phar);

            if (file_exists($extractDir . '/database.sql')) {
                $databaseSql = $extractDir . '/database.sql';
            }
            if (is_dir($extractDir . '/uploads')) {
                $uploadsDir = $extractDir . '/uploads';
            }

            $restored = [];

            if ($restoreDb) {
                if (!$databaseSql) {
                    throw new \RuntimeException('File database.sql tidak ditemukan dalam backup');
                }
                $this->importDatabase($databaseSql);
                $restored[] = 'database';
            }

            if ($restoreFiles) {
                if (!$uploadsDir) {
                    throw new \RuntimeException('Folder uploads tidak ditemukan dalam backup');
                }
                $targetDir = storage_path('app/public');
                $this->copyRecursive($uploadsDir, $targetDir);
                $restored[] = 'files';
            }

            $this->deleteRecursive($extractDir);

            return ['restored' => $restored];
        } catch (\Exception $e) {
            if (is_dir($extractDir)) {
                $this->deleteRecursive($extractDir);
            }
            throw $e;
        }
    }

    public function restoreFromUpload(Request $request)
    {
        $request->validate([
            'backup_file' => 'required|file|mimes:gz,tar',
            'restore_database' => 'boolean',
            'restore_files' => 'boolean',
        ]);

        $restoreDb = $request->boolean('restore_database', true);
        $restoreFiles = $request->boolean('restore_files', true);

        if (!$restoreDb && !$restoreFiles) {
            return response()->json(['message' => 'Pilih minimal satu opsi restore'], 422);
        }

        $file = $request->file('backup_file');
        $originalName = $file->getClientOriginalName();
        $tempPath = $this->backupDir . '/.upload_' . $originalName;

        try {
            $file->move($this->backupDir, '.upload_' . $originalName);

            $result = $this->executeRestore($tempPath, $restoreDb, $restoreFiles);

            NotificationService::logActivity('backup_restored', "Backup restored from upload: {$originalName} (" . implode(', ', $result['restored']) . ')');

            return response()->json([
                'message' => 'Restore berhasil: ' . implode(' dan ', $result['restored']) . ' berhasil dipulihkan',
                'restored' => $result['restored'],
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Restore gagal: ' . $e->getMessage()], 500);
        } finally {
            if (file_exists($tempPath)) {
                unlink($tempPath);
            }
        }
    }

    public function getSchedule()
    {
        $config = $this->readScheduleConfig();
        return response()->json(['schedule' => $config]);
    }

    public function updateSchedule(Request $request)
    {
        $data = $request->validate([
            'enabled' => 'boolean',
            'days' => 'array',
            'days.*' => 'string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'time' => 'string|date_format:H:i',
            'max_backups' => 'integer|min:1|max:100',
        ]);

        $this->writeScheduleConfig($data);
        NotificationService::logActivity('backup_schedule_updated', 'Backup schedule updated');

        return response()->json(['message' => 'Jadwal backup berhasil diperbarui', 'schedule' => $data]);
    }

    // ─── Backup Engine ─────────────────────────────────

    public function runBackup()
    {
        $timestamp = date('Y-m-d-Hi');
        $filename = "backup-{$timestamp}.tar.gz";
        $tempDir = $this->backupDir . '/.tmp_' . $timestamp;
        $tarFile = $this->backupDir . "/backup-{$timestamp}.tar";
        $gzFile = $this->backupDir . '/' . $filename;

        if (!is_dir($tempDir)) {
            mkdir($tempDir, 0755, true);
        }

        // 1. Database dump
        $dbDumpFile = $tempDir . '/database.sql';
        $this->dumpDatabase($dbDumpFile);

        // 2. Copy uploaded files
        $filesSource = storage_path('app/public');
        $filesTarget = $tempDir . '/uploads';
        if (is_dir($filesSource)) {
            $this->copyRecursive($filesSource, $filesTarget);
        }

        // 3. Clean any leftover files from previous failed runs
        foreach ([$tarFile, $gzFile] as $f) {
            if (file_exists($f)) unlink($f);
        }

        // 4. Create tar, then gzip it
        $phar = new \PharData($tarFile);
        $phar->buildFromDirectory($tempDir);
        unset($phar);

        $phar = new \PharData($tarFile);
        $phar->compress(\Phar::GZ);
        unset($phar);

        if (file_exists($tarFile)) {
            unlink($tarFile);
        }

        // 4. Clean up temp
        $this->deleteRecursive($tempDir);

        // 5. Enforce max backup limit
        $this->enforceMaxBackups();

        // 6. Return info
        return [
            'filename' => $filename,
            'size' => filesize($gzFile),
            'size_formatted' => $this->formatBytes(filesize($gzFile)),
            'created_at' => date('Y-m-d H:i:s'),
        ];
    }

    protected function dumpDatabase($outputPath)
    {
        $db = config('database.connections.mysql');
        $host = $db['host'];
        $port = $db['port'];
        $database = $db['database'];
        $username = $db['username'];
        $password = $db['password'];

        $command = sprintf(
            'mysqldump --host=%s --port=%s --user=%s --password=%s --single-transaction --routines --events %s > %s 2>&1',
            escapeshellarg($host),
            escapeshellarg($port),
            escapeshellarg($username),
            escapeshellarg($password),
            escapeshellarg($database),
            escapeshellarg($outputPath)
        );

        $output = [];
        $returnVar = 0;
        exec($command, $output, $returnVar);

        if ($returnVar !== 0 || !file_exists($outputPath) || filesize($outputPath) === 0) {
            // Fallback: try using PHP's PDO to create schema-only dump
            $this->fallbackDump($outputPath);
        }
    }

    protected function importDatabase($sqlFile)
    {
        $db = config('database.connections.mysql');
        $host = $db['host'];
        $port = $db['port'];
        $database = $db['database'];
        $username = $db['username'];
        $password = $db['password'];

        // Try mysql command first
        $command = sprintf(
            'mysql --host=%s --port=%s --user=%s --password=%s %s < %s 2>&1',
            escapeshellarg($host),
            escapeshellarg($port),
            escapeshellarg($username),
            escapeshellarg($password),
            escapeshellarg($database),
            escapeshellarg($sqlFile)
        );

        $output = [];
        $returnVar = 0;
        exec($command, $output, $returnVar);

        if ($returnVar === 0) return;

        // Fallback: import via PDO line by line
        try {
            $pdo = new \PDO(
                "mysql:host={$host};port={$port};dbname={$database}",
                $username,
                $password,
                [\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION]
            );

            $sql = file_get_contents($sqlFile);
            $statements = explode(";\n", $sql);

            foreach ($statements as $stmt) {
                $stmt = trim($stmt);
                if (!empty($stmt)) {
                    $pdo->exec($stmt);
                }
            }
        } catch (\Exception $e) {
            throw new \RuntimeException('Import database gagal: ' . $e->getMessage());
        }
    }

    protected function fallbackDump($outputPath)
    {
        $db = config('database.connections.mysql');
        try {
            $pdo = new \PDO(
                "mysql:host={$db['host']};port={$db['port']};dbname={$db['database']}",
                $db['username'],
                $db['password']
            );
            $pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

            $stmt = $pdo->query("SHOW TABLES");
            $tables = $stmt->fetchAll(\PDO::FETCH_COLUMN);

            $sql = "-- IPSA Database Backup\n";
            $sql .= "-- Generated: " . date('Y-m-d H:i:s') . "\n\n";

            foreach ($tables as $table) {
                $createStmt = $pdo->query("SHOW CREATE TABLE `{$table}`");
                $createRow = $createStmt->fetch(\PDO::FETCH_ASSOC);
                $sql .= "DROP TABLE IF EXISTS `{$table}`;\n";
                $sql .= $createRow['Create Table'] . ";\n\n";

                $rows = $pdo->query("SELECT * FROM `{$table}`");
                while ($row = $rows->fetch(\PDO::FETCH_ASSOC)) {
                    $cols = array_map(fn($c) => "`{$c}`", array_keys($row));
                    $vals = array_map(fn($v) => $v === null ? 'NULL' : $pdo->quote($v), array_values($row));
                    $sql .= "INSERT INTO `{$table}` (" . implode(', ', $cols) . ") VALUES (" . implode(', ', $vals) . ");\n";
                }
                $sql .= "\n";
            }

            file_put_contents($outputPath, $sql);
        } catch (\Exception $e) {
            throw new \RuntimeException('Database dump gagal: ' . $e->getMessage());
        }
    }

    protected function copyRecursive($src, $dst)
    {
        if (!is_dir($dst)) {
            mkdir($dst, 0755, true);
        }
        $items = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($src, \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::SELF_FIRST
        );
        foreach ($items as $item) {
            $target = $dst . '/' . $items->getSubPathname();
            if ($item->isDir()) {
                if (!is_dir($target)) mkdir($target, 0755, true);
            } else {
                copy($item->getPathname(), $target);
            }
        }
    }

    protected function deleteRecursive($dir)
    {
        if (!is_dir($dir)) return;
        $items = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($dir, \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::CHILD_FIRST
        );
        foreach ($items as $item) {
            $item->isDir() ? rmdir($item->getPathname()) : unlink($item->getPathname());
        }
        rmdir($dir);
    }

    protected function enforceMaxBackups()
    {
        $config = $this->readScheduleConfig();
        $maxBackups = $config['max_backups'] ?? 10;

        $files = glob($this->backupDir . '/*.tar.gz');

        if (count($files) > $maxBackups) {
            usort($files, fn($a, $b) => filemtime($a) - filemtime($b));
            $toDelete = array_slice($files, 0, count($files) - $maxBackups);
            foreach ($toDelete as $file) {
                unlink($file);
            }
        }
    }

    protected function readScheduleConfig()
    {
        $configFile = $this->backupDir . '/schedule.json';
        if (file_exists($configFile)) {
            return json_decode(file_get_contents($configFile), true) ?: $this->defaultSchedule();
        }
        return $this->defaultSchedule();
    }

    protected function writeScheduleConfig(array $data)
    {
        $configFile = $this->backupDir . '/schedule.json';
        file_put_contents($configFile, json_encode($data, JSON_PRETTY_PRINT));
    }

    protected function defaultSchedule()
    {
        return [
            'enabled' => false,
            'days' => ['Monday', 'Wednesday', 'Friday'],
            'time' => '02:00',
            'max_backups' => 10,
        ];
    }

    protected function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        return round($bytes / pow(1024, $pow), $precision) . ' ' . $units[$pow];
    }
}
