<?php

session_start();
include '../../db.php';
header('Content-Type: application/json');

if (isset($_SESSION['cart'])) {
    unset($_SESSION['cart']);
}

echo json_encode(["message" => "Cart cleared successfully."]);
exit();

?>