import { NextRequest, NextResponse } from 'next/server'
import { getProjectById, updateProject, deleteProject } from '@/lib/db/projects'

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  try {
    console.log('=== GET Individual Project API Called ===');
    console.log('Project ID:', id);
    
    const projectId = parseInt(id);
    if (isNaN(projectId)) {
      return NextResponse.json({ success: false, error: 'Invalid project ID' }, { status: 400 });
    }
    
    const project = await getProjectById(projectId);
    console.log('Retrieved project:', JSON.stringify(project, null, 2));
    
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
    
    // Handle image - ensure proper object structure
    let imageData;
    if (typeof data.image === 'string') {
      imageData = { src: data.image };
    } else if (data.image && typeof data.image === 'object' && data.image.src) {
      imageData = { src: data.image.src };
    } else {
      imageData = { src: '/proj1.gif' };
    }
    
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
    
    // Get project first to delete the image file
    const project = await getProjectById(projectId);
    if (project && project.image && typeof project.image === 'object' && project.image.src) {
      // Delete the image file if it's a local upload
      if (project.image.src.startsWith('/uploads/')) {
        try {
          const fs = require('fs').promises;
          const path = require('path');
          const filePath = path.join(process.cwd(), 'public', project.image.src);
          await fs.unlink(filePath);
          console.log('Deleted image file:', filePath);
        } catch (error) {
          console.error('Error deleting image file:', error);
          // Don't fail the deletion if image file deletion fails
        }
      }
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