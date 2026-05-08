<?php
$host = 'localhost';
$dbname = 'balingasag_cms';
$user = 'root';
$pass = '';

try {
    $db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if column exists
    $stmt = $db->query("SHOW COLUMNS FROM content_pages LIKE 'image_url'");
    if (!$stmt->fetch()) {
        $db->exec("ALTER TABLE content_pages ADD COLUMN image_url VARCHAR(500) AFTER category");
        echo "Migration successful: image_url added to content_pages table.";
    } else {
        echo "Migration skipped: image_url column already exists.";
    }
} catch (PDOException $e) {
    echo "Migration failed: " . $e->getMessage();
}
?>
