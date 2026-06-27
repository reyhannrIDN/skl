<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->append(\App\Http\Middleware\SecurityHeaders::class);

        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
            'submission.lock' => \App\Http\Middleware\SubmissionLockMiddleware::class,
        ]);

        $middleware->statefulApi();

        $middleware->appendToGroup('api', \App\Http\Middleware\TrackActivity::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
