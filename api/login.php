<?php
// api/login.php

require_once '../config/database.php';
require_once '../middleware/headers.php';

setSecurityHeaders();

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->username) && !empty($data->password)) {
    try {
        // Query to fetch user
        $query = "SELECT u.id, u.username, u.password_hash, r.role_name 
                  FROM users u
                  JOIN roles r ON u.role_id = r.id
                  WHERE u.username = :username LIMIT 1";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(":username", $data->username);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Verify password hash
            if (password_verify($data->password, $row['password_hash'])) {
                // In a real app, generate a JWT here
                // For simplicity, we return success and user info
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
                http_response_code(401);
                echo json_encode(["success" => false, "message" => "Invalid credentials."]);
            }
        } else {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Invalid credentials."]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Server error."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing credentials."]);
}
?>
