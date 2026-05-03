<?php
// =============================================
// LOGIN.PHP - Handler Login BitMedia
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
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

// Validasi input
if (!$data || empty($data['email']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email dan password harus diisi"]);
    exit();
}

$email    = trim($data['email']);
$password = $data['password'];

// Validasi format email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Format email tidak valid"]);
    exit();
}

// Koneksi database
require_once 'config.php';

// Cari user berdasarkan email (gunakan prepared statement agar aman dari SQL Injection)
$stmt = $conn->prepare("SELECT id, name, email, password FROM users WHERE email = ? LIMIT 1");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $conn->error]);
    exit();
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    // Email tidak ditemukan
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Email atau password salah"]);
    $stmt->close();
    $conn->close();
    exit();
}

$user = $result->fetch_assoc();

// Verifikasi password dengan password_verify (mendukung bcrypt)
if (!password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Email atau password salah"]);
    $stmt->close();
    $conn->close();
    exit();
}

// Login berhasil
$stmt->close();
$conn->close();

// Mulai session (opsional tapi disarankan)
session_start();
$_SESSION['user_id']   = $user['id'];
$_SESSION['user_name'] = $user['name'];
$_SESSION['user_email'] = $user['email'];

http_response_code(200);
echo json_encode([
    "success" => true,
    "message" => "Login berhasil! Selamat datang, " . $user['name'],
    "user" => [
        "id"    => $user['id'],
        "name"  => $user['name'],
        "email" => $user['email']
    ]
]);
?>