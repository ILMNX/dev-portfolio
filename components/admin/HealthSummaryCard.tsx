'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'

type HealthStatus = 'ok' | 'degraded' | 'error' | 'not_configured'

const STATUS_STYLES: Record<HealthStatus, { label: string; badge: string }> = {
  ok: { label: 'Healthy', badge: 'bg-emerald-500/20 text-emerald-400' },
  degraded: { label: 'Degraded', badge: 'bg-amber-500/20 text-amber-300' },
  error: { label: 'Down', badge: 'bg-rose-500/20 text-rose-400' },
  not_configured: { label: 'Checking', badge: 'bg-slate-500/20 text-slate-300' },
}

export default function HealthSummaryCard() {
  const [status, setStatus] = useState<HealthStatus>('not_configured')
  const [summary, setSummary] = useState<string>('Checking services…')
  const [loading, setLoading] = useState(true)

  const loadHealth = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/health', { cache: 'no-store' })
      const contentType = response.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        throw new Error('Unexpected response')
      }
      const data = await response.json()
      if (!data.success) throw new Error('Health check failed')
      setStatus(data.status)
      setSummary(`${data.summary.healthy}/${data.summary.total} services healthy`)
    } catch {
      setStatus('error')
      setSummary('Unable to load health status')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadHealth()
  }, [loadHealth])

  const style = STATUS_STYLES[status]

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">System Health</h2>
        <span className={`text-sm px-2 py-1 rounded-full ${style.badge}`}>
          {loading ? 'Checking' : style.label}
        </span>
      </div>
      <p className="text-gray-400 mb-4">
        {loading ? 'Running live checks for Turso, GitHub, and SMTP' : summary}
      </p>
      <Link
        href="/admin/health"
        className="inline-block px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
      >
        View Health Checks
      </Link>
    </>
  )
}
