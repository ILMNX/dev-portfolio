import { turso } from './turso';
import { createProjectsTable, createAdminTable } from './schema';
import bcrypt from 'bcryptjs';

export async function initializeDatabase() {
  try {
    // Create tables if they don't exist
    await turso.execute(createProjectsTable);
    await turso.execute(createAdminTable);
    
    // Check if there's at least one admin user
    const adminResult = await turso.execute("SELECT COUNT(*) as count FROM admins");
    const adminCount = adminResult.rows[0].count;
    
    // Create default admin if none exists
    if (adminCount === 0) {
      const passwordHash = await bcrypt.hash('password123', 10);
      await turso.execute({
        sql: "INSERT INTO admins (username, password_hash) VALUES (?, ?)",
        args: ['admin', passwordHash]
      });
      console.log('Default admin user created');
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}