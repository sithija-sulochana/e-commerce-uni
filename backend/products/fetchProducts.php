<?php
error_reporting(0); 

include '../db.php'; 

$sql = "SELECT * FROM products ORDER BY id DESC";
$result = mysqli_query($con, $sql);

if (!$result) {

    header('Content-Type: application/json');
    echo json_encode(["error" => mysqli_error($con)]);
    exit();
}

$products = [];
while ($row = mysqli_fetch_assoc($result)) {
  
    if (isset($row['specs'])) {
        $row['specs'] = json_decode($row['specs']);
    }
    $products[] = $row;
}

header('Content-Type: application/json');
echo json_encode($products);
?>