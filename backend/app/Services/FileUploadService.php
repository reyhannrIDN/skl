<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    protected array $allowedTypes = [
        'poster' => ['jpg', 'jpeg', 'png', 'pdf'],
        'screenshot' => ['jpg', 'jpeg', 'png'],
        'apk' => ['apk'],
        'source_zip' => ['zip'],
        'source_aia' => ['aia'],
        'kodular_aia' => ['aia'],
        'video' => ['mp4', 'mov'],
    ];

    protected array $maxSizes = [
        'poster' => 5120,        // 5MB in KB
        'screenshot' => 2048,    // 2MB
        'apk' => 102400,        // 100MB
        'source_zip' => 204800,  // 200MB
        'source_aia' => 102400,  // 100MB
        'kodular_aia' => 102400, // 100MB
        'video' => 512000,       // 500MB
    ];

    public function upload(UploadedFile $file, string $fileType, int $submissionId): array
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $originalName = $file->getClientOriginalName();

        // Sanitize filename
        $safeName = Str::slug(pathinfo($originalName, PATHINFO_FILENAME)) . '_' . time() . '.' . $extension;
        $path = "submissions/{$submissionId}/{$fileType}";

        $storedPath = $file->storeAs($path, $safeName, 'public');

        return [
            'file_path' => $storedPath,
            'file_name' => $originalName,
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
        ];
    }

    public function delete(string $filePath): bool
    {
        return Storage::disk('public')->delete($filePath);
    }

    public function getAllowedExtensions(string $fileType): array
    {
        return $this->allowedTypes[$fileType] ?? [];
    }

    public function getMaxSize(string $fileType): int
    {
        return $this->maxSizes[$fileType] ?? 5120;
    }

    public function validateFile(UploadedFile $file, string $fileType): array
    {
        $errors = [];
        $extension = strtolower($file->getClientOriginalExtension());
        $allowed = $this->getAllowedExtensions($fileType);
        $maxSize = $this->getMaxSize($fileType);

        if (!in_array($extension, $allowed)) {
            $errors[] = "Format file tidak valid. Diizinkan: " . implode(', ', $allowed);
        }

        if ($file->getSize() > $maxSize * 1024) {
            $errors[] = "Ukuran file melebihi batas " . ($maxSize / 1024) . "MB";
        }

        return $errors;
    }
}
