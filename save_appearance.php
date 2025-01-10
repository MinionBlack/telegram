<?php
session_start();
require_once 'config.php';

try {
    if (!isset($_SESSION['user_id'])) {
        throw new Exception('Not authenticated');
    }

    $data = json_decode(file_get_contents('php://input'), true);
    
    $allowedSettings = [
        'theme' => ['light', 'dark'],
        'messageSize' => ['small', 'medium', 'large'],
        'backgroundColor' => null, // Разрешаем любой цвет
        'backgroundImage' => null // Разрешаем любое изображение из предопределенного списка
    ];

    // Валидация настроек
    foreach ($data as $key => $value) {
        if (!array_key_exists($key, $allowedSettings)) {
            continue;
        }
        if (is_array($allowedSettings[$key]) && !in_array($value, $allowedSettings[$key])) {
            throw new Exception('Invalid setting value');
        }
    }

    $stmt = $db->prepare('UPDATE users SET appearance_settings = ? WHERE id = ?');
    $success = $stmt->execute([json_encode($data), $_SESSION['user_id']]);

    echo json_encode([
        'success' => $success,
        'message' => $success ? 'Settings updated' : 'Failed to update settings'
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} 