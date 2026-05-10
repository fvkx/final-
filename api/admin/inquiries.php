<?php
require_once 'config.php';
require_once 'auth.php';

<<<<<<< HEAD
// Verify authentication for all admin endpoints
$user = verifyToken();
=======
>>>>>>> 8d2200f (improve admin content system)

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
<<<<<<< HEAD
        $statusFilter = $_GET['status'] ?? 'all';
        $search       = $_GET['search'] ?? '';
        $page         = (int)($_GET['page'] ?? 1);
        $pageSize     = 10;
        $offset       = ($page - 1) * $pageSize;
=======
        $user = verifyToken();
        $status = $_GET['status'] ?? 'all';
        $search = $_GET['search'] ?? '';
        $page = (int)($_GET['page'] ?? 1);
        $pageSize = 10;
        $offset = ($page - 1) * $pageSize;
>>>>>>> 8d2200f (improve admin content system)

        // Build the base query joining inquiry_statuses to expose the status name
        $sql = "
            SELECT i.id, i.full_name, i.email, i.subject, i.message, i.date_submitted,
                   s.status_name as status
            FROM inquiries i
            JOIN inquiry_statuses s ON i.status_id = s.id
            WHERE 1=1
        ";
        $params = [];

        if ($statusFilter !== 'all') {
            $sql .= " AND s.status_name = :status";
            $params[':status'] = $statusFilter;
        }

        if ($search) {
            $sql .= " AND (i.full_name LIKE :search OR i.email LIKE :search OR i.subject LIKE :search OR i.message LIKE :search)";
            $params[':search'] = "%$search%";
        }

        // Get total count for pagination
        $countSql  = "SELECT COUNT(*) as total FROM inquiries i JOIN inquiry_statuses s ON i.status_id = s.id WHERE 1=1";
        $cParams   = [];
        if ($statusFilter !== 'all') {
            $countSql .= " AND s.status_name = :status";
            $cParams[':status'] = $statusFilter;
        }
        if ($search) {
            $countSql .= " AND (i.full_name LIKE :search OR i.email LIKE :search OR i.subject LIKE :search OR i.message LIKE :search)";
            $cParams[':search'] = "%$search%";
        }
        $countStmt = $db->prepare($countSql);
        $countStmt->execute($cParams);
        $total = (int)$countStmt->fetch(PDO::FETCH_ASSOC)['total'];

        $sql .= " ORDER BY i.date_submitted DESC LIMIT :limit OFFSET :offset";
        $stmt = $db->prepare($sql);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->bindValue(':limit', $pageSize, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success'    => true,
            'data'       => $data,
            'pagination' => [
                'total'      => $total,
                'page'       => $page,
                'pageSize'   => $pageSize,
                'totalPages' => (int)ceil($total / $pageSize),
            ]
        ]);
        break;

    case 'POST':
        // Public contact form submission — no auth required for inserts
        $input = json_decode(file_get_contents('php://input'), true);

        $fullName = htmlspecialchars($input['fullName'] ?? '', ENT_QUOTES, 'UTF-8');
        $email    = filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL);
        $subject  = htmlspecialchars($input['subject'] ?? '', ENT_QUOTES, 'UTF-8');
        $message  = htmlspecialchars($input['message'] ?? '', ENT_QUOTES, 'UTF-8');

        if (!$fullName || !$email || !$subject || !$message) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'All fields are required']);
            exit;
        }

        // Resolve the 'unread' status_id
        $statusStmt = $db->prepare("SELECT id FROM inquiry_statuses WHERE status_name = 'unread'");
        $statusStmt->execute();
        $statusRow = $statusStmt->fetch(PDO::FETCH_ASSOC);

        if (!$statusRow) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Server configuration error: inquiry status not found']);
            exit;
        }

        $stmt = $db->prepare("
            INSERT INTO inquiries (full_name, email, subject, message, date_submitted, status_id)
            VALUES (:name, :email, :subject, :message, NOW(), :status_id)
        ");
        $stmt->execute([
            ':name'      => $fullName,
            ':email'     => $email,
            ':subject'   => $subject,
            ':message'   => $message,
            ':status_id' => $statusRow['id'],
        ]);

        echo json_encode(['success' => true, 'message' => 'Inquiry submitted successfully']);
        break;

    case 'PATCH':
<<<<<<< HEAD
        $input     = json_decode(file_get_contents('php://input'), true);
        $id        = isset($input['id']) ? (int)$input['id'] : (int)($_GET['id'] ?? 0);
        $statusName = $input['status'] ?? '';
=======
        $user = verifyToken();
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Handle ID from path /api/admin/inquiries.php?id=123 if not in body
        $id = isset($input['id']) ? (int)$input['id'] : (isset($_GET['id']) ? (int)$_GET['id'] : 0);
        $status = $input['status'] ?? '';
>>>>>>> 8d2200f (improve admin content system)

        if (!$id || !$statusName) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing id or status']);
            exit;
        }

        // Resolve status_id from the name
        $statusStmt = $db->prepare("SELECT id FROM inquiry_statuses WHERE status_name = :name");
        $statusStmt->execute([':name' => $statusName]);
        $statusRow = $statusStmt->fetch(PDO::FETCH_ASSOC);

        if (!$statusRow) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid status value']);
            exit;
        }

        $stmt = $db->prepare("UPDATE inquiries SET status_id = :status_id WHERE id = :id");
        $stmt->execute([':status_id' => $statusRow['id'], ':id' => $id]);
        echo json_encode(['success' => true, 'message' => 'Status updated']);
        break;

    case 'DELETE':
<<<<<<< HEAD
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing inquiry id']);
            exit;
        }
=======
        $user = verifyToken();
        $id = (int)$_GET['id'];
>>>>>>> 8d2200f (improve admin content system)
        $stmt = $db->prepare("DELETE FROM inquiries WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(['success' => true, 'message' => 'Inquiry deleted']);
        break;
}
?>
