-- Finalized Database Schema (3NF)
DROP DATABASE IF EXISTS balingasag_cms;
CREATE DATABASE balingasag_cms;
USE balingasag_cms;

-- 1. Roles Table (Normalization of user roles)
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

INSERT IGNORE INTO roles (role_name) VALUES ('admin'), ('editor'), ('viewer');

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL
);

INSERT IGNORE INTO categories (name, slug) VALUES 
('Tourist Spot', 'tourist-spot'), 
('Culture & Heritage', 'culture'), 
('Events & Festivals', 'event'), 
('Travel Guide', 'travel-guide');

-- 4. Content Statuses
CREATE TABLE IF NOT EXISTS content_statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(50) UNIQUE NOT NULL
);

INSERT IGNORE INTO content_statuses (status_name) VALUES ('draft'), ('published'), ('archived');

-- 5. Content Pages
CREATE TABLE IF NOT EXISTS content_pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    category_id INT NOT NULL,
    image_url VARCHAR(500),
    description TEXT,
    featured BOOLEAN DEFAULT FALSE,
    status_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (status_id) REFERENCES content_statuses(id)
);

-- 6. Section Types
CREATE TABLE IF NOT EXISTS section_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(50) UNIQUE NOT NULL
);

INSERT IGNORE INTO section_types (type_name) VALUES ('banner'), ('rich_text'), ('gallery'), ('facts'), ('map');

-- 7. Content Sections
CREATE TABLE IF NOT EXISTS content_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_id INT NOT NULL,
    type_id INT NOT NULL,
    section_data JSON NOT NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (page_id) REFERENCES content_pages(id) ON DELETE CASCADE,
    FOREIGN KEY (type_id) REFERENCES section_types(id)
);

-- 8. Inquiry Statuses
CREATE TABLE IF NOT EXISTS inquiry_statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(50) UNIQUE NOT NULL
);

INSERT IGNORE INTO inquiry_statuses (status_name) VALUES ('unread'), ('read'), ('replied');

-- 9. Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_id INT NOT NULL,
    FOREIGN KEY (status_id) REFERENCES inquiry_statuses(id)
);

-- Default Admin (password: admin123)
-- Hash generated via: php -r "echo password_hash('admin123', PASSWORD_BCRYPT);"
INSERT IGNORE INTO users (username, email, password_hash, role_id) 
SELECT 'admin', 'admin@balingasag.gov.ph', '$2y$12$W1VC.sZBbJupt4FVbdMZM.Zu7kegQqr8DGOiW6vlsHQIviuWPb/dG', id 
FROM roles WHERE role_name = 'admin';

-- Default Editor (password: editor123)
INSERT IGNORE INTO users (username, email, password_hash, role_id) 
SELECT 'editor', 'editor@balingasag.gov.ph', '$2y$12$fxUjHbjCPB0Mo8zIZGFdTON223rUSFEu8zB4lPMmcStR5CB3NIfcS', id 
FROM roles WHERE role_name = 'editor';
