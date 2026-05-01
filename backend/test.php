<?php
header('Content-Type: application/json');
require_once '../db.php';

// Test database connection
echo json_encode([
    'success' => !empty($con) && mysqli_ping($con),
    'message' => empty($con) ? 'No connection object' : (mysqli_ping($con) ? 'Connected' : 'Connection failed'),
    'database' => 'tech_hub',
    'server' => 'localhost'
]);
?>
