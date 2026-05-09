# System Architecture & Security Documentation

## 1. Architecture (Big Picture)

The system is built on a modern, decoupled architecture separating the presentation layer from the data layer. 

*   **Frontend (React / HTML/JS):** A React application (built with Vite) serves as the client. It handles the User Interface, state management, and routing. It operates independently of the backend server.
*   **Backend (PHP API):** A lightweight, native PHP backend serves as a RESTful API. It contains no presentation logic (no HTML rendering) and strictly acts as a data provider and processor.
*   **Database (MySQL):** A relational database storing all persistent data, structured strictly following normalization principles.
*   **Communication (JSON over HTTP):** The frontend and backend communicate exclusively via HTTP requests (GET, POST, PATCH, DELETE) transmitting JSON payloads. This decoupled approach ensures flexibility, allowing the API to serve multiple clients (e.g., a mobile app in the future) without modification.

---

## 2. API Structure

The backend is organized modularly to separate concerns, making the codebase clean, maintainable, and reusable:

```text
project/
│
├── config/
│   └── database.php       # Database connection logic and PDO configuration
│
├── api/
│   ├── register.php       # API endpoint for user registration
│   ├── login.php          # API endpoint for user authentication
│   └── getUsers.php       # API endpoint for retrieving user data
│
├── middleware/
│   └── headers.php        # Reusable security and CORS headers applied to all endpoints
│
└── schema_final.sql       # Finalized 3NF database schema
```

*   **`config/`**: Centralizes database credentials and connection parameters.
*   **`api/`**: Contains the actual endpoints the frontend communicates with. Each file represents a specific action or resource.
*   **`middleware/`**: Contains scripts that run before the main API logic, such as setting HTTP headers to secure the application.

---

## 3. Database & Schema Summary

The database is designed following **3NF (Third Normal Form)** to eliminate data redundancy and ensure data integrity.

*   **Tables:** 
    *   *Core*: `users`, `content_pages`, `inquiries`
    *   *Lookup/Reference*: `roles`, `categories`, `content_statuses`, `section_types`, `inquiry_statuses`
    *   *Relational*: `content_sections`
*   **Normalization (3NF):** We extracted repetitive ENUM values (like roles, categories, and statuses) into their own dedicated lookup tables. The main tables reference these via IDs. This prevents anomalies (e.g., updating a category name only requires changing one row in the `categories` table, not hundreds in the `content_pages` table).
*   **Relationships & Constraints:**
    *   **Primary Keys (PK):** Every table has an auto-incrementing `id` as its primary key.
    *   **Foreign Keys (FK):** Strict relationships are enforced (e.g., `users.role_id` references `roles.id`). We use `ON DELETE CASCADE` where appropriate (e.g., deleting a page deletes its sections).
    *   **UNIQUE Constraints:** Applied to fields like `username`, `email`, and `slug` to prevent duplicate data at the database level.

---

## 4. Security Strategy

Security is implemented using a "Defense in Depth" approach, securing multiple layers of the application.

*   **SQL Injection (SQLi) Protection:** All database interactions are routed through PHP Data Objects (PDO) using **Prepared Statements**. Furthermore, emulated prepares are explicitly disabled (`PDO::ATTR_EMULATE_PREPARES = false`), forcing the database engine itself to compile the SQL query and parameters separately. User input is never concatenated directly into SQL strings.
*   **XSS & Content Sniffing Prevention:** 
    *   The API explicitly declares `Content-Type: application/json`, preventing browsers from attempting to execute JSON responses as HTML or JavaScript.
    *   Input is sanitized using `htmlspecialchars()` and `strip_tags()` before database insertion.
    *   `X-Content-Type-Options: nosniff` header is enforced.
*   **Password Security:** Plain text passwords are never stored. Passwords are hashed using the robust `password_hash()` function with the `PASSWORD_BCRYPT` algorithm. Verification is handled securely via `password_verify()`.
*   **Secure Headers:** Implemented via middleware to protect against various attack vectors:
    *   `X-Frame-Options: DENY` (Prevents Clickjacking).
    *   `Content-Security-Policy` (Restricts resource loading origins).
    *   `Strict-Transport-Security` (HSTS - forces HTTPS in production).

---

## 5. Core Code Snippets

### Secure DB connection (PDO)
```php
// config/database.php
$this->conn = new PDO(
    "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
    $this->username, $this->password
);
// Throw exceptions on errors
$this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
// Disable emulated prepares for strict SQLi protection
$this->conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
```

### Security Headers Middleware
```php
// middleware/headers.php
header("X-XSS-Protection: 1; mode=block");
header("X-Frame-Options: DENY");
header("X-Content-Type-Options: nosniff");
header("Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none';");
header("Referrer-Policy: strict-origin-when-cross-origin");
```

### JSON Input Handling
```php
// Reading JSON from the HTTP request body
$data = json_decode(file_get_contents("php://input"));
$username = $data->username;
```

### Example API Endpoint (Login Logic)
```php
// api/login.php
$query = "SELECT u.id, u.username, u.password_hash, r.role_name 
          FROM users u JOIN roles r ON u.role_id = r.id
          WHERE u.username = :username LIMIT 1";

$stmt = $db->prepare($query);
$stmt->bindParam(":username", $data->username);
$stmt->execute();

if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    // Secure password verification
    if (password_verify($data->password, $row['password_hash'])) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Login successful."]);
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Invalid credentials."]);
    }
}
```

---

## 6. Data Flow Explanation (End-to-End)

Here is the lifecycle of a typical request (e.g., User Login):

1.  **Frontend Action:** The user fills out the login form and clicks "Submit" in the React frontend.
2.  **Request Dispatch:** JavaScript intercepts the form submission and sends an HTTP POST request to `http://localhost/new/api/login.php`. The request body contains a JSON payload: `{"username":"admin", "password":"password123"}`.
3.  **Middleware Execution:** The PHP backend receives the request. `api/login.php` executes `setSecurityHeaders()` from the middleware to attach CORS and security headers to the upcoming response.
4.  **Input Parsing:** PHP reads the raw input stream (`php://input`) and uses `json_decode()` to convert the JSON payload into a PHP object.
5.  **Database Interaction:** PHP connects to MySQL via PDO. A prepared statement is constructed. The provided username is bound to the statement parameter, ensuring it is treated purely as data, not executable code. The query is executed.
6.  **Logic & Verification:** The database returns the matching user record (including the bcrypt hash). PHP uses `password_verify()` to compare the provided plain-text password against the hash.
7.  **Response Generation:** Based on the verification result, PHP sets the appropriate HTTP status code (200 OK or 401 Unauthorized) and `echo`s a JSON response string.
8.  **Frontend Handling:** The React application receives the JSON response, parses it, and updates the UI accordingly (e.g., redirecting to the dashboard or displaying an error message).

---

## 7. CORS Explanation (Cross-Origin Resource Sharing)

*   **Why CORS is needed:** Web browsers enforce the "Same-Origin Policy" for security, preventing a script loaded from one origin (e.g., `http://localhost:5173` - the Vite dev server) from interacting with a resource from another origin (e.g., `http://localhost` - the Apache PHP server). CORS is a mechanism that allows servers to explicitly tell the browser to relax this restriction.
*   **Restricting Origins:** In our `headers.php`, the header `Access-Control-Allow-Origin: *` currently allows requests from any domain (useful for development). In production, this must be restricted to the specific frontend domain: `header("Access-Control-Allow-Origin: https://www.balingasag.gov.ph");`.
*   **Allowed Methods & Preflight:** We define `Access-Control-Allow-Methods: GET, POST, OPTIONS, PATCH, DELETE`. When the frontend makes complex requests (like sending JSON with custom headers), the browser automatically sends a pre-flight `OPTIONS` request first to verify the server permits it. Our middleware actively intercepts `OPTIONS` requests and responds with a `204 No Content` to approve the connection before the actual POST/GET request is processed.

---

## 8. Conclusion / Summary

The implemented architecture provides a highly modular, decoupled, and secure foundation for the CMS. By enforcing 3NF in the database, utilizing PDO for secure data access, organizing code into logical tiers (config, middleware, api), and implementing strict HTTP security headers, the system is fundamentally protected against common web vulnerabilities (SQLi, XSS, Clickjacking). This design is highly scalable, maintainable, and thoroughly ready for production-style deployment.
