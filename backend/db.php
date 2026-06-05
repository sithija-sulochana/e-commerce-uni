<?php

error_reporting(0); 
ini_set('display_errors', 0);

// Session configuration
$lifetime = 604800; 
ini_set('session.gc_maxlifetime', $lifetime);
session_set_cookie_params($lifetime, '/');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$con = mysqli_connect("localhost", "root", "", "tech_hub");

if (!$con) {
  
    header('Content-Type: application/json');
    die(json_encode(["success" => false, "message" => "DB Error"]));
}

?>