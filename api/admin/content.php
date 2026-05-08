<?php
require_once 'config.php';
require_once 'auth.php';

// Public GET access for specific actions if needed, but mostly admin
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    $user = verifyToken();
    if (in_array($user->role, ['viewer'])) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Forbidden']);
        exit;
    }
}

// Auto-migration check: Ensure columns exist
try {
    // Check image_url
    $stmt = $db->query("SHOW COLUMNS FROM content_pages LIKE 'image_url'");
    if (!$stmt->fetch()) {
        $db->exec("ALTER TABLE content_pages ADD COLUMN image_url VARCHAR(500) AFTER category");
    }
    // Check description
    $stmt = $db->query("SHOW COLUMNS FROM content_pages LIKE 'description'");
    if (!$stmt->fetch()) {
        $db->exec("ALTER TABLE content_pages ADD COLUMN description TEXT AFTER image_url");
    }
} catch (Exception $e) {
    // Silence migration errors here, they will be caught later if queries fail
}

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            // Get single page with sections
            $id = (int)$_GET['id'];
            $stmt = $db->prepare("SELECT * FROM content_pages WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $page = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($page) {
                $stmt = $db->prepare("SELECT * FROM content_sections WHERE page_id = :page_id ORDER BY sort_order ASC");
                $stmt->execute([':page_id' => $id]);
                $sections = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                // Decode JSON data for sections
                foreach ($sections as &$section) {
                    $section['data'] = json_decode($section['data'], true);
                }
                
                $page['sections'] = $sections;
                echo json_encode(['success' => true, 'data' => $page]);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Page not found']);
            }
        } elseif (isset($_GET['slug'])) {
            // Get single page by slug (for public site)
            $slug = $_GET['slug'];
            $stmt = $db->prepare("SELECT * FROM content_pages WHERE slug = :slug AND status = 'published'");
            $stmt->execute([':slug' => $slug]);
            $page = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($page) {
                $stmt = $db->prepare("SELECT * FROM content_sections WHERE page_id = :page_id ORDER BY sort_order ASC");
                $stmt->execute([':page_id' => $page['id']]);
                $sections = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                foreach ($sections as &$section) {
                    $section['data'] = json_decode($section['data'], true);
                }
                
                $page['sections'] = $sections;
                echo json_encode(['success' => true, 'data' => $page]);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Page not found']);
            }
        } else {
            // List pages
            $category = $_GET['category'] ?? null;
            $query = "SELECT * FROM content_pages";
            $params = [];
            
            if ($category) {
                $query .= " WHERE category = :category";
                $params[':category'] = $category;
            }
            
            $query .= " ORDER BY created_at DESC";
            $stmt = $db->prepare($query);
            $stmt->execute($params);
            $pages = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'data' => $pages]);
        }
        break;

    case 'POST':
        try {
            // Handle both Page creation and Section updates
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (isset($input['action']) && $input['action'] === 'save_page') {
                $id = $input['id'] ?? null;
                $title = $input['title'] ?? '';
                $slug = $input['slug'] ?? '';
                $description = $input['description'] ?? '';
                $category = $input['category'] ?? 'tourist_spot';
                $status = $input['status'] ?? 'draft';
                $featured = $input['featured'] ?? false;
                $image_url = $input['image_url'] ?? null;

                if ($id) {
                    // Update
                    $stmt = $db->prepare("UPDATE content_pages SET title = :title, slug = :slug, description = :description, category = :category, image_url = :image_url, status = :status, featured = :featured WHERE id = :id");
                    $stmt->execute([
                        ':title' => $title,
                        ':slug' => $slug,
                        ':description' => $description,
                        ':category' => $category,
                        ':image_url' => $image_url,
                        ':status' => $status,
                        ':featured' => (int)$featured,
                        ':id' => $id
                    ]);
                    $pageId = $id;
                } else {
                    // Check if slug already exists
                    $check = $db->prepare("SELECT id FROM content_pages WHERE slug = :slug");
                    $check->execute([':slug' => $slug]);
                    if ($check->fetch()) {
                        http_response_code(400);
                        echo json_encode(['success' => false, 'message' => "Slug '$slug' is already in use. Please choose a different slug."]);
                        exit;
                    }

                    // Create
                    $stmt = $db->prepare("INSERT INTO content_pages (title, slug, description, category, image_url, status, featured) VALUES (:title, :slug, :description, :category, :image_url, :status, :featured)");
                    $stmt->execute([
                        ':title' => $title,
                        ':slug' => $slug,
                        ':description' => $description,
                        ':category' => $category,
                        ':image_url' => $image_url,
                        ':status' => $status,
                        ':featured' => (int)$featured
                    ]);
                    $pageId = $db->lastInsertId();
                }

                echo json_encode(['success' => true, 'id' => $pageId]);
            } elseif (isset($input['action']) && $input['action'] === 'save_sections') {
                $pageId = $input['page_id'] ?? null;
                $sections = $input['sections'] ?? [];

                if (!$pageId) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'Missing page_id']);
                    exit;
                }

                // Simple approach: Delete existing sections and re-insert
                $db->prepare("DELETE FROM content_sections WHERE page_id = :page_id")->execute([':page_id' => $pageId]);

                $stmt = $db->prepare("INSERT INTO content_sections (page_id, type, data, sort_order) VALUES (:page_id, :type, :data, :sort_order)");
                
                foreach ($sections as $index => $section) {
                    $stmt->execute([
                        ':page_id' => $pageId,
                        ':type' => $section['type'],
                        ':data' => json_encode($section['data']),
                        ':sort_order' => $index
                    ]);
                }

                echo json_encode(['success' => true, 'message' => 'Sections saved successfully']);
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Invalid action']);
            }
        } catch (Throwable $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Server Error: ' . $e->getMessage()]);
        }
        break;

    case 'DELETE':
        $id = (int)($_GET['id'] ?? 0);
        if ($id) {
            $stmt = $db->prepare("DELETE FROM content_pages WHERE id = :id");
            $stmt->execute([':id' => $id]);
            echo json_encode(['success' => true, 'message' => 'Page deleted successfully']);
        }
        break;
}
?>
