<?php

require_once '../db.php';

session_start();
header('Content-Type: application/json');

// Check if user is logged in
if(!isset($_SESSION['user_id'])) {
    echo json_encode([
        "success" => false,
        "authenticated" => false,
        "message" => "User not authenticated"
    ]);
    exit;
}

// Check database connection
if (!isset($con) || !$con) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);
    exit;
}

$user_id = $_SESSION['user_id'] ?? null;

if (!$user_id) {
    echo json_encode([
        "success" => false,
        "authenticated" => false,
        "message" => "User not authenticated"
    ]);
    exit;
}

// Use procedural style to match mysqli_connect
$sql = "SELECT id, fullname, email, phone, address, role FROM users WHERE id = ?";
$stmt = mysqli_prepare($con, $sql);

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . mysqli_error($con)
    ]);
    exit;
}

mysqli_stmt_bind_param($stmt, "i", $user_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$user = mysqli_fetch_assoc($result);

if (!$user) {
    echo json_encode([
        "success" => false,
        "authenticated" => false,
        "message" => "User not found"
    ]);
    exit;
}

echo json_encode([
    "success" => true,
    "authenticated" => true,
    "user" => $user
]);

mysqli_stmt_close($stmt);
?>