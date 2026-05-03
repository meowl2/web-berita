<?php
// Konfigurasi Database
define('DB_HOST', 'localhost');
define('DB_USER', 'root');        // Ganti sesuai username MySQL kamu
define('DB_PASS', '');            // Ganti sesuai password MySQL kamu
define('DB_NAME', 'bitmedia_db'); // Nama database

// Buat koneksi
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Cek koneksi
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Koneksi database gagal: " . $conn->connect_error
    ]);
    exit();
}

// Set charset UTF-8
$conn->set_charset("utf8mb4");
?>