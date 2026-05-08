<?php
require_once 'config.php';
require_once 'auth.php';

$user = verifyToken();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Total Users
    $stmt = $db->query("SELECT COUNT(*) as total FROM users");
    $totalUsers = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Total Pages (Modular Content)
    $stmt = $db->query("SELECT COUNT(*) as total FROM content_pages");
    $totalPages = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Total Inquiries
    $stmt = $db->query("SELECT COUNT(*) as total FROM inquiries");
    $totalInquiries = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Unread Inquiries
    $stmt = $db->query("SELECT COUNT(*) as total FROM inquiries WHERE status = 'unread'");
    $unreadInquiries = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    echo json_encode([
        'success' => true,
        'data' => [
            'totalUsers' => (int)$totalUsers,
            'totalPages' => (int)$totalPages,
            'totalInquiries' => (int)$totalInquiries,
            'unreadInquiries' => (int)$unreadInquiries
        ]
    ]);
}
?>
