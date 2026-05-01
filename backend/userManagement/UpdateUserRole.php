<?php
include '../db.php';

if($_SERVER['REQUEST_METHOD'] === "POST"){

    $userEmail = $_POST['customerEmail'] ?? null;
    $userRole  = $_POST['userRole'] ?? null;

    if(!$userEmail || !$userRole){
        echo "Missing required fields!";
        exit;
    }

    $sql = "UPDATE users SET role = '$userRole' WHERE email = '$userEmail'";

    if(mysqli_query($con, $sql)){
        echo "User role updated successfully!";
    } else {
        echo "Error: " . mysqli_error($con);
    }
}
?>