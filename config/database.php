<?php
// config/database.php

class Database {
    private $host = "localhost";
    private $db_name = "balingasag_cms";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            // Secure connection using PDO with UTF-8 charset
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password
            );
            
            // Set error mode to exception for better debugging and security
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Disable emulated prepared statements for real prepared statements (SQLi protection)
            $this->conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            
        } catch(PDOException $exception) {
            // Log error instead of showing it to user in production
            error_log("Connection error: " . $exception->getMessage());
            die(json_encode(["success" => false, "message" => "Database connection failed."]));
        }

        return $this->conn;
    }
}
?>
