<?php
include '../db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST['updateId'] ?? '';
    $newQty = $_POST['newqty'] ?? '';
    $newPrice = $_POST['newPrice'] ?? '';
    $newDiscount = $_POST['newDiscount'] ?? '';

    if (empty($id)) {
        echo "Error: Product ID is required.";
        
        exit;
    }


    $getCurrentStock = "SELECT stockQuantity FROM products WHERE id = '$id'";
    $result = mysqli_query($con, $getCurrentStock);
    $row = mysqli_fetch_assoc($result);
    $currentStock = (int)$row['stockQuantity'];
    $newStock = $currentStock + (int)$newQty;


    $updates = [];
    if ($newQty !== '') $updates[] = "stockQuantity = '$newStock'";
    if ($newPrice !== '') $updates[] = "price = '$newPrice'";
    if ($newDiscount !== '') $updates[] = "discount_percentage = '$newDiscount'";

    if (count($updates) > 0) {
        $sql = "UPDATE products SET " . implode(', ', $updates) . " WHERE id = '$id'";

        if (mysqli_query($con, $sql)) {
            echo "Success: Product updated successfully!";
        } else {
            echo "Error: " . mysqli_error($con);
        }
    } else {
        echo "Error: No data provided to update.";
    }
}
?>