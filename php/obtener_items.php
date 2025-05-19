<?php
require 'conexion.php';

$sql = "SELECT id, nombre, cantidad, precio FROM items";
$result = $conn->query($sql);

$items = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($items);

$conn->close();
?>