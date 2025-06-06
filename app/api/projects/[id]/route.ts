import { NextRequest, NextResponse } from 'next/server'
import { getProjectById, updateProject, deleteProject } from '@/lib/db/projects'

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  try {
    const projectId = parseInt(id);
    if (isNaN(projectId)) {
      return NextResponse.json({ success: false, error: 'Invalid project ID' }, { status: 400 });
    }
    const project = await getProjectById(projectId);
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  try {
    const projectId = parseInt(id);
    if (isNaN(projectId)) {
      return NextResponse.json({ success: false, error: 'Invalid project ID' }, { status: 400 });
    }
    
    const data = await request.json();
    if (!data.title || !data.description || !data.year || !data.languages) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    
    // Fix image handling - ensure proper object structure
    let imageData;
    if (typeof data.image === 'string') {
      imageData = { src: data.image };
    } else if (data.image && typeof data.image === 'object' && data.image.src) {
      imageData = { src: data.image.src };
    } else {
      // Default fallback image
      imageData = { src: '/proj1.png' };
    }
    
    // Log processed image data for debugging
    console.log('Processing image data for project update:', JSON.stringify(imageData));
    
    const updatedProject = await updateProject(projectId, {
      title: data.title,
      year: parseInt(data.year),
      description: data.description,
      details: data.details || '',
      languages: data.languages,
      image: imageData,
      githubLink: data.githubLink || '',
      liveLink: data.liveLink || ''
    });
    
    if (!updatedProject) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: `Project updated successfully`, project: updatedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ success: false, error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  try {
    const projectId = parseInt(id);
    if (isNaN(projectId)) {
      return NextResponse.json({ success: false, error: 'Invalid project ID' }, { status: 400 });
    }
    const success = await deleteProject(projectId);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Failed to delete project or project not found' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: `Project deleted successfully` });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete project' }, { status: 500 });
  }
}