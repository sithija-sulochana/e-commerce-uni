<?php
header('Content-Type: application/json');
session_start();
include '../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        echo json_encode(['success' => false, 'message' => 'Invalid data format.']);
        exit;
    }

    $fullname = mysqli_real_escape_string($con, $data['fullname']);
    $email = mysqli_real_escape_string($con, $data['email']);
    $phone = mysqli_real_escape_string($con, $data['phone']);
    $password = password_hash($data['password'], PASSWORD_DEFAULT);
    $address = mysqli_real_escape_string($con, $data['address']);
    $role = 'CUSTOMER';

    $check = mysqli_query($con, "SELECT id FROM users WHERE email = '$email'");
    
    if (mysqli_num_rows($check) > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already exists!']);
    } else {
        $sql = "INSERT INTO users (fullname, email, phone, password, address, role) VALUES ('$fullname', '$email', '$phone', '$password', '$address', '$role')";
        
        if (mysqli_query($con, $sql)) {
            $_SESSION['user_id'] = mysqli_insert_id($con);
            $_SESSION['user_name'] = $fullname;
            echo json_encode(['success' => true, 'message' => 'Registration successful!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Database error: ' . mysqli_error($con)]);
        }
    }
    

    
}

?>