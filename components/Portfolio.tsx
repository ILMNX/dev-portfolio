"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

// Project type definition
interface Project {
    id: number
    year: number
    title: string
    description: string
    image: { src: string } | string
    languages: string[]
    details?: string
    githubLink?: string
    liveLink?: string
}

// Image animation variants
const imageVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.8,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5
        }
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.8,
        transition: {
            duration: 0.5
        }
    })
}

export const Portfolio = () => {
    const [projects, setProjects] = useState<Project[]>([])
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)
    const [direction, setDirection] = useState(0)
    const carouselRef = useRef(null)

    // Fetch projects from the API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                console.log('Portfolio component: Fetching selected projects from API...')
                const baseUrl = window.location.origin;
                const res = await fetch(`${baseUrl}/api/projects/selected`)
                const data = await res.json()
                
                if (data.success && data.projects?.length > 0) {
                    console.log('Portfolio component: Successfully fetched selected projects:', data.projects.length)
                    setProjects(data.projects)
                    setSelectedProject(data.projects[0])
                } else {
                    console.error('Portfolio component: Failed to fetch selected projects or no projects found:', data)
                }
            } catch (error) {
                console.error('Portfolio component: Error fetching selected projects:', error)
            } finally {
                setLoading(false)
            }
        }
        
        fetchProjects()
    }, [])
    
    const handlePrevProject = () => {
        if (!selectedProject || projects.length <= 1) return
        
        setDirection(-1)
        const currentIndex = projects.findIndex(p => p.id === selectedProject.id)
        const newIndex = currentIndex <= 0 ? projects.length - 1 : currentIndex - 1
        setSelectedProject(projects[newIndex])
    }

    const handleNextProject = () => {
        if (!selectedProject || projects.length <= 1) return
        
        setDirection(1)
        const currentIndex = projects.findIndex(p => p.id === selectedProject.id)
        const newIndex = (currentIndex + 1) % projects.length
        setSelectedProject(projects[newIndex])
    }

    const getValidImageSrc = (project: Project | null): string => {
        const fallbackImage = '/proj1.gif';
        
        try {
            if (!project) {
                console.log('Missing project data');
                return fallbackImage;
            }

            console.log('Portfolio component - Processing image for project:', project.title);
            
            if (!project.image) {
                console.log('No image data found');
                return fallbackImage;
            }
            
            if (typeof project.image === 'object' && project.image !== null) {
                if (!project.image.src || typeof project.image.src !== 'string') {
                    console.log('Invalid src property in image object');
                    return fallbackImage;
                }
                
                const src = project.image.src;
                console.log('Valid image src from object:', src);
                
                // Check if it's an Azure blob URL
                if (src.includes('.blob.core.windows.net')) {
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
            
            if (typeof project.image === 'string') {
                const src = project.image;
                
                if (!src.trim() || src.includes('[object Object]')) {
                    return fallbackImage;
                }
                
                // Check if it's an Azure blob URL
                if (src.includes('.blob.core.windows.net')) {
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

    if (loading) {
        return (
            <section id="portfolio" className="py-32 bg-black text-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-6xl font-bold mb-10">Selected <span className="text-gray-200">Projects</span></h2>
                    <div className="flex justify-center items-center py-16">
                        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
            </section>
        )
    }

    if (projects.length === 0 || !selectedProject) {
        return (
            <section id="portfolio" className="py-32 bg-black text-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-6xl font-bold mb-10">Selected <span className="text-gray-200">Projects</span></h2>
                    <p className="text-gray-400 text-xl py-16">No projects found. Check back later!</p>
                </div>
            </section>
        )
    }

    return(
        <section className="py-16 md:py-32 relative overflow-hidden bg-gradient-to-br from-[#18181b] via-[#23234a] to-[#18181b] text-white" id="portfolio">
            <div className="relative z-10 max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16 md:mb-24">
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        Selected <span className="text-gray-200">Projects</span>
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                        Discover my latest work showcasing innovative solutions and creative development
                    </p>
                </div>

                {/* Main Content Layout */}
                <div className="space-y-16 md:space-y-24">
                    {/* Full-width GIF Container */}
                    <div className="relative w-full h-[50vh] md:h-[70vh] lg:h-[80vh] rounded-2xl overflow-hidden shadow-2xl" ref={carouselRef}>
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={selectedProject.id}
                                custom={direction}
                                variants={imageVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="w-full h-full absolute inset-0"
                            >
                                <div className="relative w-full h-full group">
                                    <img
                                        src={getValidImageSrc(selectedProject)}
                                        alt={selectedProject.title}
                                        className="object-cover w-full h-full transition-all duration-500 group-hover:scale-105"
                                    />
                                    
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    
                                    {/* Project Info Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12">
                                        <div className="max-w-4xl">
                                            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                                                <div className="flex-1">
                                                    <p className="text-violet-300 text-sm md:text-base font-medium mb-2">
                                                        {selectedProject.year}
                                                    </p>
                                                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                                                        {selectedProject.title}
                                                    </h3>
                                                    <p className="text-gray-200 text-base md:text-lg leading-relaxed max-w-2xl">
                                                        {selectedProject.description}
                                                    </p>
                                                    
                                                    {/* Technologies */}
                                                    {selectedProject.languages && (
                                                        <div className="flex flex-wrap gap-2 mt-6">
                                                            {selectedProject.languages.map((lang, idx) => (
                                                                <span 
                                                                    key={idx} 
                                                                    className="px-3 py-1 bg-violet-500/30 backdrop-blur-sm text-violet-200 rounded-full text-sm font-medium"
                                                                >
                                                                    {lang}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Action Buttons */}
                                                <div className="flex gap-3 md:flex-col lg:flex-row">
                                                    {selectedProject.liveLink && (
                                                        <Link href={selectedProject.liveLink} target="_blank">
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="px-6 py-3 bg-violet-500/90 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-violet-500 transition-colors"
                                                            >
                                                                Live Demo
                                                            </motion.button>
                                                        </Link>
                                                    )}
                                                    {selectedProject.githubLink && (
                                                        <Link href={selectedProject.githubLink} target="_blank">
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="px-6 py-3 bg-black/50 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-black/70 transition-colors border border-white/20"
                                                            >
                                                                View Code
                                                            </motion.button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Arrows */}
                        <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-6">
                            <motion.button 
                                onClick={handlePrevProject}
                                className="bg-black/30 backdrop-blur-sm text-white p-3 md:p-4 rounded-full hover:bg-black/50 transition-colors border border-white/20"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 18l-6-6 6-6"/>
                                </svg>
                            </motion.button>
                        </div>
                        
                        <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-6">
                            <motion.button 
                                onClick={handleNextProject}
                                className="bg-black/30 backdrop-blur-sm text-white p-3 md:p-4 rounded-full hover:bg-black/50 transition-colors border border-white/20"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 18l6-6-6-6"/>
                                </svg>
                            </motion.button>
                        </div>

                        {/* Dots Indicator */}
                        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                            {projects.map((project) => (
                                <button 
                                    key={project.id}
                                    onClick={() => setSelectedProject(project)}
                                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                                        selectedProject.id === project.id 
                                            ? 'bg-violet-400 scale-125' 
                                            : 'bg-white/50 hover:bg-white/80'
                                    }`}
                                    aria-label={`View ${project.title}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Project Selection Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {projects.map((project) => (
                            <motion.div 
                                key={project.id} 
                                onClick={() => setSelectedProject(project)}
                                className={`cursor-pointer p-6 md:p-8 rounded-xl border transition-all duration-300 hover:scale-105 ${
                                    selectedProject.id === project.id 
                                        ? 'bg-violet-500/10 border-violet-500/50 shadow-lg shadow-violet-500/20' 
                                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                }`}
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <p className="text-violet-300 text-sm font-medium mb-3">{project.year}</p>
                                <h3 className="text-xl md:text-2xl font-bold mb-4 text-white">
                                    {project.title}
                                </h3>
                                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                                    {project.description}
                                </p>
                                
                                {project.languages && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {project.languages.slice(0, 3).map((lang, idx) => (
                                            <span 
                                                key={idx} 
                                                className="px-2 py-1 bg-violet-500/20 text-violet-300 rounded text-xs"
                                            >
                                                {lang}
                                            </span>
                                        ))}
                                        {project.languages.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs">
                                                +{project.languages.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <div className="text-center pt-8 md:pt-16">
                        <Link href="/projects" className="inline-block">
                            <motion.button
                                whileHover={{ 
                                    scale: 1.05,
                                    boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)",
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-violet-500 via-violet-600 to-violet-500 
                                        text-white rounded-xl font-semibold relative overflow-hidden group
                                        transition-all duration-300 ease-out text-base md:text-lg shadow-lg"
                            >
                                <span className="relative z-10">Explore All Projects</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-violet-500 to-violet-600 
                                            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] 
                                            bg-[length:250%_250%] group-hover:bg-[position:100%_100%] transition-[background-position] duration-500" />
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

