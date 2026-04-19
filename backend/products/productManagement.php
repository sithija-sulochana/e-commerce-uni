<?php
include '../db.php'; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    

    $name = $_POST['name'] ?? '';
    $category = $_POST['category'] ?? '';
    $discountPrice = $_POST['discountPrice'] ?? 0;
    $description = $_POST['description'] ?? '';
    $price = $_POST['price'] ?? 0;
    $stock = $_POST['stock'] ?? 0;

    $imagePath = "";
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $image = $_FILES['image']['name'];
        $target = "images/" . basename($image);
        
        if (move_uploaded_file($_FILES['image']['tmp_name'], $target)) {
            $imagePath = $target;
            echo "Image uploaded successfully.";
        }else {
            echo "Failed to upload image.";
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

