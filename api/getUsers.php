<?php
// api/getUsers.php

require_once '../config/database.php';
require_once '../middleware/headers.php';

setSecurityHeaders();

$database = new Database();
$db = $database->getConnection();

try {
    // Select users with their role names
    $query = "SELECT u.id, u.username, u.email, r.role_name, u.created_at 
              FROM users u
              JOIN roles r ON u.role_id = r.id
              ORDER BY u.created_at DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $users_arr = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
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

        http_response_code(200);
        echo json_encode(["success" => true, "data" => $users_arr]);
    } else {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "No users found."]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error."]);
}
?>
