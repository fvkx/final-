<?php
require_once 'config.php';

$adminPassword = 'admin123';
$editorPassword = 'editor123';

$adminHash = password_hash($adminPassword, PASSWORD_BCRYPT);
$editorHash = password_hash($editorPassword, PASSWORD_BCRYPT);

try {
    $db->exec("DELETE FROM users WHERE username IN ('admin', 'editor')");

    $stmt = $db->prepare("INSERT INTO users (username, email, password_hash, role, created_at) VALUES (:username, :email, :hash, :role, NOW())");
    
    $stmt->execute([
        ':username' => 'admin',
        ':email' => 'admin@balingasag.gov.ph',
        ':hash' => $adminHash,
        ':role' => 'admin'
    ]);

    $stmt->execute([
        ':username' => 'editor',
        ':email' => 'editor@balingasag.gov.ph',
        ':hash' => $editorHash,
        ':role' => 'editor'
    ]);

    echo "Successfully updated users with correct password hashes. You can now login with admin/admin123 or editor/editor123.";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
