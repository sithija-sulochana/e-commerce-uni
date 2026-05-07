<?php
include '../../db.php'; 
session_start();
header('Content-Type: application/json');

$user_id = $_SESSION['user_id'] ?? null;
$cart = $_SESSION['cart'] ?? [];

if (!$user_id) exit(json_encode(["success" => false, "message" => "Please log in."]));
if (empty($cart)) exit(json_encode(["success" => false, "message" => "Cart is empty."]));

$totalPrice = 0;
foreach ($cart as $item) {
    $discounted = $item['price'] * (1 - ($item['discount'] ?? 0) / 100);
    $totalPrice += $discounted * $item['quantity'];
}



$con->begin_transaction();
try {
    $stmt = $con->prepare("INSERT INTO orders (user_id, order_date, total_price, status) VALUES (?, NOW(), ?, 'Processing')");
    $stmt->bind_param("id", $user_id, $totalPrice);
    $stmt->execute();
    $order_id = $con->insert_id;

    $stmtItem = $con->prepare("INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)");
    foreach ($cart as $item) {
        $unitPrice = $item['price'] * (1 - ($item['discount'] ?? 0) / 100);
        $stmtItem->bind_param("iiid", $order_id, $item['product_id'], $item['quantity'], $unitPrice);
        $stmtItem->execute();
    }

    $con->commit();
    unset($_SESSION['cart']); 
    echo json_encode(["success" => true, "order_id" => $order_id]);

} catch (Exception $e) {
    $con->rollback();
    echo json_encode(["success" => false, "message" => "Error processing order"]);
}