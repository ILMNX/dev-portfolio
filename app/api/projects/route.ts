import { NextRequest, NextResponse } from 'next/server'
import { getAllProjects, createProject } from '@/lib/db/projects'

// Initialize database when the app starts - comment out after first run if you want
import { initializeDatabase } from '@/lib/db'
initializeDatabase();

// API endpoint to get all projects
export async function GET(request: NextRequest) {
  try {
    const projects = await getAllProjects();
    return NextResponse.json({ 
      success: true,
      projects
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// API endpoint to create a new project
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
    
    const newProject = await createProject({
      title: data.title,
      year: parseInt(data.year),
      description: data.description,
      details: data.details || '',
      languages: data.languages,
      image: { src: data.image || '/proj1.png' },
      githubLink: data.githubLink || '',
      liveLink: data.liveLink || ''
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "Project created successfully",
      project: newProject
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    )
  }
}