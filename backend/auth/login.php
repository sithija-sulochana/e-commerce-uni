<?php

session_start();
include '../db.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!$data) {
    echo json_encode([
        'success' => false,
        'message' => 'No data received!'
    ]);
    exit;
}

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode([
        'success' => false,
        'message' => 'Email and password are required.'
    ]);
    exit;
}

// Get user from DB
$sql = "SELECT id, fullname, email, phone, password FROM users WHERE email = ?";
$stmt = mysqli_prepare($con, $sql);
mysqli_stmt_bind_param($stmt, "s", $email);
mysqli_stmt_execute($stmt);

$result = mysqli_stmt_get_result($stmt);
$user = mysqli_fetch_assoc($result);

// Verify password
if ($user && password_verify($password, $user['password'])) {

    // Store session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['fullname'];
    $_SESSION['role'] = $user['role'] ?? 'CUSTOMER';

    // Send response
    echo json_encode([
        'success' => true,
        'message' => 'Login successful!',
        'user' => [
            'id' => $user['id'],
            'fullname' => $user['fullname'],
            'email' => $user['email'],
            'phone' => $user['phone']
        ]
    ]);

} else if ($user) {

    echo json_encode([
        'success' => false,
        'message' => 'Incorrect password!'
    ]);

} else {

    echo json_encode([
        'success' => false,
        'message' => 'User not found!'
    ]);
}
?>