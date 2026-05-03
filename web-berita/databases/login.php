<?php
session_start();
include 'config.php';

$email = $_POST['email'];
$password = $_POST['password'];

$data = mysqli_query($conn, "SELECT * FROM users WHERE email='$email'");
$user = mysqli_fetch_assoc($data);

if ($user && password_verify($password, $user['password'])) {
    $_SESSION['user'] = $user['nama'];

    header("Location: index.php"); // ke web berita kamu
    exit();
} else {
    echo "Email atau password salah";
}
?>