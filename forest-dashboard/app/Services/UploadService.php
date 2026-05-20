<?php
// /forest-dashboard/app/Services/UploadService.php

namespace App\Services;

use App\Core\Env;
use Exception;

class UploadService
{
    public function storeImage(array $file): string
    {
        if (!isset($file['error']) || is_array($file['error'])) {
            throw new Exception('Invalid upload.');
        }

        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('Photo upload failed.');
        }

        $maxUploadMb = (int) Env::get('MAX_UPLOAD_MB', 5);
        $maxBytes = $maxUploadMb * 1024 * 1024;

        if ($file['size'] > $maxBytes) {
            throw new Exception("Photo is too large. Maximum size is {$maxUploadMb} MB.");
        }

        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($file['tmp_name']);

        $allowedTypes = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
        ];

        if (!array_key_exists($mimeType, $allowedTypes)) {
            throw new Exception('Only JPG, PNG, and WebP images are allowed.');
        }

        $uploadDir = Env::get('UPLOAD_DIR', 'uploads/observations');
        $absoluteDir = dirname(__DIR__, 2) . '/' . trim($uploadDir, '/');

        if (!is_dir($absoluteDir)) {
            mkdir($absoluteDir, 0755, true);
        }

        $filename = bin2hex(random_bytes(16)) . '.' . $allowedTypes[$mimeType];
        $absolutePath = $absoluteDir . '/' . $filename;

        if (!move_uploaded_file($file['tmp_name'], $absolutePath)) {
            throw new Exception('Could not save uploaded photo.');
        }

        return trim($uploadDir, '/') . '/' . $filename;
    }
}