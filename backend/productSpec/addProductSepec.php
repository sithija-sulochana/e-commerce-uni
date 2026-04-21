<?php

include '../db.php';


// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Handle form POST data (not JSON)
$productId = $_POST['productIdspec'] ?? '';
$specKeys = $_POST['spec_key'] ?? [];
$specValues = $_POST['spec_value'] ?? [];


if (empty($productId)) {
  
    echo "Error: Product ID is required. Debug POST: ";
    var_export($_POST);
    return;
}

if (!is_array($specKeys) || !is_array($specValues) || count($specKeys) !== count($specValues)) {
    echo "Error: Invalid specifications.";
    return;
}

$stmt = $con->prepare("INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES (?, ?, ?)");
if (!$stmt) {
    echo "Error: " . $con->error;
    return;
}

$success = true;
for ($i = 0; $i < count($specKeys); $i++) {
    $key = trim($specKeys[$i]);
    $value = trim($specValues[$i]);
    if (empty($key) || empty($value)) {
        echo "Error: Both key and value are required for each specification.";
        $success = false;
        break;
    }
    $stmt->bind_param("iss", $productId, $key, $value);
    if (!$stmt->execute()) {
        echo "Error: " . $stmt->error;
        $success = false;
        break;
    }
}

if ($success) {
    echo "Success: Product specifications added successfully!";
}


?>