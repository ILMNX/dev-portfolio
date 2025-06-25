import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get('url');
    
    if (!fileUrl) {
      return NextResponse.json({ success: false, error: 'No file URL provided' }, { status: 400 });
    }
    
    // Extract filename from URL (assuming local file structure)
    const fileName = path.basename(fileUrl);
    if (!fileName) {
      return NextResponse.json({ success: false, error: 'Invalid file URL' }, { status: 400 });
    }
    
    // Construct the file path in the public/uploads directory
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });
    }
    
    // Delete the file
    fs.unlinkSync(filePath);
    
    return NextResponse.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete file' }, { status: 500 });
  }
}