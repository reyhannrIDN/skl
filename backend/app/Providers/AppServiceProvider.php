<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // API Umum (100 req / menit berdasarkan IP)
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(100)->by($request->ip());
        });

        // Admin Routes (Lebih ketat, 30 req / menit)
        RateLimiter::for('admin', function (Request $request) {
            return Limit::perMinute(30)->by($request->user()?->id ?: $request->ip());
        });

        // Bruteforce Protection Login & Register
        RateLimiter::for('auth_limit', function (Request $request) {
            if (config('app.env') === 'local') {
                return Limit::none(); // No limit for local testing
            }
            return Limit::perMinutes(15, 5)->by($request->ip() . $request->input('email'));
        });
    }
}
