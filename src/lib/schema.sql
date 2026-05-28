-- 1. Category Table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT,
  slug VARCHAR(100) NOT NULL,
  name VARCHAR(150) NOT NULL,
  image TEXT NOT NULL,
  banner TEXT NULL,
  blurb TEXT NULL,
  is_featured INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Product Table
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  name VARCHAR(200) NOT NULL,
  category_slug VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  old_price DECIMAL(10,2) NULL,
  rating DECIMAL(2,1) DEFAULT 5.0,
  reviews INT DEFAULT 0,
  image TEXT NOT NULL,
  gallery TEXT NULL,             -- JSON string array of image URLs
  description TEXT NULL,
  details TEXT NULL,             -- JSON string array of bullet points
  specs TEXT NULL,               -- JSON string array of specification objects
  shipping_info TEXT NULL,
  return_policy TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY (slug),
  FOREIGN KEY (category_slug) REFERENCES categories(slug) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Hero Slider Media Table
CREATE TABLE IF NOT EXISTS media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image TEXT NOT NULL,
  heading VARCHAR(250) NULL,
  sub TEXT NULL,
  label VARCHAR(100) NULL,
  slug VARCHAR(100) NULL,
  display_order INT DEFAULT 0,
  show_overlay TINYINT(1) DEFAULT 1,
  show_button TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Unique IP Visitor Logs Table
CREATE TABLE IF NOT EXISTS visitors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ip_address VARCHAR(50) NOT NULL,
  visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX ip_idx (ip_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Customer & Purchases Table
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  items TEXT NULL,               -- JSON string representing purchase items
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Settings Table (For WhatsApp redirection number, etc.)
CREATE TABLE IF NOT EXISTS settings (
  setting_key VARCHAR(100) NOT NULL,
  setting_value TEXT NULL,
  PRIMARY KEY (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
