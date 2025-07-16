import { NextRequest, NextResponse } from 'next/server'
import { getAllProjects, createProject } from '@/lib/db/projects'

// Initialize database when the app starts
import { initializeDatabase } from '@/lib/db'
initializeDatabase();

export async function GET() {
  try {
    const projects = await getAllProjects();
    
    // Debug each project's image field
    projects.forEach((project, index) => {
    });
    
    return NextResponse.json({ 
      success: true,
      projects,
      count: projects.length
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.title || !data.description || !data.year || !data.languages) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Handle image URL - ensure it's properly structured
    let imageData;
    
    if (data.image && typeof data.image === 'object' && data.image.src) {
      imageData = { src: data.image.src };
    } else if (data.image && typeof data.image === 'string' && data.image.trim()) {
      imageData = { src: data.image.trim() };
    } else {
      // Use a default local image
      imageData = { src: '/proj1.gif' };
    }
    
    
    const projectToCreate = {
      title: data.title,
      year: parseInt(data.year),
      description: data.description,
      details: data.details || '',
      languages: data.languages,
      image: imageData,
      githubLink: data.githubLink || '',
      liveLink: data.liveLink || ''
    };
    
    
    const newProject = await createProject(projectToCreate);
    
    if (!newProject) {
      console.error('❌ Failed to create project: createProject returned null');
      return NextResponse.json(
        { success: false, error: 'Failed to create project' },
        { status: 500 }
      )
    }
    
    
    return NextResponse.json({ 
      success: true, 
      message: "Project created successfully",
      project: newProject
    })
  } catch (error) {
    console.error('❌ Error creating project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    )
  }
}