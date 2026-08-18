'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

const ResetPasswordForm = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!token) {
      setError('This reset link is missing a token. Request a new one from the login page.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const contentType = response.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        throw new Error('Unexpected response')
      }

      const data = await response.json()
      if (!data.success) {
        setError(data.error || 'Unable to reset password')
        return
      }

      setSuccess('Password updated. You can now log in with your new password.')
      setTimeout(() => router.push('/admin'), 1500)
    } catch (err) {
      console.error(err)
      setError('Unable to reset password. Please try again.')
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
          <h1 className="text-4xl font-bold mb-2">Reset <span className="text-violet-500">Password</span></h1>
          <p className="text-gray-400">Choose a new password for your admin account</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-300 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleReset}>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-400 mb-2">New password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              minLength={8}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-400 mb-2">Confirm password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              minLength={8}
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !token}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-violet-800 text-white rounded-lg font-medium transition-all hover:from-violet-700 hover:to-violet-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70"
          >
            {loading ? 'Updating...' : 'Update password'}
          </motion.button>

          <div className="mt-4 text-center text-gray-500 text-sm">
            <Link href="/admin" className="text-violet-500 hover:underline">Back to login</Link>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

const ResetPasswordPage = () => (
  <Suspense fallback={
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      Loading...
    </div>
  }>
    <ResetPasswordForm />
  </Suspense>
)

export default ResetPasswordPage
