<?php
require_once 'config.php';

$SECRET_KEY = 'super_secret_balingasag_cms_key_123!';

function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
}

function generateToken($payload) {
    global $SECRET_KEY;
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload['exp'] = time() + (60 * 60 * 24); // 24 hours
    
    $base64UrlHeader = base64url_encode($header);
    $base64UrlPayload = base64url_encode(json_encode($payload));
    
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $SECRET_KEY, true);
    $base64UrlSignature = base64url_encode($signature);
    
    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

function verifyToken() {
    global $SECRET_KEY;
    $headers = apache_request_headers();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    
    if (empty($authHeader) && isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    }
    
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
        $tokenParts = explode('.', $token);
        if (count($tokenParts) != 3) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid token']);
            exit;
        }
        
        $header = base64url_decode($tokenParts[0]);
        $payload = base64url_decode($tokenParts[1]);
        $signature_provided = $tokenParts[2];
        
        $base64UrlHeader = base64url_encode($header);
        $base64UrlPayload = base64url_encode($payload);
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $SECRET_KEY, true);
        $base64UrlSignature = base64url_encode($signature);
        
        if ($base64UrlSignature === $signature_provided) {
            $payloadObj = json_decode($payload);
            if ($payloadObj->exp < time()) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Token expired']);
                exit;
            }
            return $payloadObj;
        }
    }
    
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

// Handle auth requests
if (basename($_SERVER['PHP_SELF']) == 'auth.php') {
    $method = $_SERVER['REQUEST_METHOD'];
    
    if ($method == 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (isset($input['action']) && $input['action'] == 'verify') {
            $payload = verifyToken();
            echo json_encode(['success' => true, 'user' => $payload]);
            exit;
        }
        
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';
        
        $stmt = $db->prepare("SELECT * FROM users WHERE username = :username");
        $stmt->execute([':username' => $username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password_hash'])) {
            $token = generateToken(['id' => $user['id'], 'username' => $user['username'], 'role' => $user['role']]);
            echo json_encode([
                'success' => true,
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'role' => $user['role']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        }
    }
}
?>
