import { turso } from './turso';

// Project type definition for TypeScript
export interface Project {
  id?: number;
  title: string;
  year: number;
  description: string;
  details?: string;
  languages: string[];
  image: { src: string };
  githubLink?: string;
  liveLink?: string;
  created_at?: string;
  updated_at?: string;
}

// Convert database row to Project
function rowToProject(row: any): Project {
  return {
    id: row.id,
    title: row.title,
    year: row.year,
    description: row.description,
    details: row.details || '',
    languages: JSON.parse(row.languages),
    image: { src: row.image_url || '/proj1.png' },
    githubLink: row.github_link || '',
    liveLink: row.live_link || '',
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

// Get all projects
export async function getAllProjects(): Promise<Project[]> {
  try {
    const result = await turso.execute('SELECT * FROM projects ORDER BY year DESC');
    return result.rows.map(rowToProject);
  } catch (error) {
    console.error('Error getting projects:', error);
    return [];
  }
}

// Get a single project by ID
export async function getProjectById(id: number): Promise<Project | null> {
  try {
    const result = await turso.execute({
      sql: 'SELECT * FROM projects WHERE id = ?',
      args: [id]
    });
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return rowToProject(result.rows[0]);
  } catch (error) {
    console.error(`Error getting project id ${id}:`, error);
    return null;
  }
}

// Create a new project
export async function createProject(project: Omit<Project, 'id'>): Promise<Project | null> {
  try {
    const result = await turso.execute({
      sql: `
        INSERT INTO projects (
          title, year, description, details, languages, 
          image_url, github_link, live_link
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING *
      `,
      args: [
        project.title,
        project.year,
        project.description,
        project.details || '',
        JSON.stringify(project.languages),
        project.image.src,
        project.githubLink || '',
        project.liveLink || ''
      ]
    });
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return rowToProject(result.rows[0]);
  } catch (error) {
    console.error('Error creating project:', error);
    return null;
  }
}

// Update an existing project
export async function updateProject(id: number, project: Partial<Project>): Promise<Project | null> {
  try {
    // First get the current project to merge with updates
    const currentProject = await getProjectById(id);
    
    if (!currentProject) {
      return null;
    }
    
    // Prepare updated fields
    const updatedProject = {
      ...currentProject,
      ...project,
      // Special handling for nested fields
      languages: project.languages || currentProject.languages,
      image: project.image || currentProject.image,
    };
    
    const result = await turso.execute({
      sql: `
        UPDATE projects SET
          title = ?, 
          year = ?, 
          description = ?, 
          details = ?, 
          languages = ?, 
          image_url = ?, 
          github_link = ?, 
          live_link = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        RETURNING *
      `,
      args: [
        updatedProject.title,
        updatedProject.year,
        updatedProject.description,
        updatedProject.details || '',
        JSON.stringify(updatedProject.languages),
        updatedProject.image.src,
        updatedProject.githubLink || '',
        updatedProject.liveLink || '',
        id
      ]
    });
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return rowToProject(result.rows[0]);
  } catch (error) {
    console.error(`Error updating project id ${id}:`, error);
    return null;
  }
}

// Delete a project
export async function deleteProject(id: number): Promise<boolean> {
  try {
    await turso.execute({
      sql: 'DELETE FROM projects WHERE id = ?',
      args: [id]
    });
    
    return true;
  } catch (error) {
    console.error(`Error deleting project id ${id}:`, error);
    return false;
  }
}