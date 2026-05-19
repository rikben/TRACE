<?php
// /forest-dashboard/app/Core/Env.php

namespace App\Core;

class Env
{
    private static array $variables = [];

    public static function load(string $path): void
    {
        if (!file_exists($path)) {
            throw new \Exception(".env file not found: {$path}");
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        foreach ($lines as $line) {

            $line = trim($line);

            if ($line === '' || str_starts_with($line, '#')) {
                continue;
            }

            [$key, $value] = explode('=', $line, 2);

            self::$variables[trim($key)] = trim($value);
        }
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        return self::$variables[$key] ?? $default;
    }
}