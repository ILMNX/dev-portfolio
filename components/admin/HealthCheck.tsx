'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  FaDatabase,
  FaGithub,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
} from 'react-icons/fa'
import { HiRefresh } from 'react-icons/hi'

type HealthStatus = 'ok' | 'degraded' | 'error' | 'not_configured'

type HealthService = {
  id: string
  name: string
  status: HealthStatus
  latencyMs: number | null
  message: string
  details: Record<string, string | number | boolean>
}

type HealthResponse = {
  success: boolean
  status: HealthStatus
  checkedAt: string
  durationMs: number
  summary: { healthy: number; total: number }
  services: HealthService[]
}

const STATUS_STYLES: Record<HealthStatus, { label: string; badge: string; dot: string; border: string }> = {
  ok: {
    label: 'Healthy',
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]',
    border: 'border-emerald-500/20',
  },
  degraded: {
    label: 'Degraded',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dot: 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]',
    border: 'border-amber-500/20',
  },
  error: {
    label: 'Down',
    badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    dot: 'bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.8)]',
    border: 'border-rose-500/20',
  },
  not_configured: {
    label: 'Not configured',
    badge: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
    dot: 'bg-slate-400',
    border: 'border-white/10',
  },
}

const SERVICE_ICONS: Record<string, ReactNode> = {
  turso: <FaDatabase className="text-sky-300" />,
  github: <FaGithub className="text-white" />,
  smtp: <FaEnvelope className="text-violet-300" />,
  resend: <FaPaperPlane className="text-cyan-300" />,
  wakatime: <FaClock className="text-pink-300" />,
}

function formatCheckedAt(value?: string) {
  if (!value) return '—'
  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function formatDetailKey(key: string) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase())
}

export default function HealthCheck() {
  const [data, setData] = useState<HealthResponse | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadHealth = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/health', { cache: 'no-store' })
      const contentType = response.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        throw new Error('Health endpoint did not return JSON')
      }
      const payload = await response.json()
      if (!payload.success) {
        throw new Error(payload.error || 'Health check failed')
      }
      setData(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load health checks')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadHealth()
  }, [loadHealth])

  const overall = data ? STATUS_STYLES[data.status] : STATUS_STYLES.not_configured

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">System Health</h2>
          <p className="text-gray-400 text-sm mt-1">
            Live checks for database, GitHub, mail, and related services
          </p>
        </div>
        <button
          onClick={loadHealth}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-white/10 transition-colors disabled:opacity-60"
        >
          <HiRefresh className={loading ? 'animate-spin' : ''} />
          {loading ? 'Checking…' : 'Refresh'}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-6 rounded-2xl border bg-gray-900/80 p-5 ${overall.border}`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`h-3 w-3 rounded-full ${overall.dot} ${data?.status === 'ok' ? 'animate-pulse' : ''}`} />
            <div>
              <p className="font-semibold">
                {data?.status === 'ok' && 'All required systems operational'}
                {data?.status === 'degraded' && 'Some services need attention'}
                {data?.status === 'error' && 'One or more services are down'}
                {!data && (loading ? 'Running health checks' : 'Health status unavailable')}
              </p>
              <p className="text-sm text-gray-400">
                {data
                  ? `${data.summary.healthy}/${data.summary.total} healthy · ${data.durationMs}ms · last check ${formatCheckedAt(data.checkedAt)}`
                  : 'Waiting for results'}
              </p>
            </div>
          </div>
          {data && (
            <span className={`self-start px-3 py-1 rounded-full text-sm border ${overall.badge}`}>
              {overall.label}
            </span>
          )}
        </div>
      </motion.div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-rose-300">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {(data?.services ?? Array.from({ length: 5 }).map((_, index) => null)).map((service, index) => {
          if (!service) {
            return (
              <div key={index} className="bg-gray-900 rounded-2xl border border-white/5 p-5 animate-pulse">
                <div className="h-5 w-32 bg-gray-800 rounded mb-4" />
                <div className="h-4 w-full bg-gray-800 rounded mb-2" />
                <div className="h-4 w-2/3 bg-gray-800 rounded" />
              </div>
            )
          }

          const style = STATUS_STYLES[service.status]
          return (
            <motion.article
              key={service.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className={`bg-gray-900 rounded-2xl border p-5 ${style.border}`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg">
                    {SERVICE_ICONS[service.id] ?? <FaDatabase />}
                  </div>
                  <div>
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="text-xs text-gray-500">
                      {service.latencyMs !== null ? `${service.latencyMs}ms` : 'not probed'}
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs border ${style.badge}`}>
                  {style.label}
                </span>
              </div>

              <p className="text-sm text-gray-300 mb-4 leading-relaxed">{service.message}</p>

              <dl className="space-y-2">
                {Object.entries(service.details).map(([key, value]) => (
                  <div key={key} className="flex items-start justify-between gap-3 text-sm">
                    <dt className="text-gray-500">{formatDetailKey(key)}</dt>
                    <dd className="text-gray-200 text-right break-all">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
