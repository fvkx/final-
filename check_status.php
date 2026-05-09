<?php
require_once 'api/admin/config.php';
echo "<h1>System Status</h1>";
try {
    echo "Database Connection: OK<br>";
    $stmt = $db->query("SELECT COUNT(*) FROM users");
    $count = $stmt->fetchColumn();
    echo "Total Users: " . $count . "<br>";

    $stmt = $db->query("SELECT username FROM users");
    $users = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "Usernames: " . implode(', ', $users) . "<br>";

    echo "<h2>Testing admin123</h2>";
    $admin = 'admin';
    $pass = 'admin123';
    $stmt = $db->prepare("SELECT password_hash FROM users WHERE username = ?");
    $stmt->execute([$admin]);
    $hash = $stmt->fetchColumn();
    if ($hash) {
        if (password_verify($pass, $hash)) {
            echo "Password 'admin123' matches for 'admin': <span style='color:green'>YES</span><br>";
        } else {
            echo "Password 'admin123' matches for 'admin': <span style='color:red'>NO</span> (Hash: $hash)<br>";
        }
    } else {
        echo "Admin user not found.<br>";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
