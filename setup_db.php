<?php
/**
 * Database Setup Script for Balingasag Tourism CMS.
 * 
 * Run this once via: http://localhost/Balingasag-Tourism-Guide/setup_db.php
 * It creates the database, all tables, and seeds lookup/default data.
 */
$host = '127.0.0.1';
$port = '3306';
$user = 'root';
$pass = '';

try {
    $db = new PDO("mysql:host=$host;port=$port", $user, $pass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // --- 1. Load and execute schema_final.sql ---
    $sqlFile = __DIR__ . '/schema_final.sql';
    if (!file_exists($sqlFile)) {
        throw new Exception("schema_final.sql not found at: $sqlFile");
    }

    $sql = file_get_contents($sqlFile);

    // Remove single-line comments (-- ...) but preserve strings containing --
    $sql = preg_replace('/--[^\r\n]*/', '', $sql);

    // Split by semicolon
    $queries = explode(';', $sql);

    $executed = 0;
    foreach ($queries as $query) {
        $query = trim($query);
        if (!empty($query)) {
            $db->exec($query);
            $executed++;
        }
    }

    // --- 2. Verify seed data was inserted ---
    $db->exec("USE balingasag_cms");

    $checks = [
        'roles'            => 'SELECT COUNT(*) FROM roles',
        'categories'       => 'SELECT COUNT(*) FROM categories',
        'content_statuses' => 'SELECT COUNT(*) FROM content_statuses',
        'section_types'    => 'SELECT COUNT(*) FROM section_types',
        'inquiry_statuses' => 'SELECT COUNT(*) FROM inquiry_statuses',
        'users'            => 'SELECT COUNT(*) FROM users',
    ];

    echo "<h1 style='color:green'>✅ Database Setup Successful</h1>";
    echo "<p>Executed <strong>$executed</strong> SQL statements.</p>";
    echo "<h3>Seed Data Summary:</h3>";
    echo "<table border='1' cellpadding='8' cellspacing='0' style='border-collapse:collapse; font-family:monospace'>";
    echo "<tr style='background:#f0f0f0'><th>Table</th><th>Rows</th></tr>";

    foreach ($checks as $table => $countQuery) {
        $count = $db->query($countQuery)->fetchColumn();
        $color = $count > 0 ? 'green' : 'red';
        echo "<tr><td>$table</td><td style='color:$color; font-weight:bold'>$count</td></tr>";
    }
    echo "</table>";

    echo "<br><h3>Default Login Credentials:</h3>";
    echo "<table border='1' cellpadding='8' cellspacing='0' style='border-collapse:collapse; font-family:monospace'>";
    echo "<tr style='background:#f0f0f0'><th>Username</th><th>Password</th><th>Role</th></tr>";
    echo "<tr><td>admin</td><td>admin123</td><td>admin</td></tr>";
    echo "<tr><td>editor</td><td>editor123</td><td>editor</td></tr>";
    echo "</table>";

    echo "<br><p style='color:#888'>You can now <a href='/admin/login'>log in to the admin panel</a>.</p>";

} catch (Exception $e) {
    echo "<h1 style='color:red'>❌ Setup Failed</h1>";
    echo "<p><strong>Error:</strong> " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p>Make sure:<br>";
    echo "- XAMPP MySQL is running on port <strong>$port</strong><br>";
    echo "- The <code>root</code> user has no password (or update this script)</p>";
}
?>
