-- database/schema.sql

CREATE DATABASE little_dream;

\c little_dream;

-- Users (Admin)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Activities / Projects
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Events
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(200),
  event_date TIMESTAMP NOT NULL,
  image_url VARCHAR(500),
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Donations
CREATE TABLE donations (
  id SERIAL PRIMARY KEY,
  donor_name VARCHAR(150),
  donor_email VARCHAR(150),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'XAF',
  message TEXT,
  payment_status VARCHAR(30) DEFAULT 'pending',
  payment_reference VARCHAR(200),
  payment_method VARCHAR(30) DEFAULT 'cash',
  phone_number VARCHAR(30),
  transaction_id VARCHAR(200),
  operator VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Volunteers
CREATE TABLE volunteers (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(30),
  city VARCHAR(100),
  motivation TEXT,
  skills TEXT,
  availability VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Contact Messages
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  subject VARCHAR(200),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Gallery
CREATE TABLE gallery (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200),
  image_url VARCHAR(500) NOT NULL,
  category VARCHAR(100),
  activity_id INT REFERENCES activities(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Statistics (for homepage counters)
CREATE TABLE stats (
  id SERIAL PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  value INT NOT NULL DEFAULT 0,
  icon VARCHAR(50),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Team Members
CREATE TABLE team_members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  position VARCHAR(150) NOT NULL,
  bio TEXT,
  image_url VARCHAR(500),
  email VARCHAR(150),
  linkedin_url VARCHAR(500),
  twitter_url VARCHAR(500),
  facebook_url VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
