<?php
// config/database.php

/**
 * Database Connection Configuration
 * 
 * This class follows a singleton-like pattern to provide a reusable 
 * database connection across the API. Using PDO (PHP Data Objects) 
 * ensures secure database communication and protects against SQL injection.
 */
class Database {
    private $host = "127.0.0.1";
    private $db_name = "balingasag_cms";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            // Secure connection using PDO with UTF-8 charset to prevent encoding-based attacks
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";port=3307;dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password
            );
            
            // Set error mode to exception to avoid exposing sensitive database errors to the end user
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Disable emulated prepared statements. Forcing real prepared statements ensures
            // that data and SQL logic are separated, providing robust protection against SQL injection.
            $this->conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            
        } catch(PDOException $exception) {
            // Log the error internally and return a generic JSON message to prevent information leakage
            error_log("Connection error: " . $exception->getMessage());
            die(json_encode(["success" => false, "message" => "Database connection failed."]));
        }

        return $this->conn;
    }
}
?>
