<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Apply Security Headers
        if (method_exists($response, 'header')) {
            // CORS — force correct origin for credentials
            $origin = $request->header('Origin');
            if (in_array($origin, ['http://localhost:5173', 'http://127.0.0.1:5173'])) {
                $response->header('Access-Control-Allow-Origin', $origin);
                $response->header('Access-Control-Allow-Credentials', 'true');
                $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
                $response->header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization, X-CSRF-Token, X-XSRF-TOKEN, Accept, Origin');
                $response->header('Access-Control-Max-Age', '86400');
            }
            
            // $response->header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
            $response->header('X-Content-Type-Options', 'nosniff');
            $response->header('X-Frame-Options', 'SAMEORIGIN');
            $response->header('X-XSS-Protection', '1; mode=block');
            $response->header('Referrer-Policy', 'no-referrer-when-downgrade');
            $response->header('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
            $response->header('Cross-Origin-Opener-Policy', 'unsafe-none');
            $response->header('Cross-Origin-Embedder-Policy', 'unsafe-none');
            
            /* 
            $csp = "default-src 'self'; " .
                   "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://www.gstatic.com; " .
                   "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com; " .
                   "img-src 'self' data: https: https://*.googleusercontent.com; " .
                   "font-src 'self' https://fonts.gstatic.com data:; " .
                   "connect-src 'self' {$frontendUrl} ws://127.0.0.1:5173 https://accounts.google.com https://oauth2.googleapis.com; " .
                   "frame-src 'self' https://accounts.google.com https://content-helpline.google.com; " .
                   "frame-ancestors 'none'; " .
                   "base-uri 'self'; " .
                   "form-action 'self';";
            $response->header('Content-Security-Policy', $csp);
            */
            
            // Disable caching for sensitive responses
            $response->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
            $response->header('Pragma', 'no-cache');
            $response->header('Expires', '0');
        }

        return $response;
    }
}
