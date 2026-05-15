<?php
/**
 * places.php — proxy to content_pages for tourist spot entries.
 * The normalized schema uses content_pages + categories instead of a
 * separate 'places' table, so this endpoint wraps those tables.
 */
require_once 'config.php';
require_once 'auth.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    $user = verifyToken();
    if ($user->role === 'viewer') {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Forbidden']);
        exit;
    }
}

// Resolve 'tourist-spot' category id once
function getTouristSpotCategoryId($db) {
    $stmt = $db->prepare("SELECT id FROM categories WHERE slug = 'tourist-spot'");
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row ? (int)$row['id'] : null;
}

switch ($method) {
    case 'GET':
        $catId = getTouristSpotCategoryId($db);
        if (!$catId) {
            echo json_encode(['success' => true, 'data' => []]);
            break;
        }
        $stmt = $db->prepare("
            SELECT cp.id, cp.title as name, cp.slug, cp.image_url,
                   cp.featured, cp.created_at,
                   cs.status_name as status,
                   c.name as category
            FROM content_pages cp
            JOIN content_statuses cs ON cp.status_id   = cs.id
            JOIN categories c        ON cp.category_id = c.id
            WHERE cp.category_id = :category_id
            ORDER BY cp.id DESC
        ");
        $stmt->execute([':category_id' => $catId]);
        $places = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $places]);
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        // Accept either JSON body or $_POST (for backward compatibility with FormData)
        $name   = htmlspecialchars(($input['name']   ?? $_POST['name']   ?? ''), ENT_QUOTES, 'UTF-8');
        $status = $input['status'] ?? $_POST['status'] ?? 'draft';
        $slug   = $input['slug']   ?? $_POST['slug']   ?? strtolower(str_replace(' ', '-', preg_replace('/[^a-zA-Z0-9 ]/', '', $name)));

        if (!$name) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Name is required']);
            exit;
        }

        $catId = getTouristSpotCategoryId($db);
        if (!$catId) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Tourist-spot category not found in DB']);
            exit;
        }

        // Resolve status_id
        $statStmt = $db->prepare("SELECT id FROM content_statuses WHERE status_name = :name");
        $statStmt->execute([':name' => in_array($status, ['published','draft','archived']) ? $status : 'draft']);
        $stat = $statStmt->fetch(PDO::FETCH_ASSOC);

        // Handle optional image upload
        $imageUrl = null;
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = '../../public/uploads/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
            $fileName = preg_replace('/[^a-zA-Z0-9.\-_]/', '', time() . '_' . basename($_FILES['image']['name']));
            $targetPath = $uploadDir . $fileName;
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mime  = finfo_file($finfo, $_FILES['image']['tmp_name']);
            finfo_close($finfo);
            if (strpos($mime, 'image/') === 0) {
                if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
                    $imageUrl = '/uploads/' . $fileName;
                }
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Invalid file type']);
                exit;
            }
        }

        try {
            // Ensure unique slug
            $base = $slug; $i = 1;
            while (true) {
                $chk = $db->prepare("SELECT id FROM content_pages WHERE slug = :slug");
                $chk->execute([':slug' => $slug]);
                if (!$chk->fetch()) break;
                $slug = $base . '-' . $i++;
            }

            $stmt = $db->prepare("
                INSERT INTO content_pages (title, slug, image_url, category_id, status_id)
                VALUES (:title, :slug, :image_url, :category_id, :status_id)
            ");
            $stmt->execute([
                ':title'       => $name,
                ':slug'        => $slug,
                ':image_url'   => $imageUrl,
                ':category_id' => $catId,
                ':status_id'   => $stat['id'],
            ]);
            echo json_encode(['success' => true, 'message' => 'Place created successfully']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'DB error: ' . $e->getMessage()]);
        }
        break;

    case 'DELETE':
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing id']);
            exit;
        }
        // Optionally remove image file
        $sel = $db->prepare("SELECT image_url FROM content_pages WHERE id = :id");
        $sel->execute([':id' => $id]);
        $row = $sel->fetch(PDO::FETCH_ASSOC);
        if ($row && $row['image_url']) {
            $filePath = '../../public' . $row['image_url'];
            if (file_exists($filePath)) unlink($filePath);
        }
        $stmt = $db->prepare("DELETE FROM content_pages WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(['success' => true, 'message' => 'Place deleted successfully']);
        break;
}
?>
