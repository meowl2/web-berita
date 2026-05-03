<?php
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'];
$email = $data['email'];
$password = $data['password'];

// cek email
$cek = $conn->query("SELECT * FROM users WHERE email='$email'");
if ($cek->num_rows > 0) {
    echo json_encode(["message" => "Email sudah terdaftar"]);
    exit;
}

$sql = "INSERT INTO users (name, email, password) VALUES ('$name', '$email', '$password')";

if ($conn->query($sql)) {
    echo json_encode(["message" => "Registrasi berhasil"]);
} else {
    echo json_encode(["message" => "Gagal register"]);
}
?>