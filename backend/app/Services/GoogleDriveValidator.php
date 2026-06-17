<?php

namespace App\Services;

class GoogleDriveValidator
{
    public static function isValid(string $url): bool
    {
        $patterns = [
            '/^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+/',
            '/^https:\/\/drive\.google\.com\/open\?id=[a-zA-Z0-9_-]+/',
            '/^https:\/\/docs\.google\.com\/[a-z]+\/d\/[a-zA-Z0-9_-]+/',
            '/^https:\/\/drive\.google\.com\/drive\/folders\/[a-zA-Z0-9_-]+/',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $url)) {
                return true;
            }
        }

        return false;
    }
}
