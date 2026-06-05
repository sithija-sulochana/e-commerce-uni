<?php

include '../db.php';

session_start();
header('Content-Type: application/json');

if(!isset($_SESSION['user_id'])) {
    echo json_encode
    (["success"=>false,
    "authenticated"=>false,
    "message"=>"session expired, please log in again"]);

    exit;
}


if (!isset($con)) {
    echo json_encode(["success" => false, "message" => "Database connection variable not found. Check db.php"]);
    exit;
}

$user_id = $_SESSION['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(["success" => false, "message" => "User not authenticated"]);
    exit;
}

$stmt = $con->prepare("SELECT id, fullname, email, phone, address, role FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if (!$user) {
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit;
}

echo json_encode(["success" => true, "user" => $user]);
?>