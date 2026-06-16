<?php
session_start();
include '../../db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

$productId = intval($data['product_id']);
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




$result = mysqli_query($con, "SELECT name, price, image, discount_percentage FROM products WHERE id=$productId");
if(!$result || mysqli_num_rows($result) == 0) {
    http_response_code(404);
    echo json_encode(["error" => "Product not found"]);
    exit;
}
$product = mysqli_fetch_assoc($result);


$_SESSION['cart'][] = [
    "product_id" => $productId,
    "name" => $product['name'],
    "price" => $product['price'],
    "image" => $product['image'],
    "discount" => $product['discount_percentage'],
    "quantity" => $qty
];

echo json_encode($_SESSION['cart']);