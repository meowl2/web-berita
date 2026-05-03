<?php
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'];
$password = $data['password'];

$sql = "SELECT * FROM users WHERE email='$email' AND password='$password'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo json_encode([
        "success" => true,
        "message" => "Login berhasil"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Email atau password salah"
    ]);
}
?>