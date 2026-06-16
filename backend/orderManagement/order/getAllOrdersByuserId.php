<?php
include '../../db.php';
header('Content-Type: application/json');

$userId = $_GET['user_id'] ?? null;
$sql = "SELECT 
            o.id AS order_id, o.user_id,u.email AS user_email, o.order_date, o.status,o.total_price,
            oi.quantity, oi.price_at_purchase,
            p.name AS product_name
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN users u ON o.user_id = u.id
        JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = ?";

$stmt = $con->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();




echo json_encode($result->fetch_all(MYSQLI_ASSOC));
?>