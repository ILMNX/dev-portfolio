import { NextResponse } from 'next/server';
import { fixProjectImages } from '@/lib/db';

// Temporary API endpoint to fix project image data
export async function GET() {
  try {
    const result = await fixProjectImages();
    
    if (result) {
      return NextResponse.json({ 
        success: true, 
        message: "Project image data fixed successfully" 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: "Failed to fix project image data" 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in fix-images endpoint:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Error fixing project image data" 
    }, { status: 500 });
  }
}