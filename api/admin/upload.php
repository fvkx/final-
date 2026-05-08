<?php
require_once 'config.php';
require_once 'auth.php';

$user = verifyToken();
if (in_array($user->role, ['viewer'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Forbidden']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $uploadDir = '../../public/uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $fileName = time() . '_' . basename($_FILES['file']['name']);
    $fileName = preg_replace("/[^a-zA-Z0-9.\-_]/", "", $fileName);
    $targetPath = $uploadDir . $fileName;

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $_FILES['file']['tmp_name']);
    finfo_close($finfo);

    if (strpos($mime, 'image/') === 0) {
        if (move_uploaded_file($_FILES['file']['tmp_name'], $targetPath)) {
            $url = '/uploads/' . $fileName;
            echo json_encode(['success' => true, 'url' => $url]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to move uploaded file.']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid file type. Only images are allowed.']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No file uploaded or invalid request.']);
}
?>
