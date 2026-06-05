<?php
include '../../db.php';
header('Content-Type: application/json');

$sql = "SELECT 
            o.id AS order_id, o.user_id, o.order_date, o.status,o.total_price,
            oi.quantity, oi.price_at_purchase,
            p.name AS product_name
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id";



$result = $con->query($sql);




echo json_encode($result->fetch_all(MYSQLI_ASSOC));
?>