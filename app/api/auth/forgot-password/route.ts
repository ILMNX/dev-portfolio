import { NextRequest, NextResponse } from 'next/server'
import { turso } from '@/lib/db/turso'
import { initializeDatabase } from '@/lib/db'
import { isEmailConfigured, sendPasswordResetEmail } from '@/lib/email'
import {
  createResetToken,
  getClientKey,
  getRequestOrigin,
  isRateLimited,
  isValidEmail,
  normalizeEmail,
} from '@/lib/password-reset'

const GENERIC_MESSAGE = 'If an account exists for that email, a reset link has been sent.'

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase()

    const body = await request.json()
    const email = normalizeEmail(typeof body.email === 'string' ? body.email : '')

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    if (isRateLimited(getClientKey(request, email))) {
      return NextResponse.json({ success: true, message: GENERIC_MESSAGE })
    }

    if (process.env.NODE_ENV === 'production' && !isEmailConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Password reset is not available right now' },
        { status: 503 }
      )
    }

    const result = await turso.execute({
      sql: `
        SELECT id, email
        FROM admins
        WHERE email IS NOT NULL
          AND trim(email) != ''
          AND lower(email) = ?
        LIMIT 1
      `,
      args: [email],
    })

    if (result.rows.length > 0) {
      const { token, tokenHash, expiresAt } = createResetToken()

      await turso.execute({
        sql: 'UPDATE admins SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
        args: [tokenHash, expiresAt, result.rows[0].id],
      })

      const resetUrl = `${getRequestOrigin(request)}/admin/reset-password?token=${token}`
      const sent = await sendPasswordResetEmail(email, resetUrl)

      if (!sent) {
        console.error('[password-reset] matching admin found, but email was not sent')
      }
    } else {
      console.info('[password-reset] no admin row matched that email')
    }

    return NextResponse.json({ success: true, message: GENERIC_MESSAGE })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, error: 'Unable to process password reset request' },
      { status: 500 }
    )
  }
}
