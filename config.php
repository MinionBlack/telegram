<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'telegram_clone');
define('DB_USER', 'root');
define('DB_PASS', ''); // Оставьте пустым, если пароль не установлен

try {
    $db = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
        ]
    );
} catch (PDOException $e) {
    error_log("Connection failed: " . $e->getMessage());
    die(json_encode([
        'success' => false,
        'message' => 'Database connection failed'
    ]));
} 