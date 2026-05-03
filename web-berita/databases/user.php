<?php
include 'config.php';

$nama = "Admin";
$email = "admin@gmail.com";
$password = password_hash("123456", PASSWORD_DEFAULT);

mysqli_query($conn, "INSERT INTO users (nama,email,password) 
VALUES ('$nama','$email','$password')");

echo "User berhasil dibuat";
?>