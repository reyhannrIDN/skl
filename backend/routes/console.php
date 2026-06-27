<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Scheduled backup - reads config from backup schedule.json
Schedule::call(function () {
    $configFile = storage_path('app/backups/schedule.json');
    if (!file_exists($configFile)) return;

    $config = json_decode(file_get_contents($configFile), true);
    if (!$config || !($config['enabled'] ?? false)) return;

    $today = now()->format('l');
    if (!in_array($today, $config['days'] ?? [])) return;

    $targetTime = $config['time'] ?? '02:00';
    if (now()->format('H:i') !== $targetTime) return;

    Artisan::call('backup:run');
})->everyMinute();
