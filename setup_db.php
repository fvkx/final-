<?php
$host = 'localhost';
$user = 'root';
$pass = '';

try {
    $db = new PDO("mysql:host=$host", $user, $pass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $db->exec("CREATE DATABASE IF NOT EXISTS balingasag_cms");
    $db->exec("USE balingasag_cms");
    
    if (!file_exists('setup.sql')) {
        throw new Exception("setup.sql file not found in " . getcwd());
    }
    
    $sql = file_get_contents('setup.sql');
    // Remove comments and split by semicolon
    $sql = preg_replace('/--.*$/m', '', $sql);
    $queries = explode(';', $sql);
    
    foreach ($queries as $query) {
        $query = trim($query);
        if (!empty($query)) {
            $db->exec($query);
        }
    }
    
    echo "<h1 style='color:green'>Database Setup Successful</h1>";
    echo "The database 'balingasag_cms' has been created and populated.<br>";
    echo "You can now login to the admin portal with:<br>";
    echo "<b>Username:</b> admin<br>";
    echo "<b>Password:</b> admin123";
} catch (Exception $e) {
    echo "<h1 style='color:red'>Setup Failed</h1>";
    echo "Error: " . $e->getMessage();
    echo "<br><br>Please make sure XAMPP (MySQL) is running and your 'root' user has no password. If it has a password, update this script.";
}
?>
