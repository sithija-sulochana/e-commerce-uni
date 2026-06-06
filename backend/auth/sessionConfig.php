<?php
/**
 * Session Configuration
 * Sets up session timeout for auto-logout after 1 day
 */

// Session timeout: 24 hours (86400 seconds)
define('SESSION_TIMEOUT', 86400);

// Initialize session settings
function initializeSessionSettings() {
    // Set session cookie lifetime to 24 hours
    ini_set('session.gc_maxlifetime', SESSION_TIMEOUT);
    
    // Session cookie configuration
    session_set_cookie_params([
        'lifetime' => SESSION_TIMEOUT,
        'path' => '/',
        'secure' => false, // Set to true if using HTTPS
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
}

// Get session last activity
function getSessionLastActivity() {
    return $_SESSION['last_activity'] ?? time();
}

// Update session last activity
function updateSessionLastActivity() {
    $_SESSION['last_activity'] = time();
}

// Check if session has expired
function isSessionExpired() {
    if (!isset($_SESSION['user_id'])) {
        return true;
    }
    
    if (!isset($_SESSION['last_activity'])) {
        $_SESSION['last_activity'] = time();
        return false;
    }
    
    $elapsed = time() - $_SESSION['last_activity'];
    
    if ($elapsed > SESSION_TIMEOUT) {
        return true;
    }
    
    // Update last activity on every check
    $_SESSION['last_activity'] = time();
    return false;
}

// Destroy session
function destroySessionForTimeout() {
    $_SESSION = [];
    session_destroy();
}

?>
