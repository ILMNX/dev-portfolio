// Project table schema for Turso database

export const createProjectsTable = `
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    year INTEGER NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    details TEXT,
    languages TEXT NOT NULL, -- Stored as JSON string
    image_url TEXT,
    github_link TEXT,
    live_link TEXT,
    selected INTEGER DEFAULT 0, -- 0: not selected, 1: selected for portfolio
    selected_order INTEGER DEFAULT 0, -- For ordering the selected projects
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

export const createAdminTable = `
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;