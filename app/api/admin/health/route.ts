import { NextResponse } from 'next/server'
import { turso } from '@/lib/db/turso'

export type HealthStatus = 'ok' | 'degraded' | 'error' | 'not_configured'

export type HealthService = {
  id: string
  name: string
  status: HealthStatus
  latencyMs: number | null
  message: string
  details: Record<string, string | number | boolean>
}

function maskSecret(value?: string | null) {
  if (!value) return 'not set'
  if (value.length <= 6) return '••••'
  return `${value.slice(0, 3)}••••${value.slice(-2)}`
}

function maskEmail(value?: string | null) {
  if (!value) return 'not set'
  const [user, domain] = value.split('@')
  if (!domain) return '••••'
  return `${user.slice(0, 1)}***@${domain}`
}

function parseFromAddress(value?: string) {
  if (!value) return ''
  const match = value.match(/<([^>]+)>/)
  return (match ? match[1] : value).trim()
}

function tursoHost(url?: string) {
  if (!url) return 'local file (file:local.db)'
  try {
    const parsed = new URL(url)
    return parsed.host || parsed.pathname
  } catch {
    if (url.startsWith('file:')) return url
    return 'invalid URL'
  }
}

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string) {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
      }),
    ])
  } finally {
    if (timer) clearTimeout(timer)
  }
}

async function checkTurso(): Promise<HealthService> {
  const started = Date.now()
  const url = process.env.TURSO_DATABASE_URL
  const tokenSet = Boolean(process.env.TURSO_AUTH_TOKEN)
  const usingLocal = !url

  try {
    await turso.execute('SELECT 1 AS ok')
    const [projects, admins, adminEmail] = await Promise.all([
      turso.execute('SELECT COUNT(*) AS count FROM projects'),
      turso.execute('SELECT COUNT(*) AS count FROM admins'),
      turso.execute(`
        SELECT COUNT(*) AS count
        FROM admins
        WHERE email IS NOT NULL AND trim(email) != ''
      `).catch(() => ({ rows: [{ count: 0 }] })),
    ])

    const latencyMs = Date.now() - started
    const status: HealthStatus = usingLocal ? 'degraded' : 'ok'

    return {
      id: 'turso',
      name: 'Turso Database',
      status,
      latencyMs,
      message: usingLocal
        ? 'Connected to local SQLite fallback. Set TURSO_DATABASE_URL to use Turso.'
        : 'Connected and responding',
      details: {
        host: tursoHost(url),
        mode: usingLocal ? 'local sqlite' : 'turso',
        authToken: tokenSet ? 'configured' : 'missing',
        projects: Number(projects.rows[0]?.count ?? 0),
        admins: Number(admins.rows[0]?.count ?? 0),
        adminsWithEmail: Number(adminEmail.rows[0]?.count ?? 0),
      },
    }
  } catch (error) {
    return {
      id: 'turso',
      name: 'Turso Database',
      status: 'error',
      latencyMs: Date.now() - started,
      message: error instanceof Error ? error.message : 'Connection failed',
      details: {
        host: tursoHost(url),
        mode: usingLocal ? 'local sqlite' : 'turso',
        authToken: tokenSet ? 'configured' : 'missing',
      },
    }
  }
}

async function checkGitHub(): Promise<HealthService> {
  const started = Date.now()
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN || process.env.GITHUB_TOKEN

  if (!token) {
    return {
      id: 'github',
      name: 'GitHub API',
      status: 'not_configured',
      latencyMs: null,
      message: 'NEXT_PUBLIC_GITHUB_TOKEN is not set',
      details: {
        token: 'not set',
        endpoint: 'api.github.com',
      },
    }
  }

  try {
    const response = await withTimeout(
      fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': 'dev-portfolio-health',
          Accept: 'application/vnd.github+json',
        },
        cache: 'no-store',
      }),
      8000,
      'GitHub API'
    )

    const latencyMs = Date.now() - started
    const remaining = response.headers.get('x-ratelimit-remaining')
    const limit = response.headers.get('x-ratelimit-limit')
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      return {
        id: 'github',
        name: 'GitHub API',
        status: 'error',
        latencyMs,
        message: data.message || `GitHub returned ${response.status}`,
        details: {
          token: 'configured',
          httpStatus: response.status,
          rateLimit: limit ? `${remaining}/${limit}` : 'unknown',
        },
      }
    }

    return {
      id: 'github',
      name: 'GitHub API',
      status: 'ok',
      latencyMs,
      message: `Authenticated as ${data.login || 'GitHub user'}`,
      details: {
        token: 'configured',
        login: data.login || 'unknown',
        rateLimit: limit ? `${remaining} / ${limit} remaining` : 'unknown',
        scopes: response.headers.get('x-oauth-scopes') || 'default',
      },
    }
  } catch (error) {
    return {
      id: 'github',
      name: 'GitHub API',
      status: 'error',
      latencyMs: Date.now() - started,
      message: error instanceof Error ? error.message : 'GitHub request failed',
      details: {
        token: 'configured',
        endpoint: 'api.github.com',
      },
    }
  }
}

async function checkSmtp(): Promise<HealthService> {
  const started = Date.now()
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const port = Number(process.env.SMTP_PORT || 587)
  const secure = process.env.SMTP_SECURE === 'true'
  const fromAddress = parseFromAddress(process.env.EMAIL_FROM || process.env.ADMIN_EMAIL)

  if (!host || !user || !pass) {
    return {
      id: 'smtp',
      name: 'SMTP Mail',
      status: 'not_configured',
      latencyMs: null,
      message: 'SMTP_HOST, SMTP_USER, or SMTP_PASS is missing',
      details: {
        host: host || 'not set',
        port,
        secure,
        user: user ? maskEmail(user) : 'not set',
        from: fromAddress ? maskEmail(fromAddress) : 'not set',
      },
    }
  }

  try {
    const nodemailer = await import('nodemailer')
    const createTransport = nodemailer.createTransport ?? nodemailer.default.createTransport
    const transporter = createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
    })

    await withTimeout(transporter.verify(), 8000, 'SMTP')

    return {
      id: 'smtp',
      name: 'SMTP Mail',
      status: 'ok',
      latencyMs: Date.now() - started,
      message: 'Server accepted login and is ready to send',
      details: {
        host,
        port,
        secure,
        user: maskEmail(user),
        from: fromAddress ? maskEmail(fromAddress) : maskEmail(user),
      },
    }
  } catch (error) {
    return {
      id: 'smtp',
      name: 'SMTP Mail',
      status: 'error',
      latencyMs: Date.now() - started,
      message: error instanceof Error ? error.message : 'SMTP verification failed',
      details: {
        host,
        port,
        secure,
        user: maskEmail(user),
      },
    }
  }
}

async function checkResend(): Promise<HealthService> {
  const started = Date.now()
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    return {
      id: 'resend',
      name: 'Resend',
      status: 'not_configured',
      latencyMs: null,
      message: 'RESEND_API_KEY is not set (optional if SMTP is used)',
      details: {
        apiKey: 'not set',
      },
    }
  }

  try {
    const response = await withTimeout(
      fetch('https://api.resend.com/domains', {
        headers: { Authorization: `Bearer ${apiKey}` },
        cache: 'no-store',
      }),
      8000,
      'Resend'
    )
    const latencyMs = Date.now() - started

    if (!response.ok) {
      return {
        id: 'resend',
        name: 'Resend',
        status: 'error',
        latencyMs,
        message: `Resend returned ${response.status}`,
        details: {
          apiKey: maskSecret(apiKey),
          httpStatus: response.status,
        },
      }
    }

    const data = await response.json().catch(() => ({ data: [] }))
    const domainCount = Array.isArray(data.data) ? data.data.length : 0

    return {
      id: 'resend',
      name: 'Resend',
      status: 'ok',
      latencyMs,
      message: 'API key is valid',
      details: {
        apiKey: 'configured',
        domains: domainCount,
      },
    }
  } catch (error) {
    return {
      id: 'resend',
      name: 'Resend',
      status: 'error',
      latencyMs: Date.now() - started,
      message: error instanceof Error ? error.message : 'Resend request failed',
      details: {
        apiKey: 'configured',
      },
    }
  }
}

async function checkWakatime(): Promise<HealthService> {
  const started = Date.now()
  const apiKey = process.env.WAKATIME_API

  if (!apiKey) {
    return {
      id: 'wakatime',
      name: 'WakaTime',
      status: 'not_configured',
      latencyMs: null,
      message: 'WAKATIME_API is not set',
      details: {
        apiKey: 'not set',
      },
    }
  }

  try {
    const response = await withTimeout(
      fetch(`https://wakatime.com/api/v1/users/current?api_key=${apiKey}`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      }),
      8000,
      'WakaTime'
    )
    const latencyMs = Date.now() - started
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      return {
        id: 'wakatime',
        name: 'WakaTime',
        status: 'error',
        latencyMs,
        message: data.error || `WakaTime returned ${response.status}`,
        details: {
          apiKey: 'configured',
          httpStatus: response.status,
        },
      }
    }

    return {
      id: 'wakatime',
      name: 'WakaTime',
      status: 'ok',
      latencyMs,
      message: `Connected as ${data.data?.username || data.data?.display_name || 'current user'}`,
      details: {
        apiKey: 'configured',
        username: data.data?.username || data.data?.display_name || 'unknown',
      },
    }
  } catch (error) {
    return {
      id: 'wakatime',
      name: 'WakaTime',
      status: 'error',
      latencyMs: Date.now() - started,
      message: error instanceof Error ? error.message : 'WakaTime request failed',
      details: {
        apiKey: 'configured',
      },
    }
  }
}

function overallStatus(services: HealthService[]): HealthStatus {
  if (services.some((service) => service.status === 'error')) return 'error'
  if (services.some((service) => service.status === 'degraded')) return 'degraded'
  if (services.filter((service) => service.id === 'turso' || service.id === 'github').every((service) => service.status === 'ok')) {
    return 'ok'
  }
  return 'degraded'
}

export async function GET() {
  const started = Date.now()
  const services = await Promise.all([
    checkTurso(),
    checkGitHub(),
    checkSmtp(),
    checkResend(),
    checkWakatime(),
  ])

  const status = overallStatus(services)
  const healthy = services.filter((service) => service.status === 'ok').length

  return NextResponse.json({
    success: true,
    status,
    checkedAt: new Date().toISOString(),
    durationMs: Date.now() - started,
    summary: {
      healthy,
      total: services.length,
    },
    services,
  })
}
