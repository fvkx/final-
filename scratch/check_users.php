<?php
require_once 'api/admin/config.php';
$stmt = $db->query("SELECT username, password_hash FROM users");
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($users);
?>
