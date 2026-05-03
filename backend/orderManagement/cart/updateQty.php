<?php

session_start();
include '../../db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$productId = $data['product_id'];
$qtyChange = $data['quantity_change'] ?? 0;

if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

foreach($_SESSION['cart'] as $index => &$item){
    if($item['product_id'] == $productId){
        if($qtyChange === -1){
            if($item['quantity'] > 1){
                $item['quantity'] -= 1;
            } else {
                unset($_SESSION['cart'][$index]);
            }
        } elseif($qtyChange === 1){
            $item['quantity'] += 1;
        }
        break;
    }
}

echo json_encode($_SESSION['cart']);

?>