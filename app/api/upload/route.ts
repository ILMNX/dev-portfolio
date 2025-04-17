import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false, // Disabling built-in bodyParser as we're handling file upload
  },
};

export async function POST(req: NextRequest) {
  try {
    // Get form data from request
    const formData = await req.formData();
    
    // Get file from form data
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }
    
    // Generate a unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Create directory path
    const publicDir = path.join(process.cwd(), 'public');
    const uploadsDir = path.join(publicDir, 'uploads');
    const projectsDir = path.join(uploadsDir, 'projects');
    
    // Ensure directories exist
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }
    if (!existsSync(projectsDir)) {
      await mkdir(projectsDir, { recursive: true });
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save file to disk
    const filePath = path.join(projectsDir, fileName);
    await writeFile(filePath, buffer);
    
    // Return the file URL
    const imageUrl = `/uploads/projects/${fileName}`;
    
    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' }, 
      { status: 500 }
    );
  }
}