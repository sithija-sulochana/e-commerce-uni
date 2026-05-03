<?php
include '../../db.php';
session_start();
header('Content-Type: application/json');

$order_id = $_GET['order_id'] ?? null;

if (!$order_id) {
    echo json_encode(["success" => false]);
    exit;
}

// Fetch Order Header
$stmt = $con->prepare("SELECT id, total_price, order_date, status FROM orders WHERE id = ?");
$stmt->bind_param("i", $order_id);
$stmt->execute();
$order = $stmt->get_result()->fetch_assoc();

if (!$order) {
    echo json_encode(["success" => false]);
    exit;
}

// Fetch Order Items joined with Product table to get Names and Images
$itemStmt = $con->prepare("
    SELECT oi.*, p.name, p.image 
    FROM order_items oi 
    JOIN products p ON oi.product_id = p.id 
    WHERE oi.order_id = ?
");
$itemStmt->bind_param("i", $order_id);
$itemStmt->execute();
$items = $itemStmt->get_result()->fetch_all(MYSQLI_ASSOC);

$order['items'] = $items;

echo json_encode(["success" => true, "order" => $order]);