<?php
require 'conexion.php';

// Recibir datos JSON
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

if (isset($data['nombre']) && isset($data['cantidad']) && isset($data['precio'])) {
    $nombre = $conn->real_escape_string($data['nombre']);
    $cantidad = intval($data['cantidad']);
    $precio = floatval($data['precio']);

    $sql = "INSERT INTO items (nombre, cantidad, precio) VALUES ('$nombre', $cantidad, $precio)";

    if ($conn->query($sql) === TRUE) {
        http_response_code(201); // Creado
        echo json_encode(array("message" => "Artículo añadido correctamente"));
    } else {
        http_response_code(500); // Error interno del servidor
        echo json_encode(array("error" => "Error al añadir el artículo: " . $conn->error));
    }
} else {
    http_response_code(400); // Solicitud incorrecta
    echo json_encode(array("error" => "Faltan datos"));
}

$conn->close();
?>