type SendEmailInput = {
  to: string
  subject: string
  html: string
  text: string
}

function getFromAddress() {
  return process.env.EMAIL_FROM || process.env.ADMIN_EMAIL || 'noreply@gilbertsibuea.com'
}

async function sendWithResend({ to, subject, html, text }: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return false

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: getFromAddress(),
      to,
      subject,
      html,
      text,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    console.error('Resend email failed:', response.status, body)
    return false
  }

  const payload = await response.json().catch(() => null)
  const id = payload && typeof payload.id === 'string' ? payload.id : 'unknown'
  console.info(`[password-reset] queued via Resend for ${to} (id: ${id})`)
  return true
}

async function sendWithSmtp({ to, subject, html, text }: SendEmailInput) {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) return false

  const nodemailer = await import('nodemailer')
  const createTransport = nodemailer.createTransport ?? nodemailer.default.createTransport
  const transporter = createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  })

  const info = await transporter.sendMail({
    from: getFromAddress(),
    to,
    subject,
    html,
    text,
  })

  console.info(`[password-reset] queued via SMTP for ${to} (id: ${info.messageId})`)
  return true
}

export function isEmailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY ||
    (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  )
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const subject = 'Reset your admin password'
  const text = `Reset your admin password using this link (expires in 1 hour):\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`
  const html = `
    <div style="font-family: sans-serif; line-height: 1.5; color: #111">
      <h2>Reset your admin password</h2>
      <p>Click the button below to choose a new password. This link expires in 1 hour.</p>
      <p>
        <a href="${resetUrl}" style="display:inline-block;background:#7c3aed;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:600">
          Reset password
        </a>
      </p>
      <p>If the button does not work, copy and paste this URL:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you did not request this, you can ignore this email.</p>
    </div>
  `

  const payload = { to, subject, html, text }

  if (process.env.RESEND_API_KEY) {
    return sendWithResend(payload)
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return sendWithSmtp(payload)
  }

  if (process.env.NODE_ENV !== 'production') {
    console.info(`[password-reset] no email provider configured; reset link for ${to}: ${resetUrl}`)
    return true
  }

  console.error('[password-reset] skipped: no email provider configured')
  return false
}
