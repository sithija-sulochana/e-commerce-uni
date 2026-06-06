<?php
/**
 * Session Timeout Testing & Debugging Script
 * This file helps verify the session timeout implementation is working correctly
 * 
 * Usage: Access this file in your browser (e.g., http://localhost/E-commerce/backend/auth/test_session.php)
 */

session_start();
include '../db.php';
include 'sessionConfig.php';

// Check if database is connected
$db_status = isset($con) && $con ? "✓ Connected" : "✗ Failed";

// Get session info
$session_data = [
    'user_id' => $_SESSION['user_id'] ?? 'Not set',
    'user_name' => $_SESSION['user_name'] ?? 'Not set',
    'role' => $_SESSION['role'] ?? 'Not set',
    'last_activity' => isset($_SESSION['last_activity']) ? date('Y-m-d H:i:s', $_SESSION['last_activity']) : 'Not set',
    'login_time' => isset($_SESSION['login_time']) ? date('Y-m-d H:i:s', $_SESSION['login_time']) : 'Not set',
];

// Calculate remaining time
$remaining_time = 'N/A';
if (isset($_SESSION['last_activity'])) {
    $elapsed = time() - $_SESSION['last_activity'];
    $remaining_seconds = SESSION_TIMEOUT - $elapsed;
    if ($remaining_seconds > 0) {
        $hours = floor($remaining_seconds / 3600);
        $minutes = floor(($remaining_seconds % 3600) / 60);
        $seconds = $remaining_seconds % 60;
        $remaining_time = sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);
    } else {
        $remaining_time = 'Expired';
    }
}

// Check if session is expired
$is_expired = isSessionExpired();

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Session Timeout Test</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            border-bottom: 3px solid #0066cc;
            padding-bottom: 10px;
        }
        .section {
            margin: 20px 0;
            padding: 15px;
            background: #f9f9f9;
            border-left: 4px solid #0066cc;
            border-radius: 4px;
        }
        .section h2 {
            margin-top: 0;
            color: #0066cc;
            font-size: 16px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: 600;
            color: #555;
        }
        .value {
            color: #333;
            font-family: 'Courier New', monospace;
        }
        .status-success {
            color: #27ae60;
            font-weight: 600;
        }
        .status-error {
            color: #e74c3c;
            font-weight: 600;
        }
        .status-warning {
            color: #f39c12;
            font-weight: 600;
        }
        .buttons {
            margin-top: 20px;
            display: flex;
            gap: 10px;
        }
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
        }
        .btn-primary {
            background: #0066cc;
            color: white;
        }
        .btn-danger {
            background: #e74c3c;
            color: white;
        }
        .btn-success {
            background: #27ae60;
            color: white;
        }
        .btn:hover {
            opacity: 0.9;
        }
        .alert {
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 15px;
        }
        .alert-info {
            background: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
        .alert-warning {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
        }
        .constants {
            background: #f0f0f0;
            padding: 10px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: #f0f0f0;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>⏱️ Session Timeout Test & Debug</h1>

        <div class="alert alert-info">
            <strong>Info:</strong> This page shows the current session status and configuration.
            Refresh the page to update the values.
        </div>

        <div class="section">
            <h2>🔧 System Configuration</h2>
            <div class="info-row">
                <span class="label">Database Status:</span>
                <span class="value <?php echo $db_status === '✓ Connected' ? 'status-success' : 'status-error'; ?>">
                    <?php echo $db_status; ?>
                </span>
            </div>
            <div class="info-row">
                <span class="label">Session Timeout:</span>
                <span class="value">86400 seconds (24 hours)</span>
            </div>
            <div class="info-row">
                <span class="label">Warning Time:</span>
                <span class="value">300 seconds (5 minutes)</span>
            </div>
            <div class="info-row">
                <span class="label">Check Interval:</span>
                <span class="value">60000 milliseconds (1 minute)</span>
            </div>
            <div class="constants" style="margin-top: 10px;">
                <div>SESSION_TIMEOUT = <?php echo SESSION_TIMEOUT; ?></div>
                <div>PHP Version = <?php echo phpversion(); ?></div>
                <div>Session ID = <?php echo session_id(); ?></div>
            </div>
        </div>

        <div class="section">
            <h2>👤 Session Data</h2>
            <div class="info-row">
                <span class="label">User ID:</span>
                <span class="value <?php echo isset($_SESSION['user_id']) ? 'status-success' : 'status-error'; ?>">
                    <?php echo $session_data['user_id']; ?>
                </span>
            </div>
            <div class="info-row">
                <span class="label">User Name:</span>
                <span class="value">
                    <?php echo $session_data['user_name']; ?>
                </span>
            </div>
            <div class="info-row">
                <span class="label">Role:</span>
                <span class="value">
                    <?php echo $session_data['role']; ?>
                </span>
            </div>
            <div class="info-row">
                <span class="label">Last Activity:</span>
                <span class="value">
                    <?php echo $session_data['last_activity']; ?>
                </span>
            </div>
            <div class="info-row">
                <span class="label">Login Time:</span>
                <span class="value">
                    <?php echo $session_data['login_time']; ?>
                </span>
            </div>
            <div class="info-row">
                <span class="label">Remaining Time:</span>
                <span class="value <?php echo $remaining_time === 'Expired' ? 'status-error' : 'status-success'; ?>">
                    <?php echo $remaining_time; ?>
                </span>
            </div>
            <div class="info-row">
                <span class="label">Session Status:</span>
                <span class="value <?php echo $is_expired ? 'status-error' : 'status-success'; ?>">
                    <?php echo $is_expired ? 'Expired' : 'Active'; ?>
                </span>
            </div>
        </div>

        <div class="section">
            <h2>📋 All Session Variables</h2>
            <table>
                <thead>
                    <tr>
                        <th>Variable</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($_SESSION as $key => $value): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($key); ?></td>
                        <td>
                            <?php 
                            if (is_array($value)) {
                                echo '<pre>' . htmlspecialchars(json_encode($value, JSON_PRETTY_PRINT)) . '</pre>';
                            } else if (is_numeric($value) && strlen($value) === 10) {
                                echo htmlspecialchars($value) . ' (' . date('Y-m-d H:i:s', $value) . ')';
                            } else {
                                echo htmlspecialchars((string)$value);
                            }
                            ?>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>

        <div class="section">
            <h2>🧪 Quick Tests</h2>
            <div class="alert alert-info">
                <strong>Tip:</strong> Use these buttons to test the session functionality.
            </div>
            <div class="buttons">
                <button class="btn btn-primary" onclick="location.reload()">Refresh Page</button>
                <button class="btn btn-success" onclick="testCheckSession()">Test Session Check</button>
                <form method="POST" style="display: inline;">
                    <button class="btn btn-danger" name="logout" value="1">Test Logout</button>
                </form>
            </div>
        </div>

        <div class="section">
            <h2>📝 Endpoints</h2>
            <div class="info-row">
                <span class="label">Check Session:</span>
                <span class="value">/E-commerce/backend/auth/checkSession.php</span>
            </div>
            <div class="info-row">
                <span class="label">Login:</span>
                <span class="value">/E-commerce/backend/auth/login.php</span>
            </div>
            <div class="info-row">
                <span class="label">Logout:</span>
                <span class="value">/E-commerce/backend/auth/logout.php</span>
            </div>
            <div class="info-row">
                <span class="label">Register:</span>
                <span class="value">/E-commerce/backend/auth/register.php</span>
            </div>
        </div>
    </div>

    <script>
        function testCheckSession() {
            const url = '/E-commerce/backend/auth/checkSession.php';
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log('Session Check Response:', data);
                    alert('Session Check:\n\n' + JSON.stringify(data, null, 2));
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error: ' + error.message);
                });
        }
    </script>

    <?php
    // Handle logout test
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['logout'])) {
        $_SESSION = [];
        session_destroy();
        echo '<script>alert("Session destroyed. Redirecting to login..."); window.location.href = "/E-commerce/pages/loginPage.html";</script>';
    }
    ?>
</body>
</html>
