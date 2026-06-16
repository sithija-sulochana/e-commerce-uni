<?php
include '../../db.php';
header('Content-Type: application/json');

$order_id = $_GET['order_id'] ?? '';
$sql = "SELECT p.name AS product_name, oi.quantity, oi.price_at_purchase FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?";

$stmt = $con->prepare($sql);
$stmt->bind_param("i", $order_id);
$stmt->execute();
$result = $stmt->get_result();
echo json_encode($result->fetch_all(MYSQLI_ASSOC));
?>