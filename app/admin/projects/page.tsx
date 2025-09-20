'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Project type definition
interface Project {
  id?: number;
  title: string;
  year: number;
  description: string;
  details?: string;
  category?: string;
  languages: string[];
  image: { src: string };
  githubLink?: string;
  liveLink?: string;
  created_at?: string;
  updated_at?: string;
}

// Helper function to get valid image URL (updated for local storage)
const getValidImageUrl = (image: { src: string } | string): string => {
  
  // Default fallback
  const fallback = '/proj1.gif';
  
  // Handle image object with src property
  if (typeof image === 'object' && image !== null && 'src' in image) {
    const src = image.src;
    
    if (!src || src.trim() === '') {
      return fallback;
    }
    
    // Check if it's a local upload path
    if (src.includes('/uploads/')) {
      return src;
    }
    
    // If it's a full URL or already has a leading slash, return as is
    if (src.startsWith('http') || src.startsWith('/')) {
      return src;
    }
    
    // Otherwise, add a leading slash
    return '/' + src;
  }
  
  // Handle direct string path
  if (typeof image === 'string') {
    
    if (!image || image.trim() === '') {
      return fallback;
    }
    
    // Check if it's a local upload path
    if (image.includes('/uploads/')) {
      return image;
    }
    
    if (image.startsWith('http') || image.startsWith('/')) {
      return image;
    }
    
    return '/' + image;
  }
  
  return fallback;
};

// Helper function to check if file is a video
const isVideoFile = (url: string): boolean => {
  return url.includes('.webm') || url.includes('.mp4') || url.includes('.mov');
};

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
      const response = await fetch('/api/projects')
      const data = await response.json()
      
      
      if (data.success) {
        // Sort projects by created_at descending (newest first)
        const sortedProjects = [...(data.projects || [])].sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        setProjects(sortedProjects);
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
    return null
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
            <Link href="/admin/projects/selected" className="text-gray-400 hover:text-white transition-colors">
              Manage Selected
            </Link>
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
          <h2 className="text-2xl font-bold">Projects ({projects.length})</h2>
          <Link
            href="/admin/projects/new"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center"
          >
            <span className="mr-2">+</span> Add New Project
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length > 0 ? (
            projects.map((project) => project && (
              <div key={project?.id || Math.random()} className="bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-colors">
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden bg-gray-800">
                  {isVideoFile(getValidImageUrl(project?.image)) ? (
                    <video 
                      src={getValidImageUrl(project?.image)}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      style={{ 
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%'
                      }}
                      autoPlay
                      loop
                      muted
                      playsInline
                      // onLoadedData={() => {
                      //   console.log(`✅ Video loaded successfully for ${project.title}:`, getValidImageUrl(project?.image));
                      // }}
                      onError={(e) => {
                        console.error(`❌ Video failed to load for ${project.title}:`, getValidImageUrl(project?.image));
                        // You could set a fallback here if needed
                        e.currentTarget.style.display = 'none'; // Hide the video element
                      }}
                    />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={getValidImageUrl(project?.image)} 
                      alt={project?.title || "Project thumbnail"}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      style={{ 
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%'
                      }}
                      // onLoad={() => {
                      //   console.log(`✅ Image loaded successfully for ${project.title}:`, getValidImageUrl(project?.image));
                      // }}
                      onError={(e) => {
                        // Set fallback image
                        if (!e.currentTarget.src.includes('proj1.gif')) {
                          e.currentTarget.src = '/proj1.gif';
                        }
                      }}
                    />
                  )}
                  
                  {/* Debug overlay */}
                  {/* <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-xs p-1 rounded">
                    ID: {project.id}
                  </div> */}
                </div>
                
                {/* Project Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white">{project?.title || "Untitled Project"}</h3>
                    <span className="text-sm text-gray-400">{project?.year || "N/A"}</span>
                  </div>
                  
                  <p className="text-gray-400 mb-4">{project?.description || "No description available"}</p>
                  
                  Debug: Show raw image data
                  <div className="text-xs text-gray-500 mb-2 p-2 bg-gray-800 rounded">
                    <strong>Image Data:</strong> {JSON.stringify(project.image)}
                    <br />
                    <strong>Processed URL:</strong> {getValidImageUrl(project.image)}
                  </div>

                  {/* Category */}
                  <div className="text-xs text-gray-500 mb-2 p-2 bg-gray-800 rounded">
                    <strong>Category:</strong> {project?.category || "Uncategorized"}
                  </div>
                   <div className="text-xs text-gray-500 mb-2 p-2 bg-gray-800 rounded">
                    <strong>Created At:</strong> {project?.created_at || "null"}
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project?.languages?.slice(0, 3).map((lang, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs bg-violet-500/20 text-violet-400 rounded-full">
                        {lang}
                      </span>
                    ))}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Link 
                        href={`/admin/projects/edit/${project?.id || 0}`}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => project?.id && handleDelete(project.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-400">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-xl font-semibold mb-2">No projects found</h3>
              <p className="mb-4">Get started by creating your first project.</p>
              <Link 
                href="/admin/projects/new" 
                className="inline-block px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
              >
                Create Your First Project
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminProjects