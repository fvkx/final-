<?php
// middleware/headers.php

/**
 * Reusable Security Headers
 */
function setSecurityHeaders() {
    // Prevent Cross-Site Scripting (XSS)
    header("X-XSS-Protection: 1; mode=block");
    
    // Prevent clickjacking
    header("X-Frame-Options: DENY");
    
    // Prevent MIME-type sniffing
    header("X-Content-Type-Options: nosniff");
    
    // Content Security Policy (Basic)
    header("Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none';");
    
    // Referrer Policy
    header("Referrer-Policy: strict-origin-when-cross-origin");
    
    // Strict Transport Security (HSTS) - Use in production with HTTPS
    // header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");

    // CORS Headers (Adjust for production)
    header("Access-Control-Allow-Origin: *"); 
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PATCH, DELETE");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    // Handle preflight OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit();
    }
}
?>
