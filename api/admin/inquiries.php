<?php
require_once 'config.php';
require_once 'auth.php';

// Verify authentication for admin endpoints
$user = verifyToken();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $status = $_GET['status'] ?? 'all';
        $search = $_GET['search'] ?? '';
        $page = (int)($_GET['page'] ?? 1);
        $pageSize = 10;
        $offset = ($page - 1) * $pageSize;

        $sql = "SELECT * FROM inquiries WHERE 1=1";
        $params = [];

        if ($status !== 'all') {
            $sql .= " AND status = :status";
            $params[':status'] = $status;
        }

        if ($search) {
            $sql .= " AND (full_name LIKE :search OR email LIKE :search OR subject LIKE :search OR message LIKE :search)";
            $params[':search'] = "%$search%";
        }

        // Get total count
        $countStmt = $db->prepare(str_replace("SELECT *", "SELECT COUNT(*) as total", $sql));
        foreach ($params as $key => $value) {
            $countStmt->bindValue($key, $value);
        }
        $countStmt->execute();
        $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

        $sql .= " ORDER BY date_submitted DESC LIMIT :limit OFFSET :offset";
        
        $stmt = $db->prepare($sql);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->bindValue(':limit', $pageSize, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true, 
            'data' => $data,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'pageSize' => $pageSize,
                'totalPages' => ceil($total / $pageSize)
            ]
        ]);
        break;

    case 'POST':
        // For testing, allowing unauthenticated POST (since the public contact form will use it)
        $input = json_decode(file_get_contents('php://input'), true);
        
        $fullName = htmlspecialchars($input['fullName'], ENT_QUOTES, 'UTF-8');
        $email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
        $subject = htmlspecialchars($input['subject'], ENT_QUOTES, 'UTF-8');
        $message = htmlspecialchars($input['message'], ENT_QUOTES, 'UTF-8');

        $stmt = $db->prepare("INSERT INTO inquiries (full_name, email, subject, message, date_submitted, status) VALUES (:name, :email, :subject, :message, NOW(), 'unread')");
        $stmt->execute([
            ':name' => $fullName,
            ':email' => $email,
            ':subject' => $subject,
            ':message' => $message
        ]);

        echo json_encode(['success' => true, 'message' => 'Inquiry created']);
        break;

    case 'PATCH':
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Handle ID from path /api/admin/inquiries.php?id=123 if not in body
        $id = isset($input['id']) ? (int)$input['id'] : (isset($_GET['id']) ? (int)$_GET['id'] : 0);
        $status = $input['status'] ?? '';

        if ($id && $status) {
            $stmt = $db->prepare("UPDATE inquiries SET status = :status WHERE id = :id");
            $stmt->execute([':status' => $status, ':id' => $id]);
            echo json_encode(['success' => true, 'message' => 'Status updated']);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing ID or status']);
        }
        break;

    case 'DELETE':
        $id = (int)$_GET['id'];
        $stmt = $db->prepare("DELETE FROM inquiries WHERE id = :id");
        $stmt->execute([':id' => $id]);

        echo json_encode(['success' => true, 'message' => 'Inquiry deleted']);
        break;
}
?>
