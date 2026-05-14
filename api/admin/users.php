<?php
require_once 'config.php';
require_once 'auth.php';

// Verify authentication
$user = verifyToken();

// Only admin can manage users
if ($user->role !== 'admin' && $_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Forbidden: Only admins can manage users']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $db->query("
            SELECT u.id, u.username, u.email, r.role_name as role, u.created_at
            FROM users u
            JOIN roles r ON u.role_id = r.id
            ORDER BY u.created_at DESC
        ");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $users]);
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);

        $username = trim($input['username'] ?? '');
        $email    = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';
        $roleName = $input['role'] ?? 'viewer';

        if (!$username || !$email || !$password) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing required fields']);
            exit;
        }

        // Look up the role_id from the roles table
        $roleStmt = $db->prepare("SELECT id FROM roles WHERE role_name = :role_name");
        $roleStmt->execute([':role_name' => $roleName]);
        $role = $roleStmt->fetch(PDO::FETCH_ASSOC);

        if (!$role) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid role specified']);
            exit;
        }

        $password_hash = password_hash($password, PASSWORD_BCRYPT);

        try {
            $stmt = $db->prepare("
                INSERT INTO users (username, email, password_hash, role_id, created_at)
                VALUES (:username, :email, :password_hash, :role_id, NOW())
            ");
            $stmt->execute([
                ':username'      => $username,
                ':email'         => $email,
                ':password_hash' => $password_hash,
                ':role_id'       => $role['id'],
            ]);
            echo json_encode(['success' => true, 'message' => 'User created successfully']);
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Error: Username or email might already exist']);
        }
        break;

    case 'DELETE':
        $id = (int)($_GET['id'] ?? 0);

        // Prevent deleting oneself
        if ($id === $user->id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Cannot delete your own account']);
            exit;
        }

        $stmt = $db->prepare("DELETE FROM users WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
        break;
}
?>
