<?php
// middleware/headers.php

/**
 * Reusable Security Headers
 * 
 * This function encapsulates standard HTTP security headers that should be 
 * sent with every API response. This enforces secure communication standards
 * and mitigates common web vulnerabilities like XSS, Clickjacking, and MIME-sniffing.
 */
function setSecurityHeaders() {
    // Prevent Cross-Site Scripting (XSS) by instructing the browser to block 
    // the response if it detects an XSS attack.
    header("X-XSS-Protection: 1; mode=block");
    
    // Prevent clickjacking by restricting this API from being embedded in an iframe on other domains.
    header("X-Frame-Options: DENY");
    
    // Prevent MIME-type sniffing to ensure the browser strictly respects the provided Content-Type.
    header("X-Content-Type-Options: nosniff");
    
    // Content Security Policy restricts where resources (scripts, objects) can be loaded from.
    header("Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none';");
    
    // Referrer Policy prevents leaking sensitive URL parameters to other origins.
    header("Referrer-Policy: strict-origin-when-cross-origin");

    // Strict Transport Security (HSTS) - Use in production with HTTPS
    // header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");

    // CORS (Cross-Origin Resource Sharing) Configuration
    // Essential for decoupled architectures (e.g., React frontend + PHP backend)
    header("Access-Control-Allow-Origin: *"); // Adjust to specific origin in production
    
    // Define the expected content type for API communication
    header("Content-Type: application/json; charset=UTF-8");
    
    // Restrict allowed HTTP methods to follow RESTful API standards
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PATCH, DELETE");
    
    // Cache the preflight response to improve performance
    header("Access-Control-Max-Age: 3600");
    
    // Explicitly allow specific headers to prevent CORS issues with custom frontend requests
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    // Handle preflight OPTIONS requests cleanly, which are automatically sent by browsers for CORS validation
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204); // No Content response
        exit();
    }
}
?>
