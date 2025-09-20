import { NextRequest, NextResponse } from 'next/server';
import { getSelectedProjects, updateSelectedProjects } from '@/lib/db/projects';

// GET endpoint to fetch only selected projects for the portfolio
export async function GET() {
  try {
    const projects = await getSelectedProjects();
    
    // Enhanced debugging
    // console.log('API Selected Projects - FULL DATA: ', JSON.stringify(projects, null, 2));
    
    // Debug each project's image separately
    // Debugging code for project images can be safely removed after finished debugging.
    
    return NextResponse.json({ 
      success: true,
      projects
    });
  } catch (error) {
    console.error('Error fetching selected projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch selected projects' },
      { status: 500 }
    );
  }
}

// POST endpoint to update selected projects (max 3)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate the selected projects data
    if (!Array.isArray(data.selectedProjects)) {
      return NextResponse.json(
        { success: false, error: 'Invalid selected projects data' },
        { status: 400 }
      );
    }
    
    // Define interface for selected project
    interface SelectedProject {
      id: number;
      [key: string]: unknown; // For any other properties that might be present
    }
    
    // Limit to maximum 3 selected projects
    const selectedProjects = data.selectedProjects.slice(0, 3).map((project: SelectedProject, index: number) => ({
      id: project.id,
      order: index + 1
    }));
    
    // Update selected projects in the database
    const result = await updateSelectedProjects(selectedProjects);
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Failed to update selected projects' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Selected projects updated successfully"
    });
  } catch (error) {
    console.error('Error updating selected projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update selected projects' },
      { status: 500 }
    );
  }
}