CREATE DATABASE IF NOT EXISTS balingasag_cms;
USE balingasag_cms;

-- Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  date_submitted DATETIME NOT NULL,
  status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
  INDEX idx_status (status),
  INDEX idx_date (date_submitted)
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
  created_at DATETIME NOT NULL,
  INDEX idx_role (role)
);

-- Places Table
CREATE TABLE IF NOT EXISTS places (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  status ENUM('active', 'inactive') DEFAULT 'active',
  INDEX idx_category (category),
  INDEX idx_status (status)
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL
);

-- Insert default admin user (password: admin123)
-- MD5 hash for demo purposes, or bcrypt in production.
-- Let's use bcrypt hash for 'admin123' -> $2y$10$w8u7tVbWq/B90A3v1A5y1.K/Y0Oa17S534Pq5sQoQjD68e219o6uK
INSERT INTO users (username, email, password_hash, role, created_at)
VALUES ('admin', 'admin@balingasag.gov.ph', '$2y$10$w8u7tVbWq/B90A3v1A5y1.K/Y0Oa17S534Pq5sQoQjD68e219o6uK', 'admin', NOW())
ON DUPLICATE KEY UPDATE username=username;

-- Insert default editor user (password: editor123)
-- bcrypt hash for 'editor123' -> $2y$10$QpZ.Tf9l08p.X363kO21sOp.56O2s7/S6S/r1U5a0p.QpZ.Tf9l08
INSERT INTO users (username, email, password_hash, role, created_at)
VALUES ('editor', 'editor@balingasag.gov.ph', '$2y$10$QpZ.Tf9l08p.X363kO21sOp.56O2s7/S6S/r1U5a0p.QpZ.Tf9l08', 'editor', NOW())
ON DUPLICATE KEY UPDATE username=username;
-- Modular Content Management
CREATE TABLE IF NOT EXISTS content_pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    category ENUM('tourist_spot', 'culture', 'event', 'travel_guide') NOT NULL,
    image_url VARCHAR(500),
    featured BOOLEAN DEFAULT FALSE,
    status ENUM('draft', 'published') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_id INT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'banner', 'text', 'gallery', 'facts', etc.
    data JSON NOT NULL, -- Stores text, image paths, layout options
    sort_order INT DEFAULT 0,
    FOREIGN KEY (page_id) REFERENCES content_pages(id) ON DELETE CASCADE
);
