<?php
require_once 'config.php';
require_once 'auth.php';

$user = verifyToken();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Total Users
    $stmt = $db->query("SELECT COUNT(*) as total FROM users");
    $totalUsers = (int)$stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Total Content Pages
    $stmt = $db->query("SELECT COUNT(*) as total FROM content_pages");
    $totalPages = (int)$stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Total Inquiries
    $stmt = $db->query("SELECT COUNT(*) as total FROM inquiries");
    $totalInquiries = (int)$stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Detect schema at runtime for inquiries
    $inquiryColumns = [];
    $stmt = $db->query("SHOW COLUMNS FROM `inquiries`");
    if ($stmt) {
        foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $inquiryColumns[] = $row['Field'];
        }
    }
    $useNormalizedInquiries = in_array('status_id', $inquiryColumns);

    if ($useNormalizedInquiries) {
        // Normalized schema
        $stmt = $db->query("
            SELECT COUNT(*) as total
            FROM inquiries i
            JOIN inquiry_statuses s ON i.status_id = s.id
            WHERE s.status_name = 'unread'
        ");
    } else {
        // Flat schema
        $stmt = $db->query("
            SELECT COUNT(*) as total
            FROM inquiries
            WHERE status = 'unread'
        ");
    }
    $unreadInquiries = (int)$stmt->fetch(PDO::FETCH_ASSOC)['total'];

    echo json_encode([
        'success' => true,
        'data' => [
            'totalUsers'       => $totalUsers,
            'totalPages'       => $totalPages,
            'totalInquiries'   => $totalInquiries,
            'unreadInquiries'  => $unreadInquiries,
        ]
    ]);
}
?>
