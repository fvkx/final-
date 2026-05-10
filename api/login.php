<?php
// api/login.php

require_once '../config/database.php';
require_once '../middleware/headers.php';

// Apply centralized security headers and CORS configurations
setSecurityHeaders();

// Initialize PDO Database connection
$database = new Database();
$db = $database->getConnection();

// Parse raw JSON input stream
$data = json_decode(file_get_contents("php://input"));

// Basic validation to ensure credentials were provided
if (!empty($data->username) && !empty($data->password)) {
    try {
        // Use prepared statements to safely query the database, preventing SQL Injection
        // We only fetch the necessary columns, avoiding SELECT * for better performance/security
        $query = "SELECT u.id, u.username, u.password_hash, r.role_name 
                  FROM users u
                  JOIN roles r ON u.role_id = r.id
                  WHERE u.username = :username LIMIT 1";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(":username", $data->username);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            // Fetch as associative array for clean JSON generation later
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Secure Password Verification:
            // password_verify safely compares the plain-text password against the bcrypt hash 
            // without exposing the hash or being susceptible to timing attacks.
            if (password_verify($data->password, $row['password_hash'])) {
                
                // Return 200 OK status on successful authentication
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "message" => "Login successful.",
                    "user" => [
                        "id" => $row['id'],
                        "username" => $row['username'],
                        "role" => $row['role_name']
                    ]
                ]);
            } else {
                // Return 401 Unauthorized for incorrect passwords to follow REST standards
                http_response_code(401);
                echo json_encode(["success" => false, "message" => "Invalid credentials."]);
            }
        } else {
            // Return 401 Unauthorized if the user doesn't exist
            // Using the same error message as above prevents username enumeration attacks
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Invalid credentials."]);
        }
    } catch (Exception $e) {
        // Catch exceptions to prevent exposing raw database errors
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Server error."]);
    }
} else {
    // Return 400 Bad Request for malformed or incomplete authentication payloads
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing credentials."]);
}
?>
