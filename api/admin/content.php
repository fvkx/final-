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

function tableExists($name)
{
    global $db;
    $stmt = $db->prepare("SHOW TABLES LIKE :name");
    $stmt->execute([':name' => $name]);
    return (bool)$stmt->fetchColumn();
}

function getTableColumns($table)
{
    global $db;
    $stmt = $db->query("SHOW COLUMNS FROM `$table`");
    if (!$stmt) {
        return [];
    }
    $columns = [];
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $columns[] = $row['Field'];
    }
    return $columns;
}

function normalizeCategorySlug($category)
{
    return str_replace('_', '-', trim($category));
}

function denormalizeCategorySlug($category)
{
    return str_replace('-', '_', trim($category));
}

function normalizeSectionTypeName($type)
{
    if ($type === 'rich_text') {
        return 'text';
    }
    return trim($type);
}

function denormalizeSectionTypeName($type)
{
    if ($type === 'text') {
        return 'rich_text';
    }
    return trim($type);
}

function getSingleValue($query, $params = [])
{
    global $db;
    $stmt = $db->prepare($query);
    $stmt->execute($params);
    return $stmt->fetchColumn();
}

$pagesColumns = getTableColumns('content_pages');
$sectionsColumns = getTableColumns('content_sections');

$hasCategoryTable = tableExists('categories');
$hasStatusTable = tableExists('content_statuses');
$hasSectionTypesTable = tableExists('section_types');

$useNormalizedPages = in_array('category_id', $pagesColumns) && in_array('status_id', $pagesColumns);
$useNormalizedSections = in_array('type_id', $sectionsColumns) && in_array('section_data', $sectionsColumns);

$pagesHasCategory = in_array('category', $pagesColumns);
$pagesHasStatus = in_array('status', $pagesColumns);
$pagesHasDescription = in_array('description', $pagesColumns);
$pagesHasImageUrl = in_array('image_url', $pagesColumns);
$pagesHasFeatured = in_array('featured', $pagesColumns);

$sectionsHasType = in_array('type', $sectionsColumns);
$sectionsHasData = in_array('data', $sectionsColumns);
$sectionsHasTypeId = in_array('type_id', $sectionsColumns);
$sectionsHasSectionData = in_array('section_data', $sectionsColumns);

function getCategoryId($category)
{
    global $db, $hasCategoryTable;
    if (!$hasCategoryTable) {
        return null;
    }

    $slug = normalizeCategorySlug($category);
    if ($slug === '') {
        return null;
    }

    $stmt = $db->prepare("SELECT id FROM categories WHERE slug = :slug");
    $stmt->execute([':slug' => $slug]);
    $id = $stmt->fetchColumn();

    if ($id) {
        return $id;
    }

    $name = ucwords(str_replace(['-', '_'], ' ', $slug));
    $stmt = $db->prepare("INSERT INTO categories (name, slug) VALUES (:name, :slug)");
    $stmt->execute([':name' => $name, ':slug' => $slug]);
    return $db->lastInsertId();
}

function getStatusId($status)
{
    global $db, $hasStatusTable;
    if (!$hasStatusTable) {
        return null;
    }

    $status = trim($status);
    $stmt = $db->prepare("SELECT id FROM content_statuses WHERE status_name = :status");
    $stmt->execute([':status' => $status]);
    $id = $stmt->fetchColumn();

    if ($id) {
        return $id;
    }

    $stmt = $db->prepare("INSERT INTO content_statuses (status_name) VALUES (:status)");
    $stmt->execute([':status' => $status]);
    return $db->lastInsertId();
}

function getSectionTypeId($type)
{
    global $db, $hasSectionTypesTable;
    if (!$hasSectionTypesTable) {
        return null;
    }

    $type = normalizeSectionTypeName($type);
    $stmt = $db->prepare("SELECT id FROM section_types WHERE type_name = :type");
    $stmt->execute([':type' => $type]);
    $id = $stmt->fetchColumn();

    if ($id) {
        return $id;
    }

    $stmt = $db->prepare("INSERT INTO section_types (type_name) VALUES (:type)");
    $stmt->execute([':type' => $type]);
    return $db->lastInsertId();
}

function getCategorySlugById($id)
{
    global $hasCategoryTable;
    if (!$hasCategoryTable || !$id) {
        return null;
    }
    return getSingleValue("SELECT slug FROM categories WHERE id = :id", [':id' => $id]);
}

function getStatusNameById($id)
{
    global $hasStatusTable;
    if (!$hasStatusTable || !$id) {
        return null;
    }
    return getSingleValue("SELECT status_name FROM content_statuses WHERE id = :id", [':id' => $id]);
}

function getSectionTypeNameById($id)
{
    global $hasSectionTypesTable;
    if (!$hasSectionTypesTable || !$id) {
        return null;
    }
    return getSingleValue("SELECT type_name FROM section_types WHERE id = :id", [':id' => $id]);
}

function annotatePage($page)
{
    global $useNormalizedPages;

    if (!$page) {
        return $page;
    }

    if ($useNormalizedPages) {
        if (isset($page['category_id']) && $page['category_id']) {
            $categorySlug = $page['category_slug'] ?? getCategorySlugById($page['category_id']);
            if ($categorySlug) {
                $page['category'] = str_replace('_', '-', $categorySlug);
            }
        }

        if (isset($page['status_id']) && $page['status_id']) {
            $statusName = $page['status_name'] ?? getStatusNameById($page['status_id']);
            if ($statusName) {
                $page['status'] = $statusName;
            }
        }
    } else {
        if (isset($page['category'])) {
            $page['category'] = str_replace('_', '-', $page['category']);
        }
    }

    if (!isset($page['description'])) {
        $page['description'] = '';
    }

    if (!isset($page['image_url'])) {
        $page['image_url'] = null;
    }

    $page['featured'] = isset($page['featured']) ? (bool)$page['featured'] : false;
    unset($page['category_slug'], $page['status_name']);
    return $page;
}

function annotateSection($section)
{
    global $useNormalizedSections;

    if ($useNormalizedSections) {
        if (isset($section['type_id']) && $section['type_id']) {
            $sectionType = getSectionTypeNameById($section['type_id']);
            if ($sectionType) {
                $section['type'] = denormalizeSectionTypeName($sectionType);
            }
        }

        if (isset($section['section_data'])) {
            $section['data'] = json_decode($section['section_data'], true);
        }
    } else {
        if (isset($section['data'])) {
            $section['data'] = json_decode($section['data'], true);
        }
    }

    if (!isset($section['data']) || $section['data'] === null) {
        $section['data'] = [];
    }

    return $section;
}

try {
    if (!in_array('image_url', $pagesColumns)) {
        $db->exec("ALTER TABLE content_pages ADD COLUMN image_url VARCHAR(500) AFTER category");
        $pagesColumns[] = 'image_url';
        $pagesHasImageUrl = true;
    }
    if (!in_array('description', $pagesColumns)) {
        $db->exec("ALTER TABLE content_pages ADD COLUMN description TEXT AFTER image_url");
        $pagesColumns[] = 'description';
        $pagesHasDescription = true;
    }
} catch (Exception $e) {
    // ignore migration failures and continue
}

switch ($method) {
    // ─── GET ─────────────────────────────────────────────────────────────────
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $db->prepare("SELECT cp.*"
                . ($useNormalizedPages && $hasCategoryTable ? ", c.slug AS category_slug" : "")
                . ($useNormalizedPages && $hasStatusTable ? ", s.status_name AS status_name" : "")
                . " FROM content_pages cp"
                . ($useNormalizedPages && $hasCategoryTable ? " LEFT JOIN categories c ON cp.category_id = c.id" : "")
                . ($useNormalizedPages && $hasStatusTable ? " LEFT JOIN content_statuses s ON cp.status_id = s.id" : "")
                . " WHERE cp.id = :id");
            $stmt->execute([':id' => (int)$_GET['id']]);
            $page = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($page) {
                $stmt = $db->prepare("SELECT * FROM content_sections WHERE page_id = :page_id ORDER BY sort_order ASC");
                $stmt->execute([':page_id' => $page['id']]);
                $sections = $stmt->fetchAll(PDO::FETCH_ASSOC);

                foreach ($sections as &$section) {
                    $section = annotateSection($section);
                }

                $page['sections'] = $sections;
                echo json_encode(['success' => true, 'data' => annotatePage($page)]);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Page not found']);
            }

        } elseif (isset($_GET['slug'])) {
            $slug = $_GET['slug'];
            $preview = isset($_GET['preview']) && $_GET['preview'] == '1';
            $statusClause = '';

            if (!$preview) {
                if ($useNormalizedPages && $hasStatusTable) {
                    $statusClause = " AND s.status_name = 'published'";
                } else {
                    $statusClause = " AND cp.status = 'published'";
                }
            }

            $stmt = $db->prepare("SELECT cp.*"
                . ($useNormalizedPages && $hasCategoryTable ? ", c.slug AS category_slug" : "")
                . ($useNormalizedPages && $hasStatusTable ? ", s.status_name AS status_name" : "")
                . " FROM content_pages cp"
                . ($useNormalizedPages && $hasCategoryTable ? " LEFT JOIN categories c ON cp.category_id = c.id" : "")
                . ($useNormalizedPages && $hasStatusTable ? " LEFT JOIN content_statuses s ON cp.status_id = s.id" : "")
                . " WHERE cp.slug = :slug" . $statusClause);
            $stmt->execute([':slug' => $slug]);
            $page = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($page) {
                $stmt = $db->prepare("SELECT * FROM content_sections WHERE page_id = :page_id ORDER BY sort_order ASC");
                $stmt->execute([':page_id' => $page['id']]);
                $sections = $stmt->fetchAll(PDO::FETCH_ASSOC);

                foreach ($sections as &$section) {
                    $section = annotateSection($section);
                }

                $page['sections'] = $sections;
                echo json_encode(['success' => true, 'data' => annotatePage($page)]);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Page not found']);
            }

        } else {
            $category = $_GET['category'] ?? null;
            $where = '';
            $params = [];

            if ($category) {
                $normalizedCategory = normalizeCategorySlug($category);
                if ($useNormalizedPages && $hasCategoryTable) {
                    $where = " WHERE c.slug = :category";
                    $params[':category'] = $normalizedCategory;
                } elseif ($pagesHasCategory) {
                    $where = " WHERE category = :category";
                    $params[':category'] = denormalizeCategorySlug($category);
                }
            }

            $stmt = $db->prepare("SELECT cp.*"
                . ($useNormalizedPages && $hasCategoryTable ? ", c.slug AS category_slug" : "")
                . ($useNormalizedPages && $hasStatusTable ? ", s.status_name AS status_name" : "")
                . " FROM content_pages cp"
                . ($useNormalizedPages && $hasCategoryTable ? " LEFT JOIN categories c ON cp.category_id = c.id" : "")
                . ($useNormalizedPages && $hasStatusTable ? " LEFT JOIN content_statuses s ON cp.status_id = s.id" : "")
                . $where
                . " ORDER BY cp.created_at DESC");
            $stmt->execute($params);

            $pages = [];
            foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $page) {
                $pages[] = annotatePage($page);
            }

            echo json_encode(['success' => true, 'data' => $pages]);
        }
        break;

    // ─── POST ────────────────────────────────────────────────────────────────
    case 'POST':
        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (isset($input['action']) && $input['action'] === 'save_page') {
                $id          = $input['id']          ?? null;
                $title       = $input['title']       ?? '';
                $slug        = $input['slug']        ?? '';
                $imageUrl    = $input['image_url']   ?? null;
                $description = $input['description'] ?? null;
                $featured    = (int)($input['featured'] ?? 0);
                $category    = $input['category']    ?? 'tourist-spot';
                $status      = $input['status']      ?? 'draft';

                if (!$title || !$slug) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'Title and slug are required']);
                    exit;
                }

                $normalizedCategory = normalizeCategorySlug($category);
                $categoryId = $useNormalizedPages ? getCategoryId($normalizedCategory) : null;
                $statusId = $useNormalizedPages ? getStatusId($status) : null;

                $fields = [
                    'title' => ':title',
                    'slug' => ':slug',
                    'featured' => ':featured'
                ];

                $bindings = [
                    ':title' => $title,
                    ':slug' => $slug,
                    ':featured' => (int)$featured
                ];

                if ($pagesHasDescription) {
                    $fields['description'] = ':description';
                    $bindings[':description'] = $description;
                }

                if ($pagesHasImageUrl) {
                    $fields['image_url'] = ':image_url';
                    $bindings[':image_url'] = $imageUrl;
                }

                if ($pagesHasCategory) {
                    $fields['category'] = ':category';
                    $bindings[':category'] = denormalizeCategorySlug($category);
                }

                if ($pagesHasStatus) {
                    $fields['status'] = ':status';
                    $bindings[':status'] = $status;
                }

                if ($useNormalizedPages && in_array('category_id', $pagesColumns)) {
                    $fields['category_id'] = ':category_id';
                    $bindings[':category_id'] = $categoryId;
                }

                if ($useNormalizedPages && in_array('status_id', $pagesColumns)) {
                    $fields['status_id'] = ':status_id';
                    $bindings[':status_id'] = $statusId;
                }

                if ($id) {
                    $setFragments = [];
                    foreach ($fields as $column => $placeholder) {
                        $setFragments[] = "$column = $placeholder";
                    }
                    $query = "UPDATE content_pages SET " . implode(', ', $setFragments) . " WHERE id = :id";
                    $bindings[':id'] = $id;
                    $stmt = $db->prepare($query);
                    $stmt->execute($bindings);
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

                    $columns = array_keys($fields);
                    $placeholders = array_values($fields);
                    $query = "INSERT INTO content_pages (" . implode(', ', $columns) . ") VALUES (" . implode(', ', $placeholders) . ")";
                    $stmt = $db->prepare($query);
                    $stmt->execute($bindings);
                    $pageId = $db->lastInsertId();
                }

                echo json_encode(['success' => true, 'id' => (int)$pageId]);

            } elseif (isset($input['action']) && $input['action'] === 'save_sections') {
                $pageId   = $input['page_id'] ?? null;
                $sections = $input['sections'] ?? [];

                if (!$pageId) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'Missing page_id']);
                    exit;
                }

                $db->prepare("DELETE FROM content_sections WHERE page_id = :page_id")->execute([':page_id' => $pageId]);

                $insertColumns = ['page_id'];
                $placeholders = [':page_id'];
                if ($sectionsHasTypeId) {
                    $insertColumns[] = 'type_id';
                    $placeholders[] = ':type_id';
                }
                if ($sectionsHasType) {
                    $insertColumns[] = 'type';
                    $placeholders[] = ':type';
                }
                if ($sectionsHasSectionData) {
                    $insertColumns[] = 'section_data';
                    $placeholders[] = ':section_data';
                }
                if ($sectionsHasData) {
                    $insertColumns[] = 'data';
                    $placeholders[] = ':data';
                }
                $insertColumns[] = 'sort_order';
                $placeholders[] = ':sort_order';

                $insertSql = "INSERT INTO content_sections (" . implode(', ', $insertColumns) . ") VALUES (" . implode(', ', $placeholders) . ")";
                $stmt = $db->prepare($insertSql);

                foreach ($sections as $index => $section) {
                    $bindings = [
                        ':page_id' => $pageId,
                        ':sort_order' => $index
                    ];

                    if ($sectionsHasTypeId) {
                        $bindings[':type_id'] = getSectionTypeId($section['type']);
                    }
                    if ($sectionsHasType) {
                        $bindings[':type'] = $section['type'];
                    }

                    $jsonData = json_encode($section['data']);
                    if ($sectionsHasSectionData) {
                        $bindings[':section_data'] = $jsonData;
                    }
                    if ($sectionsHasData) {
                        $bindings[':data'] = $jsonData;
                    }

                    $stmt->execute($bindings);
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
