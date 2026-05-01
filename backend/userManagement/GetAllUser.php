<?php

include '../db.php';
header('Content-Type: application/json');

$sql = "SELECT id, fullname, email, phone, address, role FROM users";
$result = mysqli_query($con, $sql);
$users = [];

while ($row = mysqli_fetch_assoc($result)) {
    $users[] = $row;
}
echo json_encode($users);

?>