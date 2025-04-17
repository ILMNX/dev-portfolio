import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/db/turso';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    // Find admin in database
    const result = await turso.execute({
      sql: "SELECT * FROM admins WHERE username = ?",
      args: [username]
    });
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const admin = result.rows[0];
    const passwordHash = admin.password_hash as string;
    const passwordMatch = await bcrypt.compare(password, passwordHash);
    
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Authentication successful
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      userId: admin.id,
      username: admin.username,
      // In a real app, you would generate a JWT token here
      token: 'admin-authenticated'
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}