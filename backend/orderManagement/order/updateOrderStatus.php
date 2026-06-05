<?php
header('Content-Type: application/json');
include '../../db.php'; 

$order_id = $_POST['order_id'] ?? '';
$status = $_POST['status'] ?? '';

if (!$order_id || !$status) {
    echo json_encode(["success" => false, "message" => "Missing data"]);
    exit;
}

$clean_id = str_replace('#', '', $order_id);

$sql = "UPDATE orders SET status = ? WHERE id = ?";
$stmt = $con->prepare($sql);
$stmt->bind_param("si", $status, $clean_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Order updated successfully!"]);
} else {
    echo json_encode(["success" => false, "message" => "Database error."]);
}
?>