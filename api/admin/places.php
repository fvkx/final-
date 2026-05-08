<?php
require_once 'config.php';
require_once 'auth.php';

$method = $_SERVER['REQUEST_METHOD'];

// Only verify token for non-GET requests
if ($method !== 'GET') {
    $user = verifyToken();
    
    // Only admin and editor can modify places
    if (in_array($user->role, ['viewer'])) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Forbidden']);
        exit;
    }
}

switch ($method) {
    case 'GET':
        $stmt = $db->query("SELECT * FROM places ORDER BY id DESC");
        $places = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $places]);
        break;

    case 'POST':
        $name = $_POST['name'] ?? '';
        $category = $_POST['category'] ?? '';
        $description = $_POST['description'] ?? '';
        $status = $_POST['status'] ?? 'active';
        $imageUrl = '';

        // Handle File Upload
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = '../../public/uploads/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }

            $fileName = time() . '_' . basename($_FILES['image']['name']);
            // Sanitize file name
            $fileName = preg_replace("/[^a-zA-Z0-9.\-_]/", "", $fileName);
            
            $targetPath = $uploadDir . $fileName;
            
            // Check file type
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mime = finfo_file($finfo, $_FILES['image']['tmp_name']);
            finfo_close($finfo);
            
            if (strpos($mime, 'image/') === 0) {
                if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
                    $imageUrl = '/uploads/' . $fileName; // Relative path for frontend
                }
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Invalid file type. Only images are allowed.']);
                exit;
            }
        }

        $stmt = $db->prepare("INSERT INTO places (name, category, description, image_url, status) VALUES (:name, :category, :description, :image_url, :status)");
        $stmt->execute([
            ':name' => $name,
            ':category' => $category,
            ':description' => $description,
            ':image_url' => $imageUrl,
            ':status' => $status
        ]);

        echo json_encode(['success' => true, 'message' => 'Place created successfully']);
        break;

    case 'DELETE':
        $id = (int)($_GET['id'] ?? 0);
        
        // Optional: delete image file from server
        $stmt = $db->prepare("SELECT image_url FROM places WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $place = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($place && $place['image_url']) {
            $filePath = '../../public' . $place['image_url'];
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        $stmt = $db->prepare("DELETE FROM places WHERE id = :id");
        $stmt->execute([':id' => $id]);
        
        echo json_encode(['success' => true, 'message' => 'Place deleted successfully']);
        break;
}
?>
