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

    // Detect normalized content schema for drafts
    $contentColumns = [];
    $stmt = $db->query("SHOW COLUMNS FROM `content_pages`");
    if ($stmt) {
        foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $contentColumns[] = $row['Field'];
        }
    }
    $useNormalizedContent = in_array('status_id', $contentColumns) && in_array('category_id', $contentColumns);
    $hasStatusTable = $useNormalizedContent && $db->query("SHOW TABLES LIKE 'content_statuses'")->fetchColumn();
    $hasCategoryTable = $useNormalizedContent && $db->query("SHOW TABLES LIKE 'categories'")->fetchColumn();

    if ($useNormalizedContent && $hasStatusTable) {
        $stmt = $db->prepare("SELECT COUNT(*) as total FROM content_pages cp JOIN content_statuses s ON cp.status_id = s.id WHERE s.status_name = 'draft'");
    } else {
        $stmt = $db->prepare("SELECT COUNT(*) as total FROM content_pages WHERE status = 'draft'");
    }
    $stmt->execute();
    $draftCount = (int)$stmt->fetch(PDO::FETCH_ASSOC)['total'];

    $draftQuery = "SELECT cp.id, cp.title, cp.slug, cp.created_at, ";
    if ($useNormalizedContent && $hasCategoryTable) {
        $draftQuery .= "c.slug AS category, ";
    } else {
        $draftQuery .= "cp.category AS category, ";
    }
    if ($useNormalizedContent && $hasStatusTable) {
        $draftQuery .= "s.status_name AS status ";
    } else {
        $draftQuery .= "cp.status AS status ";
    }
    $draftQuery .= "FROM content_pages cp ";
    if ($useNormalizedContent && $hasCategoryTable) {
        $draftQuery .= "LEFT JOIN categories c ON cp.category_id = c.id ";
    }
    if ($useNormalizedContent && $hasStatusTable) {
        $draftQuery .= "LEFT JOIN content_statuses s ON cp.status_id = s.id ";
    }
    $draftQuery .= "WHERE " . ($useNormalizedContent && $hasStatusTable ? "s.status_name = 'draft'" : "cp.status = 'draft'") . " ORDER BY cp.created_at DESC LIMIT 6";
    $stmt = $db->prepare($draftQuery);
    $stmt->execute();
    $drafts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => [
            'totalUsers'       => $totalUsers,
            'totalPages'       => $totalPages,
            'totalInquiries'   => $totalInquiries,
            'unreadInquiries'  => $unreadInquiries,
            'draftCount'       => $draftCount,
            'drafts'           => $drafts,
        ]
    ]);
}
?>
