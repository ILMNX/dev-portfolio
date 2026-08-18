'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

const AdminLogin = () => {
  const [mode, setMode] = useState<'login' | 'forgot'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const resetAlerts = () => {
    setError('')
    setMessage('')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    resetAlerts()

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const contentType = response.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        throw new Error('Unexpected response')
      }

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('adminAuth', 'true')
        router.push('/admin/dashboard')
      } else {
        setError(data.error || 'Invalid credentials')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    resetAlerts()

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const contentType = response.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        throw new Error('Unexpected response')
      }

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Unable to send reset email')
        return
      }

      setMessage(data.message || 'If an account exists for that email, a reset link has been sent.')
    } catch (err) {
      setError('Unable to send reset email. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full p-8 bg-gray-900 rounded-xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {mode === 'login' ? (
              <>Dev <span className="text-violet-500">Login</span></>
            ) : (
              <>Forgot <span className="text-violet-500">Password</span></>
            )}
          </h1>
          <p className="text-gray-400">
            {mode === 'login'
              ? 'Enter your credentials to access the admin dashboard'
              : 'Enter the email on your admin account and we will send a reset link'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-300 px-4 py-3 rounded-lg mb-6">
            {message}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label htmlFor="username" className="block text-gray-400 mb-2">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            <div className="mb-2">
              <label htmlFor="password" className="block text-gray-400 mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            <div className="mb-6 text-right">
              <button
                type="button"
                onClick={() => {
                  resetAlerts()
                  setMode('forgot')
                }}
                className="text-sm text-violet-400 hover:text-violet-300 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-violet-800 text-white rounded-lg font-medium transition-all hover:from-violet-700 hover:to-violet-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70"
            >
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>
            <div className="mt-4 text-center text-gray-500 text-sm">
              <Link href="/" className="text-violet-500 hover:underline justify-center">Back to Home</Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-400 mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-violet-800 text-white rounded-lg font-medium transition-all hover:from-violet-700 hover:to-violet-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </motion.button>
            <div className="mt-4 text-center text-gray-500 text-sm">
              <button
                type="button"
                onClick={() => {
                  resetAlerts()
                  setMode('login')
                }}
                className="text-violet-500 hover:underline"
              >
                Back to login
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  )
}

export default AdminLogin
