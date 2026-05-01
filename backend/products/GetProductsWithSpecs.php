<?php
error_reporting(0);
include '../db.php';
header('Content-Type: application/json');

$id = $_GET['productId'] ?? null;

if (!$id) {
    echo json_encode(["error" => "Product ID missing"]);
    exit;
}


$productQuery = mysqli_query($con, "SELECT * FROM products WHERE id = $id");
$product = mysqli_fetch_assoc($productQuery);

if (!$product) {
    echo json_encode(["error" => "Product not found"]);
    exit;
}


$specQuery = mysqli_query($con, "SELECT spec_key, spec_value FROM product_specs WHERE product_id = $id");

$specs = [];
while ($row = mysqli_fetch_assoc($specQuery)) {
    $specs[$row['spec_key']] =  $row['spec_value'];
}

$product['specs'] = $specs;

echo json_encode($product);
exit;
?>