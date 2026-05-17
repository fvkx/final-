<?php
require_once 'config.php';
require_once 'auth.php';

$method = $_SERVER['REQUEST_METHOD'];

// Detect schema at runtime
$inquiryColumns = [];
$stmt = $db->query("SHOW COLUMNS FROM `inquiries`");
if ($stmt) {
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $inquiryColumns[] = $row['Field'];
    }
}
$useNormalizedInquiries = in_array('status_id', $inquiryColumns);

switch ($method) {
    case 'GET':
        $user = verifyToken();
        $statusFilter = $_GET['status'] ?? 'all';
        $search       = $_GET['search'] ?? '';
        $page         = (int)($_GET['page'] ?? 1);
        $pageSize     = 10;
        $offset       = ($page - 1) * $pageSize;

        // Build the base query based on detected schema
        if ($useNormalizedInquiries) {
            $sql = "
                SELECT i.id, i.full_name, i.email, i.subject, i.message, i.date_submitted,
                       s.status_name as status
                FROM inquiries i
                JOIN inquiry_statuses s ON i.status_id = s.id
                WHERE 1=1
            ";
        } else {
            $sql = "
                SELECT i.id, i.full_name, i.email, i.subject, i.message, i.date_submitted,
                       i.status as status
                FROM inquiries i
                WHERE 1=1
            ";
        }
        $params = [];

        if ($statusFilter !== 'all') {
            if ($useNormalizedInquiries) {
                $sql .= " AND s.status_name = :status";
            } else {
                $sql .= " AND i.status = :status";
            }
            $params[':status'] = $statusFilter;
        }

        if ($search) {
            $sql .= " AND (i.full_name LIKE :search OR i.email LIKE :search OR i.subject LIKE :search OR i.message LIKE :search)";
            $params[':search'] = "%$search%";
        }

        // Get total count for pagination based on detected schema
        if ($useNormalizedInquiries) {
            $countSql  = "SELECT COUNT(*) as total FROM inquiries i JOIN inquiry_statuses s ON i.status_id = s.id WHERE 1=1";
        } else {
            $countSql  = "SELECT COUNT(*) as total FROM inquiries i WHERE 1=1";
        }
        $cParams   = [];
        if ($statusFilter !== 'all') {
            if ($useNormalizedInquiries) {
                $countSql .= " AND s.status_name = :status";
            } else {
                $countSql .= " AND i.status = :status";
            }
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

        if ($useNormalizedInquiries) {
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
        } else {
            $stmt = $db->prepare("
                INSERT INTO inquiries (full_name, email, subject, message, date_submitted, status)
                VALUES (:name, :email, :subject, :message, NOW(), 'unread')
            ");
            $stmt->execute([
                ':name'    => $fullName,
                ':email'   => $email,
                ':subject' => $subject,
                ':message' => $message,
            ]);
        }

        echo json_encode(['success' => true, 'message' => 'Inquiry submitted successfully']);
        break;

    case 'PATCH':
        $user = verifyToken();
        $input     = json_decode(file_get_contents('php://input'), true);
        $id        = isset($input['id']) ? (int)$input['id'] : (int)($_GET['id'] ?? 0);
        $statusName = $input['status'] ?? '';

        if (!$id || !$statusName) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing id or status']);
            exit;
        }

        if ($useNormalizedInquiries) {
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
        } else {
            $stmt = $db->prepare("UPDATE inquiries SET status = :status WHERE id = :id");
            $stmt->execute([':status' => $statusName, ':id' => $id]);
        }
        echo json_encode(['success' => true, 'message' => 'Status updated']);
        break;

    case 'DELETE':
        $user = verifyToken();
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing inquiry id']);
            exit;
        }
        $stmt = $db->prepare("DELETE FROM inquiries WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(['success' => true, 'message' => 'Inquiry deleted']);
        break;
}
?>
