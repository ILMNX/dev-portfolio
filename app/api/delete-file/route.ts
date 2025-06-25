import { NextRequest, NextResponse } from 'next/server';
import { azureBlobService } from '@/lib/azure/blobStorage';

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get('url');
    
    if (!fileUrl) {
      return NextResponse.json({ success: false, error: 'No file URL provided' }, { status: 400 });
    }
    
    const fileName = azureBlobService.extractFileNameFromUrl(fileUrl);
    if (!fileName) {
      return NextResponse.json({ success: false, error: 'Invalid file URL' }, { status: 400 });
    }
    
    const success = await azureBlobService.deleteFile(`projects/${fileName}`);
    
    if (success) {
      return NextResponse.json({ success: true, message: 'File deleted successfully' });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to delete file' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete file' }, { status: 500 });
  }
}