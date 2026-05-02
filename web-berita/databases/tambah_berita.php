<?php
include 'config.php';

$judul = $_POST['judul'];
$isi = $_POST['isi'];
$gambar = $_POST['gambar'];
$kategori = $_POST['kategori'];

$query = "INSERT INTO berita (judul, isi, gambar, kategori)
          VALUES ('$judul','$isi','$gambar','$kategori')";

if(mysqli_query($conn, $query)){
    echo "Berhasil tambah berita";
}else{
    echo "Gagal";
}
?>