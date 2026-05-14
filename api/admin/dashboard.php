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

    // Unread Inquiries — join to inquiry_statuses to find the 'unread' status id
    $stmt = $db->query("
        SELECT COUNT(*) as total
        FROM inquiries i
        JOIN inquiry_statuses s ON i.status_id = s.id
        WHERE s.status_name = 'unread'
    ");
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
