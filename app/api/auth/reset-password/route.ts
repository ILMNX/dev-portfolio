import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { turso } from '@/lib/db/turso'
import { initializeDatabase } from '@/lib/db'
import { hashResetToken, tokensMatch } from '@/lib/password-reset'

const MIN_PASSWORD_LENGTH = 8

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase()

    const body = await request.json()
    const token = typeof body.token === 'string' ? body.token.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Reset token is required' },
        { status: 400 }
      )
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { success: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
        { status: 400 }
      )
    }

    const tokenHash = hashResetToken(token)
    const result = await turso.execute({
      sql: `
        SELECT id, reset_token, reset_token_expires
        FROM admins
        WHERE reset_token IS NOT NULL
          AND reset_token_expires IS NOT NULL
          AND reset_token_expires > ?
      `,
      args: [Date.now()],
    })

    const admin = result.rows.find((row) => (
      typeof row.reset_token === 'string' && tokensMatch(row.reset_token, tokenHash)
    ))

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'This reset link is invalid or has expired' },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await turso.execute({
      sql: `
        UPDATE admins
        SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL
        WHERE id = ?
      `,
      args: [passwordHash, admin.id],
    })

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, error: 'Unable to reset password' },
      { status: 500 }
    )
  }
}
