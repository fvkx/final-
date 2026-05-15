<?php
require_once 'config.php';
require_once 'auth.php';

$method = $_SERVER['REQUEST_METHOD'];

// Require auth for all non-GET methods; viewers cannot modify content
if ($method !== 'GET') {
    $user = verifyToken();
    if ($user->role === 'viewer') {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Forbidden']);
        exit;
    }
}

switch ($method) {
    // ─── GET ─────────────────────────────────────────────────────────────────
    case 'GET':
        if (isset($_GET['id'])) {
            // Single page with its sections
            $id   = (int)$_GET['id'];
            $stmt = $db->prepare("
                SELECT cp.id, cp.title, cp.slug, cp.image_url, cp.featured,
                       cp.created_at, cp.updated_at,
                       c.slug as category,
                       c.name as category_name,
                       cs.status_name as status
                FROM content_pages cp
                JOIN categories c        ON cp.category_id = c.id
                JOIN content_statuses cs ON cp.status_id   = cs.id
                WHERE cp.id = :id
            ");
            $stmt->execute([':id' => $id]);
            $page = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$page) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Page not found']);
                break;
            }

            $secStmt = $db->prepare("
                SELECT cs.id, cs.sort_order, cs.section_data as data,
                       st.type_name as type
                FROM content_sections cs
                JOIN section_types st ON cs.type_id = st.id
                WHERE cs.page_id = :page_id
                ORDER BY cs.sort_order ASC
            ");
            $secStmt->execute([':page_id' => $id]);
            $sections = $secStmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($sections as &$section) {
                $section['data'] = json_decode($section['data'], true);
            }
            $page['sections'] = $sections;
            echo json_encode(['success' => true, 'data' => $page]);

        } elseif (isset($_GET['slug'])) {
            // Public: single published page by slug
            $slug = $_GET['slug'];
            $stmt = $db->prepare("
                SELECT cp.id, cp.title, cp.slug, cp.image_url, cp.featured,
                       cp.created_at, cp.updated_at,
                       c.slug as category,
                       c.name as category_name,
                       cs.status_name as status
                FROM content_pages cp
                JOIN categories c        ON cp.category_id = c.id
                JOIN content_statuses cs ON cp.status_id   = cs.id
                WHERE cp.slug = :slug AND cs.status_name = 'published'
            ");
            $stmt->execute([':slug' => $slug]);
            $page = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$page) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Page not found']);
                break;
            }

            $secStmt = $db->prepare("
                SELECT cs.id, cs.sort_order, cs.section_data as data,
                       st.type_name as type
                FROM content_sections cs
                JOIN section_types st ON cs.type_id = st.id
                WHERE cs.page_id = :page_id
                ORDER BY cs.sort_order ASC
            ");
            $secStmt->execute([':page_id' => $page['id']]);
            $sections = $secStmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($sections as &$section) {
                $section['data'] = json_decode($section['data'], true);
            }
            $page['sections'] = $sections;
            echo json_encode(['success' => true, 'data' => $page]);

        } else {
            // List all pages (optionally filtered by category slug)
            $categorySlug = $_GET['category'] ?? null;
            $sql = "
                SELECT cp.id, cp.title, cp.slug, cp.image_url, cp.featured,
                       cp.created_at, cp.updated_at,
                       c.name as category, c.slug as category_slug,
                       cs.status_name as status
                FROM content_pages cp
                JOIN categories c        ON cp.category_id = c.id
                JOIN content_statuses cs ON cp.status_id   = cs.id
            ";
            $params = [];
            if ($categorySlug) {
                $sql .= " WHERE c.slug = :category_slug";
                $params[':category_slug'] = $categorySlug;
            }
            $sql .= " ORDER BY cp.created_at DESC";
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $pages = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'data' => $pages]);
        }
        break;

    // ─── POST ────────────────────────────────────────────────────────────────
    case 'POST':
        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (isset($input['action']) && $input['action'] === 'save_page') {
                $id        = $input['id']        ?? null;
                $title     = $input['title']     ?? '';
                $slug      = $input['slug']      ?? '';
                $imageUrl  = $input['image_url'] ?? null;
                $featured  = (int)($input['featured'] ?? 0);
                $catSlug   = $input['category']  ?? 'tourist-spot';
                $statusName = $input['status']   ?? 'draft';

                if (!$title || !$slug) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'Title and slug are required']);
                    exit;
                }

                // Resolve category_id
                $catStmt = $db->prepare("SELECT id FROM categories WHERE slug = :slug");
                $catStmt->execute([':slug' => $catSlug]);
                $cat = $catStmt->fetch(PDO::FETCH_ASSOC);
                if (!$cat) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => "Unknown category: $catSlug"]);
                    exit;
                }

                // Resolve status_id
                $statStmt = $db->prepare("SELECT id FROM content_statuses WHERE status_name = :name");
                $statStmt->execute([':name' => $statusName]);
                $stat = $statStmt->fetch(PDO::FETCH_ASSOC);
                if (!$stat) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => "Unknown status: $statusName"]);
                    exit;
                }

                if ($id) {
                    // Update existing page
                    $stmt = $db->prepare("
                        UPDATE content_pages
                        SET title = :title, slug = :slug, image_url = :image_url,
                            featured = :featured, category_id = :category_id, status_id = :status_id
                        WHERE id = :id
                    ");
                    $stmt->execute([
                        ':title'       => $title,
                        ':slug'        => $slug,
                        ':image_url'   => $imageUrl,
                        ':featured'    => $featured,
                        ':category_id' => $cat['id'],
                        ':status_id'   => $stat['id'],
                        ':id'          => $id,
                    ]);
                    $pageId = $id;
                } else {
                    // Check for duplicate slug
                    $check = $db->prepare("SELECT id FROM content_pages WHERE slug = :slug");
                    $check->execute([':slug' => $slug]);
                    if ($check->fetch()) {
                        http_response_code(400);
                        echo json_encode(['success' => false, 'message' => "Slug '$slug' is already in use."]);
                        exit;
                    }

                    $stmt = $db->prepare("
                        INSERT INTO content_pages (title, slug, image_url, featured, category_id, status_id)
                        VALUES (:title, :slug, :image_url, :featured, :category_id, :status_id)
                    ");
                    $stmt->execute([
                        ':title'       => $title,
                        ':slug'        => $slug,
                        ':image_url'   => $imageUrl,
                        ':featured'    => $featured,
                        ':category_id' => $cat['id'],
                        ':status_id'   => $stat['id'],
                    ]);
                    $pageId = $db->lastInsertId();
                }

                echo json_encode(['success' => true, 'id' => $pageId]);

            } elseif (isset($input['action']) && $input['action'] === 'save_sections') {
                $pageId   = $input['page_id'] ?? null;
                $sections = $input['sections'] ?? [];

                if (!$pageId) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'Missing page_id']);
                    exit;
                }

                // Delete existing sections and re-insert
                $db->prepare("DELETE FROM content_sections WHERE page_id = :page_id")
                   ->execute([':page_id' => $pageId]);

                $stmt = $db->prepare("
                    INSERT INTO content_sections (page_id, type_id, section_data, sort_order)
                    VALUES (:page_id, :type_id, :section_data, :sort_order)
                ");

                foreach ($sections as $index => $section) {
                    // Resolve type_id from section_types
                    $typeStmt = $db->prepare("SELECT id FROM section_types WHERE type_name = :name");
                    $typeStmt->execute([':name' => $section['type']]);
                    $typeRow = $typeStmt->fetch(PDO::FETCH_ASSOC);

                    if (!$typeRow) {
                        // Skip unknown section types gracefully
                        continue;
                    }

                    $stmt->execute([
                        ':page_id'      => $pageId,
                        ':type_id'      => $typeRow['id'],
                        ':section_data' => json_encode($section['data']),
                        ':sort_order'   => $index,
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

    // ─── DELETE ──────────────────────────────────────────────────────────────
    case 'DELETE':
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing page id']);
            break;
        }
        $stmt = $db->prepare("DELETE FROM content_pages WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(['success' => true, 'message' => 'Page deleted successfully']);
        break;
}
?>
