<?php

session_start();
header('Content-Type: application/json');


if(!isset($_SESSION['cart']) || empty($_SESSION['cart'])) {
    echo json_encode([]);
    exit;
}

$cart = [];

foreach($_SESSION['cart'] as $item) {
    $cart[] = [
        "product_id" => $item['product_id'],
        "name" => $item['name'],
        "price" => $item['price'],
        "image" => $item['image'],
        "discount" => $item['discount'],
        "quantity" => $item['quantity']
    ];


}

echo json_encode($cart);
exit;


?>