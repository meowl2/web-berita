<?php
// =============================================
// REGISTER.PHP - Handler Register BitMedia
// =============================================

// Header CORS & Content-Type
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Hanya terima method POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method tidak diizinkan"]);
    exit();
}

// Ambil dan decode JSON body
$raw  = file_get_contents("php://input");
$data = json_decode($raw, true);

// Validasi input
if (!$data || empty($data['name']) || empty($data['email']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Semua field harus diisi"]);
    exit();
}

$name     = trim($data['name']);
$email    = trim($data['email']);
$password = $data['password'];

// Validasi nama tidak boleh kosong
if (strlen($name) < 2) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Nama minimal 2 karakter"]);
    exit();
}

// Validasi format email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Format email tidak valid"]);
    exit();
}

// Validasi panjang password
if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Password minimal 6 karakter"]);
    exit();
}

// Koneksi database
require_once 'config.php';

// Cek apakah email sudah terdaftar
$check = $conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
if (!$check) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $conn->error]);
    exit();
}

$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["success" => false, "message" => "Email sudah terdaftar, silakan gunakan email lain"]);
    $check->close();
    $conn->close();
    exit();
}
$check->close();

// Hash password dengan bcrypt (aman)
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Simpan user baru ke database
$stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $conn->error]);
    exit();
}

$stmt->bind_param("sss", $name, $email, $hashedPassword);

if ($stmt->execute()) {
    $newId = $conn->insert_id;
    $stmt->close();
    $conn->close();

    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "Akun berhasil dibuat! Silakan login.",
        "user" => [
            "id"    => $newId,
            "name"  => $name,
            "email" => $email
        ]
    ]);
} else {
    $stmt->close();
    $conn->close();

    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Gagal menyimpan data, coba lagi"]);
}
?>