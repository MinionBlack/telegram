<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'config.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Проверка входных данных
    if (!$data || !isset($data['username']) || !isset($data['email']) || !isset($data['password'])) {
        throw new Exception('Missing required fields');
    }

    // Валидация email
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }

    // Проверка длины пароля
    if (strlen($data['password']) < 6) {
        throw new Exception('Password must be at least 6 characters long');
    }

    // Проверка существования email
    $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$data['email']]);

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'success' => false,
            'message' => 'This email is already registered'
        ]);
        exit;
    }

    // Хеширование пароля
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

    // Добавление пользователя
    $stmt = $db->prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    $success = $stmt->execute([
        htmlspecialchars($data['username']),
        $data['email'],
        $hashedPassword
    ]);

    echo json_encode([
        'success' => $success,
        'message' => $success ? 'Registration successful' : 'Registration failed'
    ]);

} catch (Exception $e) {
    error_log($e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()  // Временно показываем реальную ошибку для отладки
    ]);
} 