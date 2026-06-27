<?php

namespace App\Console\Commands;

use App\Http\Controllers\Admin\BackupController;
use Illuminate\Console\Command;

class BackupCommand extends Command
{
    protected $signature = 'backup:run';
    protected $description = 'Run database and file backup';

    public function handle()
    {
        $this->info('Starting backup...');

        try {
            $controller = new BackupController();
            $result = $controller->runBackup();
            $this->info("Backup created: {$result['filename']} ({$result['size_formatted']})");
        } catch (\Exception $e) {
            $this->error('Backup failed: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
