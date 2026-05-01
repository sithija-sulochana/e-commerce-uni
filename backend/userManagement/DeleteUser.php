<?php

include '../db.php';

if($_SERVER['REQUEST_METHOD'] === "POST"){

    $userID = $_POST['customerID'] ?? null;

    if(!$userID){
        echo "Missing required fields!";
        exit;
    }
    $sql = "DELETE FROM users WHERE id = '$userID'";
    if(mysqli_query($con, $sql)){
        echo "User deleted successfully!";
    } else {
        echo "Error: " . mysqli_error($con);
    }
}else{
    echo "Invalid request method!";
}


?>
