<?php
header('Content-Type: application/json');
session_start();

// Include database connection
require_once '../db.php';


if (!function_exists('initializeSessionSettings')) {
    require_once 'sessionConfig.php';
}


initializeSessionSettings();

if (!isset($con) || !$con) {
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed!'
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        echo json_encode(['success' => false, 'message' => 'Invalid data format.']);
        exit;
    }

    $fullname = $data['fullname'] ?? '';
    $email = $data['email'] ?? '';
    $phone = $data['phone'] ?? '';
    $password = $data['password'] ?? '';
    $address = $data['address'] ?? '';
    $role = 'CUSTOMER';

    // Validate input
    if (empty($fullname) || empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Required fields are missing.']);
        exit;
    }

    // Check if email already exists (using prepared statement)
    $check_sql = "SELECT id FROM users WHERE email = ?";
    $check_stmt = mysqli_prepare($con, $check_sql);
    if (!$check_stmt) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . mysqli_error($con)]);
        exit;
    }

    mysqli_stmt_bind_param($check_stmt, "s", $email);
    mysqli_stmt_execute($check_stmt);
    $check_result = mysqli_stmt_get_result($check_stmt);
    
    if (mysqli_num_rows($check_result) > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already exists!']);
        mysqli_stmt_close($check_stmt);
        exit;
    }
    mysqli_stmt_close($check_stmt);

    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insert user with prepared statement
    $insert_sql = "INSERT INTO users (fullname, email, phone, password, address, role) VALUES (?, ?, ?, ?, ?, ?)";
    $insert_stmt = mysqli_prepare($con, $insert_sql);
    
    if (!$insert_stmt) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . mysqli_error($con)]);
        exit;
    }

    mysqli_stmt_bind_param($insert_stmt, "ssssss", $fullname, $email, $phone, $hashed_password, $address, $role);
    
    if (mysqli_stmt_execute($insert_stmt)) {
        $user_id = mysqli_insert_id($con);
        $_SESSION['user_id'] = $user_id;
        $_SESSION['user_name'] = $fullname;
        $_SESSION['role'] = $role;
        $_SESSION['last_activity'] = time();
        $_SESSION['login_time'] = time();
        
        echo json_encode([
            'success' => true,
            'message' => 'Registration successful!',
            'user' => [
                'id' => $user_id,
                'fullname' => $fullname,
                'email' => $email,
                'role' => $role
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . mysqli_error($con)]);
    }
    
    mysqli_stmt_close($insert_stmt);
}

?>