<?php
$servername = "localhost"; // O la dirección de tu servidor MySQL
$username = "root";   // Tu nombre de usuario de MySQL
$password = "PhPmyAdmin"; // Tu contraseña de MySQL
$dbname = "lista_compra";   // El nombre de tu base de datos

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>