<?php
/**
 * Session Check Endpoint
 * Validates if user session is still active and not expired
 */

session_start();

// Include database connection (may not be needed but for consistency)
require_once '../db.php';

// Include session configuration
if (!function_exists('isSessionExpired')) {
    require_once 'sessionConfig.php';
}

header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => false,
        'authenticated' => false,
        'message' => 'User not authenticated'
    ]);
    exit;
}

// Check if session has expired
if (isSessionExpired()) {
    $_SESSION = [];
    session_destroy();
    
    echo json_encode([
        'success' => false,
        'authenticated' => false,
        'sessionExpired' => true,
        'message' => 'Session expired. Please login again.'
    ]);
    exit;
}

// Update session activity
updateSessionLastActivity();

// Get remaining session time
$lastActivity = isset($_SESSION['last_activity']) ? $_SESSION['last_activity'] : time();
$timeElapsed = time() - $lastActivity;
$timeRemaining = SESSION_TIMEOUT - $timeElapsed;

// Ensure timeRemaining is not negative
if ($timeRemaining < 0) {
    $timeRemaining = 0;
}

// Session is valid
echo json_encode([
    'success' => true,
    'authenticated' => true,
    'user' => [
        'id' => $_SESSION['user_id'],
        'fullname' => $_SESSION['user_name'] ?? '',
        'role' => $_SESSION['role'] ?? 'CUSTOMER'
    ],
    'sessionInfo' => [
        'timeRemaining' => $timeRemaining,
        'sessionTimeout' => SESSION_TIMEOUT,
        'lastActivity' => $lastActivity
    ]
]);

?>
