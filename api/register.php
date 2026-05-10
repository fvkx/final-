<?php
// api/register.php

require_once '../config/database.php';
require_once '../middleware/headers.php';

// Apply centralized security headers to protect this endpoint
setSecurityHeaders();

// Initialize Database connection securely using PDO
$database = new Database();
$db = $database->getConnection();

// Parse incoming JSON payload securely. Using php://input ensures we can read raw POST data 
// regardless of the content-type, which is standard for REST APIs.
$data = json_decode(file_get_contents("php://input"));

// Validate that required fields are present to prevent processing incomplete requests
if (
    !empty($data->username) &&
    !empty($data->email) &&
    !empty($data->password) &&
    !empty($data->role_id)
) {
    try {
        // Use prepared statements to check for existing users, mitigating SQL Injection
        $checkQuery = "SELECT id FROM users WHERE username = :username OR email = :email LIMIT 1";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->bindParam(":username", $data->username);
        $checkStmt->bindParam(":email", $data->email);
        $checkStmt->execute();

        // If user exists, return a 400 Bad Request to indicate a client-side error (duplicate data)
        if ($checkStmt->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Username or Email already exists."]);
            exit();
        }

        // Prepare the INSERT query
        $query = "INSERT INTO users (username, email, password_hash, role_id) 
                  VALUES (:username, :email, :password, :role_id)";
        
        $stmt = $db->prepare($query);

        // Input Sanitization:
        // htmlspecialchars and strip_tags remove any HTML/JS tags to prevent Stored XSS.
        $username = htmlspecialchars(strip_tags($data->username));
        // filter_var validates and sanitizes the email format securely.
        $email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
        
        // Secure Password Hashing:
        // password_hash uses the standard bcrypt algorithm, automatically generating a secure salt.
        // This is significantly safer than outdated methods like MD5 or SHA1.
        $password_hash = password_hash($data->password, PASSWORD_BCRYPT);
        
        // Bind parameters securely to the prepared statement
        $stmt->bindParam(":username", $username);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":password", $password_hash);
        $stmt->bindParam(":role_id", $data->role_id);

        if ($stmt->execute()) {
            // Return 201 Created HTTP status to accurately reflect successful resource creation
            http_response_code(201);
            echo json_encode(["success" => true, "message" => "User was created."]);
        } else {
            // Return 503 Service Unavailable if the query fails unexpectedly
            http_response_code(503);
            echo json_encode(["success" => false, "message" => "Unable to create user."]);
        }
    } catch (Exception $e) {
        // Return 500 Internal Server Error for unhandled exceptions, keeping stack traces hidden
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
    }
} else {
    // Return 400 Bad Request if the JSON payload is missing required fields
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Incomplete data."]);
}
?>
