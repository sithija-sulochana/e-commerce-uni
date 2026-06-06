<?php
session_start();

// Include session configuration
if (!function_exists('destroySessionForTimeout')) {
    require_once 'sessionConfig.php';
}

// Clear all session data
$_SESSION = [];

// Destroy session
session_destroy();

header('Content-Type: application/json');

echo json_encode([
    'success' => true,
    'message' => 'Logout successful!'
]);
?>