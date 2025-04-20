import { NextRequest, NextResponse } from 'next/server'
import { getProjectById, updateProject, deleteProject } from '@/lib/db/projects'

// Use 'any' for context to bypass Next.js 15 type bug
export async function GET(request: NextRequest, context: any) {
  const { id } = context.params;
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

export async function PUT(request: NextRequest, context: any) {
  const { id } = context.params;
  try {
    const projectId = parseInt(id);
    if (isNaN(projectId)) {
      return NextResponse.json({ success: false, error: 'Invalid project ID' }, { status: 400 });
    }
    const data = await request.json();
    if (!data.title || !data.description || !data.year || !data.languages) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    const updatedProject = await updateProject(projectId, {
      title: data.title,
      year: parseInt(data.year),
      description: data.description,
      details: data.details || '',
      languages: data.languages,
      image: typeof data.image === 'string' ? { src: data.image } : data.image,
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

export async function DELETE(request: NextRequest, context: any) {
  const { id } = context.params;
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