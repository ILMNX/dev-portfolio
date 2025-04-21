'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

// Project type definition
interface Project {
  id?: number;
  title: string;
  year: number;
  description: string;
  details?: string;
  languages: string[];
  image: { src: string };
  githubLink?: string;
  liveLink?: string;
  created_at?: string;
  updated_at?: string;
}

// Projects list component for admin
const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const adminAuth = localStorage.getItem('adminAuth')
    if (!adminAuth) {
      router.push('/admin')
      return
    }
    
    // Fetch projects
    fetchProjects()
    
    setIsAuthenticated(true)
    setIsLoading(false)
  }, [router])

  const fetchProjects = async () => {
    try {
      // Fetch projects from API
      const response = await fetch('/api/projects')
      const data = await response.json()
      
      if (data.success) {
        setProjects(data.projects || [])
      } else {
        console.error('Failed to fetch projects:', data.error)
        setProjects([])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([])
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: 'DELETE',
        })
        const data = await response.json()
        
        if (data.success) {
          // Refresh the projects list
          fetchProjects()
        } else {
          throw new Error(data.error || 'Failed to delete project')
        }
      } catch (error) {
        console.error('Error deleting project:', error)
        alert('Failed to delete project. Please try again.')
      }
    }
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
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard" className="text-xl font-bold">
              Admin <span className="text-violet-500">Dashboard</span>
            </Link>
            <span className="text-gray-500">/</span>
            <h1 className="text-xl font-bold">Projects Management</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              View Site
            </Link>
            <button 
              onClick={() => {
                localStorage.removeItem('adminAuth')
                router.push('/admin')
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Projects</h2>
          <Link
            href="/admin/projects/new"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center"
          >
            <span className="mr-2">+</span> Add New Project
          </Link>
        </div>

        {/* Projects Table */}
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Project
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Year
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Technologies
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {projects.length > 0 ? (
                  projects.map((project) => project && (
                    <tr key={project?.id || Math.random()} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            <Image 
                              src={typeof project?.image?.src === 'string' && project.image.src.startsWith('/') 
                                ? project.image.src 
                                : '/proj1.png'} 
                              alt={project?.title || "Project thumbnail"}
                              width={40}
                              height={40}
                              className="rounded object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium">{project?.title || "Untitled Project"}</div>
                            <div className="text-sm text-gray-400 truncate max-w-xs">{project?.description || "No description available"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{project?.year || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {project?.languages?.map((lang, idx) => (
                            <span key={idx} className="px-2 py-1 text-xs bg-violet-500/20 text-violet-400 rounded-full">
                              {lang}
                            </span>
                          )) || <span className="text-gray-400">No technologies listed</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link 
                            href={`/admin/projects/edit/${project?.id || 0}`}
                            className="text-blue-500 hover:text-blue-400 transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => project?.id && handleDelete(project.id)}
                            className="text-red-500 hover:text-red-400 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                      No projects found. <Link href="/admin/projects/new" className="text-blue-500">Create one</Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminProjects