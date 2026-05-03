<?php
$conn = new mysqli("localhost", "root", "", "web_berita");

if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}
?>