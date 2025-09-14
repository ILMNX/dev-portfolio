'use client'

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Footer } from '@/components/Footer'

// Define the Project type
interface Project {
  id: number
  year: number
  title: string
  description: string
    category?: string
  image: { src: string } | string | null | undefined
  languages: string[]
  details: string
  githubLink: string
  liveLink: string
}

// Helper function to ensure valid image URLs (updated for Azure support)
const getValidImageSrc = (project: Project | null): string => {
  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
  
  try {
    if (!project) {
      console.log('Missing project data');
      return fallbackImage;
    }

    console.log('Processing image for project:', project.title);
    console.log('Image data:', project.image);
    
    if (!project.image) {
      console.log('No image data found');
      return fallbackImage;
    }
    
    // Handle object with src property
    if (typeof project.image === 'object' && project.image !== null) {
      if (!project.image.src || typeof project.image.src !== 'string') {
        console.log('Invalid src property in image object');
        return fallbackImage;
      }
      
      const src = project.image.src;
      console.log('Valid image src from object:', src);
      
      // Check if it's an Azure blob URL
      if (src.includes('.blob.core.windows.net')) {
        console.log('✅ Azure blob URL detected:', src);
        return src;
      }
      
      // Check if it's a local upload
      if (src.includes('uploads/')) {
        return src.startsWith('/') ? src : '/' + src;
      }
      
      // Check if it's an absolute URL
      if (src.startsWith('http')) {
        return src;
      }
      
      return src.startsWith('/') ? src : '/' + src;
    }
    
    // Handle direct string
    if (typeof project.image === 'string') {
      const src = project.image;
      
      if (!src.trim() || src.includes('[object Object]')) {
        return fallbackImage;
      }
      
      // Check if it's an Azure blob URL
      if (src.includes('.blob.core.windows.net')) {
        console.log('✅ Azure blob URL from string:', src);
        return src;
      }
      
      // Check if it's a local upload
      if (src.includes('uploads/')) {
        return src.startsWith('/') ? src : '/' + src;
      }
      
      // Check if it's an absolute URL
      if (src.startsWith('http')) {
        return src;
      }
      
      return src.startsWith('/') ? src : '/' + src;
    }
    
    return fallbackImage;
  } catch (error) {
    console.error('Error processing image source:', error);
    return fallbackImage;
  }
};

const ProjectDetail = (props: { params: Promise<{ id: string }> }) => {
    const params = use(props.params);
    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentImage, setCurrentImage] = useState(0)
    const [direction, setDirection] = useState(0)

    useEffect(() => {
        const fetchProject = async () => {
            try {
                console.log(`Fetching project with ID: ${params.id}...`)
                const res = await fetch(`/api/projects/${params.id}`)
                const data = await res.json()
                
                console.log('Project API response:', data);
                
                if (data.success) {
                    console.log('Successfully fetched project:', data.project.title)
                    console.log('Project image data:', data.project.image);
                    setProject(data.project)
                } else {
                    console.error('Failed to fetch project:', data.error)
                    setError(data.error || 'Failed to load project')
                }
            } catch (error) {
                console.error('Error fetching project:', error)
                setError('An unexpected error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchProject()
    }, [params.id])

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white py-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading project...</p>
                </div>
            </div>
        )
    }

    if (error || !project) {
        return (
            <div className="min-h-screen bg-black text-white py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="mb-8">
                        <Link 
                            href="/projects"
                            className="inline-flex items-center text-violet-500 hover:text-violet-400"
                        >
                            ← Back to Projects
                        </Link>
                    </div>
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
                    <p className="text-gray-400">{error || 'Project not found'}</p>
                </div>
            </div>
        )
    }

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    }

    const swipeConfidenceThreshold = 10000
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity
    }

    const paginate = (newDirection: number) => {
        setDirection(newDirection)
        setCurrentImage((prev) => (prev + newDirection + 1) % 1)
    }

    return (
        <>
            <div className="min-h-screen bg-black text-white py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-4 mb-8">
                        <Link 
                            href="/"
                            className="inline-flex items-center text-violet-500 hover:text-violet-400"
                        >
                            ← Back to Home
                        </Link>
                        <span className="text-gray-500">|</span>
                        <Link 
                            href="/projects"
                            className="inline-flex items-center text-violet-500 hover:text-violet-400"
                        >
                            Back to Projects
                        </Link>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Carousel Section - Fixed to use regular img tag */}
                        <div className="relative h-[500px] overflow-hidden rounded-xl bg-gray-800">
                            <motion.div
                                key={currentImage}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 }
                                }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={1}
                                onDragEnd={(e, { offset, velocity }) => {
                                    const swipe = swipePower(offset.x, velocity.x)
                                    if (swipe < -swipeConfidenceThreshold) {
                                        paginate(1)
                                    } else if (swipe > swipeConfidenceThreshold) {
                                        paginate(-1)
                                    }
                                }}
                                className="absolute w-full h-full"
                            >
                                {/* Replace Next.js Image with regular img tag for Azure support */}
                                <img
                                    src={getValidImageSrc(project)}
                                    alt={project.title}
                                    className="w-full h-full object-cover rounded-xl"
                                    style={{
                                        objectFit: 'cover',
                                        width: '100%',
                                        height: '100%'
                                    }}
                                    onLoad={() => {
                                        console.log('✅ Project detail image loaded successfully');
                                    }}
                                    onError={(e) => {
                                        console.error('❌ Project detail image failed to load:', e.currentTarget.src);
                                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                                    }}
                                />
                            </motion.div>

                            {/* Navigation Buttons */}
                            <button
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-violet-500 p-2 rounded-full opacity-75 hover:opacity-100 transition-opacity"
                                onClick={() => paginate(-1)}
                            >
                                ←
                            </button>
                            <button
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-violet-500 p-2 rounded-full opacity-75 hover:opacity-100 transition-opacity"
                                onClick={() => paginate(1)}
                            >
                                →
                            </button>
                        </div>

                        {/* Project Details Section */}
                        <div className="bg-gray-900 p-8 rounded-xl">
                            <div className="mb-6">
                                <p className="text-gray-400 text-lg">{project.year}</p>
                                <h2 className="text-4xl font-bold mb-4">{project.title}</h2>
                                <p className="text-gray-300 mb-6">{project.details}</p>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-3">Technologies Used</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.languages.map((lang, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-violet-500 rounded-full text-sm"
                                        >
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Debug info */}
                            <div className="mb-6 p-3 bg-gray-800 rounded text-xs">
                                <p><strong>Image URL:</strong> {getValidImageSrc(project)}</p>
                                <p><strong>Raw Image Data:</strong> {JSON.stringify(project.image)}</p>
                            </div>

                            <div className="flex gap-4">
                                {project.githubLink && (
                                    <a
                                        href={project.githubLink}
                                        className="px-6 py-2 bg-violet-500 rounded-lg hover:bg-violet-600 transition-colors"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        GitHub
                                    </a>
                                )}
                                {project.liveLink && (
                                    <a
                                        href={project.liveLink}
                                        className="px-6 py-2 bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Live Demo
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ProjectDetail