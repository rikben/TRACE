<?php
// /forest-dashboard/app/Core/Database.php

namespace App\Core;

use PDO;
use PDOException;

class Database
{
    private static ?PDO $connection = null;

    public static function connect(): PDO
    {
        if (self::$connection !== null) {
            return self::$connection;
        }

        $driver = Env::get('DB_DRIVER');
        $host = Env::get('DB_HOST');
        $port = Env::get('DB_PORT');
        $dbname = Env::get('DB_NAME');
        $charset = Env::get('DB_CHARSET');
        $user = Env::get('DB_USER');
        $pass = Env::get('DB_PASS');

        $dsn = "{$driver}:host={$host};port={$port};dbname={$dbname};charset={$charset}";

        try {

            self::$connection = new PDO(
                $dsn,
                $user,
                $pass,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]
            );

            return self::$connection;

        } catch (PDOException $e) {

            throw new PDOException(
                "Database connection failed: " . $e->getMessage()
            );
        }
    }
}