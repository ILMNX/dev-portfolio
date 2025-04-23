'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Dashboard components
const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [projectCount, setProjectCount] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const adminAuth = localStorage.getItem('adminAuth')
    if (!adminAuth) {
      router.push('/admin')
      return
    }
    setIsAuthenticated(true)
    setIsLoading(false)

    // Fetch project count from API
    const fetchProjectCount = async () => {
      try {
        const res = await fetch('/api/projects', { cache: 'no-store' })
        const data = await res.json()
        if (data.success && Array.isArray(data.projects)) {
          setProjectCount(data.projects.length)
        } else {
          setProjectCount(0)
        }
      } catch {
        setProjectCount(0)
      }
    }
    fetchProjectCount()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    router.push('/admin')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // This should never render as the useEffect will redirect
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Admin Header/Navigation */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin <span className="text-violet-500">Dashboard</span></h1>
          
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              View Site
            </Link>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Stats Card - Projects */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 p-6 rounded-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Projects</h2>
              <span className="text-2xl font-bold text-violet-500">
                {projectCount !== null ? projectCount : '...'}
              </span>
            </div>
            <p className="text-gray-400 mb-4">Manage your portfolio projects</p>
            <Link 
              href="/admin/projects"
              className="inline-block px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
            >
              Manage Projects
            </Link>
          </motion.div>

          {/* Stats Card - Messages */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-gray-900 p-6 rounded-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <span className="text-sm px-2 py-1 bg-green-500/20 text-green-400 rounded-full">Active</span>
            </div>
            <p className="text-gray-400 mb-4">Your portfolio site is running normally</p>
          </motion.div>
        </div>

        {/* Quick Actions Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/projects/new">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-900 p-4 rounded-xl text-center hover:bg-gray-800 transition-colors"
              >
                <span className="block text-2xl mb-2">➕</span>
                <span>Add Project</span>
              </motion.div>
            </Link>
            
            <Link href="/admin/projects">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-900 p-4 rounded-xl text-center hover:bg-gray-800 transition-colors"
              >
                <span className="block text-2xl mb-2">📋</span>
                <span>View Projects</span>
              </motion.div>
            </Link>
            
            <Link href="/admin/projects/selected">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-900 p-4 rounded-xl text-center hover:bg-gray-800 transition-colors"
              >
                <span className="block text-2xl mb-2">⭐</span>
                <span>Selected Projects</span>
              </motion.div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard