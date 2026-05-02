<?php
include 'config.php';

$query = "SELECT * FROM berita ORDER BY tanggal DESC";
$result = mysqli_query($conn, $query);

$data = [];

while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

echo json_encode($data);
?>