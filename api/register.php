<?php
// api/register.php

require_once '../config/database.php';
require_once '../middleware/headers.php';

setSecurityHeaders();

// Get database connection
$database = new Database();
$db = $database->getConnection();

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->username) &&
    !empty($data->email) &&
    !empty($data->password) &&
    !empty($data->role_id)
) {
    try {
        // Check if user already exists
        $checkQuery = "SELECT id FROM users WHERE username = :username OR email = :email LIMIT 1";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->bindParam(":username", $data->username);
        $checkStmt->bindParam(":email", $data->email);
        $checkStmt->execute();

        if ($checkStmt->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Username or Email already exists."]);
            exit();
        }

        // Prepare query
        $query = "INSERT INTO users (username, email, password_hash, role_id) 
                  VALUES (:username, :email, :password, :role_id)";
        
        $stmt = $db->prepare($query);

        // Sanitize & Bind
        $username = htmlspecialchars(strip_tags($data->username));
        $email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
        
        // Secure Password Hashing
        $password_hash = password_hash($data->password, PASSWORD_BCRYPT);
        
        $stmt->bindParam(":username", $username);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":password", $password_hash);
        $stmt->bindParam(":role_id", $data->role_id);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["success" => true, "message" => "User was created."]);
        } else {
            http_response_code(503);
            echo json_encode(["success" => false, "message" => "Unable to create user."]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Incomplete data."]);
}
?>
