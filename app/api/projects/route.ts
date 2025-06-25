import { NextRequest, NextResponse } from 'next/server'
import { getAllProjects, createProject } from '@/lib/db/projects'

// Initialize database when the app starts
import { initializeDatabase } from '@/lib/db'
initializeDatabase();

export async function GET() {
  try {
    console.log('=== GET /api/projects CALLED ===');
    const projects = await getAllProjects();
    console.log('Raw projects from database:', JSON.stringify(projects, null, 2));
    
    // Debug each project's image field
    projects.forEach((project, index) => {
      console.log(`Project ${index + 1} (${project.title}):`);
      console.log('  - Image field:', project.image);
      console.log('  - Image type:', typeof project.image);
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
    console.log('=== POST /api/projects CALLED ===');
    const data = await request.json()
    console.log('Received project data:', JSON.stringify(data, null, 2));
    
    // Validate required fields
    if (!data.title || !data.description || !data.year || !data.languages) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Handle image URL - ensure it's properly structured
    let imageData;
    console.log('Processing image data:', data.image);
    console.log('Image type:', typeof data.image);
    
    if (data.image && typeof data.image === 'object' && data.image.src) {
      imageData = { src: data.image.src };
      console.log('✅ Using image object with src:', imageData);
    } else if (data.image && typeof data.image === 'string' && data.image.trim()) {
      imageData = { src: data.image.trim() };
      console.log('✅ Converting string to image object:', imageData);
    } else {
      // Use a default local image
      imageData = { src: '/proj1.gif' };
      console.log('⚠️ Using fallback image:', imageData);
    }
    
    console.log('Final image data to save:', JSON.stringify(imageData));
    
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
    
    console.log('Final project to create:', JSON.stringify(projectToCreate, null, 2));
    
    const newProject = await createProject(projectToCreate);
    
    if (!newProject) {
      console.error('❌ Failed to create project: createProject returned null');
      return NextResponse.json(
        { success: false, error: 'Failed to create project' },
        { status: 500 }
      )
    }
    
    console.log('✅ Created project with image:', JSON.stringify(newProject.image, null, 2));
    
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