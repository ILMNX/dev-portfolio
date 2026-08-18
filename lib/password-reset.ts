import { createHash, randomBytes, timingSafeEqual } from 'crypto'
import { NextRequest } from 'next/server'

const TOKEN_BYTES = 32
const RESET_TTL_MS = 60 * 60 * 1000
const REQUEST_COOLDOWN_MS = 60 * 1000

const lastRequestAt = new Map<string, number>()

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function hashResetToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export function createResetToken() {
  const token = randomBytes(TOKEN_BYTES).toString('hex')
  return {
    token,
    tokenHash: hashResetToken(token),
    expiresAt: Date.now() + RESET_TTL_MS,
  }
}

export function tokensMatch(storedHash: string, incomingHash: string) {
  const stored = Buffer.from(storedHash)
  const incoming = Buffer.from(incomingHash)
  if (stored.length !== incoming.length) return false
  return timingSafeEqual(stored, incoming)
}

export function isRateLimited(key: string) {
  const now = Date.now()
  const previous = lastRequestAt.get(key)
  if (previous && now - previous < REQUEST_COOLDOWN_MS) {
    return true
  }
  lastRequestAt.set(key, now)
  return false
}

export function getRequestOrigin(request: NextRequest) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'
  const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
  return `${proto}://${host}`
}

export function getClientKey(request: NextRequest, email: string) {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
  return `${ip}:${email}`
}
