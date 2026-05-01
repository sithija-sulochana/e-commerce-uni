<?php
session_start();
include '../../db.php';

$data = json_decode(file_get_contents("php://input"), true);
$productId = $data['product_id'];
$qty = $data['quantity'] ?? 1;

if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}


foreach ($_SESSION['cart'] as &$item) {
    if ($item['product_id'] == $productId) {
        $item['quantity'] += $qty;
        echo json_encode($_SESSION['cart']);
        exit;
    }
}


$product = mysqli_fetch_assoc(
    mysqli_query($con, "SELECT name, price, image, discount_percentage FROM products WHERE id=$productId")
);


$_SESSION['cart'][] = [
    "product_id" => $productId,
    "name" => $product['name'],
    "price" => $product['price'],
    "image" => $product['image'],
    "discount" => $product['discount_percentage'],
    "quantity" => $qty
];

echo json_encode($_SESSION['cart']);