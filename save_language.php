<?php
session_start();
require_once 'config.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($_SESSION['user_id']) || !isset($data['language'])) {
        throw new Exception('Invalid request');
    }

    $allowedLanguages = ['en', 'ru', 'pl', 'zh'];
    if (!in_array($data['language'], $allowedLanguages)) {
        throw new Exception('Invalid language');
    }

    $stmt = $db->prepare('UPDATE users SET language = ? WHERE id = ?');
    $success = $stmt->execute([$data['language'], $_SESSION['user_id']]);

    echo json_encode([
        'success' => $success,
        'message' => $success ? 'Language updated' : 'Failed to update language'
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} 