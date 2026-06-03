<?php

session_start();

include '../../db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $product_id = isset($data['product_id']) ? intval($data['product_id']) : 0;

    if ($product_id <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid product ID']);
        exit;
    }

    if (isset($_SESSION['cart']) && is_array($_SESSION['cart'])) {
        foreach ($_SESSION['cart'] as $key => $item) {
            if ($item['product_id'] == $product_id) {
                unset($_SESSION['cart'][$key]);
                $_SESSION['cart'] = array_values($_SESSION['cart']); // Re-index array
                echo json_encode(['success' => true, 'message' => 'Item removed from cart']);
                exit;
            }
        }
        echo json_encode(['success' => false, 'message' => 'Product not found in cart']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Cart is empty']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

?>