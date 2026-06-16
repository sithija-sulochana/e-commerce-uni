<?php
include '../db.php'; 
error_reporting(E_ALL);
ini_set('display_errors', 1);
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    

    $name = $_POST['name'] ?? '';
    $category = $_POST['category'] ?? '';
    $discountPrice = $_POST['discountPrice'] ?? 0;
    $description = $_POST['description'] ?? '';
    $price = $_POST['price'] ?? 0;
    $stock = $_POST['stock'] ?? 0;

    $uploadDir = __DIR__ . '/../assets/images/';
    echo "Upload directory: " . $uploadDir . "<br>"; 
    if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

 


if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$imagePath = "";
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $fileName = basename($_FILES['image']['name']);
    $targetFilePath = $uploadDir . $fileName;

   
    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFilePath)) {
        
       
        $imagePath = 'http://localhost/E-commerce/backend/products/assets/images/' . $fileName; 
        
    } else {
        die("Error: Failed to move uploaded file. Check folder permissions.");
    }
}

    $sql = "INSERT INTO products (name, description, price, discount_percentage, category, image, stockQuantity) 
            VALUES ('$name', '$description', '$price', '$discountPrice', '$category', '$imagePath', '$stock')";

    if (mysqli_query($con, $sql)) {
        echo "<script>alert('Product added successfully!'); window.location.href='../adminPages/productCRUD.html';</script>";
    } else {
        echo "Error: " . mysqli_error($con);
    }
}
?>

