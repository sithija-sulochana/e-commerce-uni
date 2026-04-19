<?php

include '../db.php';



if(isset($_GET['deleteId'])){
    $id = $_GET['deleteId'];

    $sql = "DELETE FROM products WHERE id = $id";

    if(mysqli_query($con, $sql)){
        echo "Product deleted successfully.";
    } else {
        echo "Error deleting product: " . mysqli_error($con);
    }
}else{
    echo "No product ID provided.";
}
?>