<?php
// api/getUsers.php

require_once '../config/database.php';
require_once '../middleware/headers.php';

// Apply centralized security headers and CORS configurations
setSecurityHeaders();

// Initialize PDO Database connection
$database = new Database();
$db = $database->getConnection();

try {
    // Use prepared statements even for simple selects to maintain consistency
    // Explicitly define columns instead of SELECT * for better performance and security
    $query = "SELECT u.id, u.username, u.email, r.role_name, u.created_at 
              FROM users u
              JOIN roles r ON u.role_id = r.id
              ORDER BY u.created_at DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $users_arr = array();
        // Fetch rows securely using PDO::FETCH_ASSOC to get an associative array
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // Securely extract the data avoiding variable overwrites
            extract($row);
            $user_item = array(
                "id" => $id,
                "username" => $username,
                "email" => $email,
                "role" => $role_name,
                "created_at" => $created_at
            );
            array_push($users_arr, $user_item);
        }

        // Return 200 OK with the structured JSON data
        http_response_code(200);
        echo json_encode(["success" => true, "data" => $users_arr]);
    } else {
        // Return 404 Not Found if no users exist
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "No users found."]);
    }
} catch (Exception $e) {
    // Return 500 Internal Server Error without exposing internal SQL issues
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error."]);
}
?>
