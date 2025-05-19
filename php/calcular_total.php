<?php
require 'conexion.php';

$sql = "SELECT SUM(cantidad * precio) AS total FROM items";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $total = $row["total"] ? number_format($row["total"], 2, '.', '') : "0.00";
    echo json_encode(array("total" => $total));
} else {
    echo json_encode(array("total" => "0.00"));
}

$conn->close();
?>