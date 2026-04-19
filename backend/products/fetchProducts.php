<?php
include '../db.php';

$sql = "SELECT * FROM products ORDER BY id DESC";
$result = mysqli_query($con, $sql);

$products = [];
while ($row = mysqli_fetch_assoc($result)) {
    $products[] = $row;
}


header('Content-Type: application/json');
echo json_encode($products);
?>