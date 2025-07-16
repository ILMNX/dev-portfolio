import { turso } from './turso';
import { createProjectsTable, createAdminTable } from './schema';
import bcrypt from 'bcryptjs';

export async function initializeDatabase() {
  try {
    // Create tables if they don't exist
    await turso.execute(createProjectsTable);
    await turso.execute(createAdminTable);
    
    // Add new columns for selected projects if they don't exist
    try {
      // Check if the selected column exists
      const columnCheckResult = await turso.execute(`PRAGMA table_info(projects)`);
      
      // Use the Row type from Turso's return value
      // The type is generic and allows access to properties by name
      const columns = columnCheckResult.rows.map((row) => row.name as string);
      
      if (!columns.includes('selected')) {
        await turso.execute(`ALTER TABLE projects ADD COLUMN selected INTEGER DEFAULT 0`);
      }
      
      
      if (!columns.includes('selected_order')) {
        await turso.execute(`ALTER TABLE projects ADD COLUMN selected_order INTEGER DEFAULT 0`);
      }
    } catch (alterError) {
      console.error('Error updating table schema:', alterError);
    }
    
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
    }
    
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

// Fix project image data in the database
export async function fixProjectImages(): Promise<boolean> {
  try {
    
    // First, get all projects to check their image data
    const result = await turso.execute('SELECT id, title, image_url FROM projects');
    
    for (const row of result.rows) {
      const id = row.id;
      const imageUrl = row.image_url;
      
      console.log(`Processing project ${id}: ${row.title}`);
      
      let fixedImageUrl = imageUrl;
      
      // Case 1: No image data
      if (!imageUrl) {
        fixedImageUrl = '/proj1.png';
      }
      // Case 2: Image data is a JSON string with src property
      else if (typeof imageUrl === 'string' && (imageUrl.includes('"src"') || imageUrl.startsWith('{'))) {
        try {
          const parsed = JSON.parse(imageUrl);
          if (parsed && typeof parsed === 'object' && parsed.src) {
            if (typeof parsed.src === 'object') {
              // Case 2.1: Nested objects - extract from deepest level
              console.log(`Project ${id}: Nested object detected`, JSON.stringify(parsed));
              fixedImageUrl = '/proj1.png'; // Set default as fallback
              
              // Try to extract from nested src
              if (parsed.src.src && typeof parsed.src.src === 'string') {
                fixedImageUrl = parsed.src.src;
              }
            } else {
              // Case 2.2: Standard object with string src
              fixedImageUrl = parsed.src;
            }
          }
        } catch (e) {
          console.log(`Project ${id}: Failed to parse JSON`, e);
          // Keep original if parsing fails
        }
      }
      // Case 3: Image data might contain "[object Object]"
      else if (typeof imageUrl === 'string' && imageUrl.includes('[object Object]')) {
        console.log(`Project ${id}: Contains [object Object], fixing`);
        fixedImageUrl = '/proj1.png';
      }
      
      // Only update if we've changed something
      if (fixedImageUrl !== imageUrl) {
        console.log(`Project ${id}: Updating image from "${imageUrl}" to "${fixedImageUrl}"`);
        
        await turso.execute({
          sql: 'UPDATE projects SET image_url = ? WHERE id = ?',
          args: [fixedImageUrl, id]
        });
      } else {
        console.log(`Project ${id}: No change needed`);
      }
    }
    
    console.log('Image data repair completed');
    return true;
  } catch (error) {
    console.error('Error fixing project images:', error);
    return false;
  }
}