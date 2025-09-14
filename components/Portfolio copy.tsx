"use client"

import React, { Fragment, useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Dialog, Transition } from "@headlessui/react"

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
    category?: string
}

export const Portfolio = () => {
    const [projects, setProjects] = useState<Project[]>([])
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [showDetails, setShowDetails] = useState(true)
    const [showModal, setShowModal] = useState(false)

    // Category options (can be null/empty for now)
    const categories = ['Web', 'Machine Learning & AI', 'Data', 'Mobile', 'Others']

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
                
                if (src.includes('uploads/')) {
                    return src.startsWith('/') ? src : '/' + src;
                }
                
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
                
                if (src.includes('uploads/')) {
                    return src.startsWith('/') ? src : '/' + src;
                }
                
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

    // Filter projects based on active category
    const filteredProjects = activeCategory && activeCategory !== 'Others' 
        ? projects.filter(project => project.category === activeCategory)
        : projects;

    if (loading) {
        return (
            <section id="portfolio" className="py-32 min-h-screen flex items-center justify-center" 
                     style={{ background: '#222046' }}>
                <div className="text-center">
                    <h2 className="text-6xl font-bold mb-10 text-white">Selected <span className="text-gray-200">Projects</span></h2>
                    <div className="flex justify-center items-center py-16">
                        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
            </section>
        )
    }

    if (projects.length === 0 || !selectedProject) {
        return (
            <section id="portfolio" className="py-32 min-h-screen flex items-center justify-center" 
                     style={{ background: '#222046' }}>
                <div className="text-center">
                    <h2 className="text-6xl font-bold mb-10 text-white">Selected <span className="text-gray-200">Projects</span></h2>
                    <p className="text-gray-400 text-xl py-16">No projects found. Check back later!</p>
                </div>
            </section>
        )
    }

    return (
        <section className="min-h-screen py-16 relative overflow-hidden text-white" 
                 style={{ background: '#222046' }} id="portfolio">
            <div className="relative z-10 max-w-7xl mx-auto px-4 h-full">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl font-bold text-white"
                    >
                        Selected Projects
                    </motion.h2>
                </div>

                {/* Main Layout Container */}
                <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[800px] px-2 lg:px-6">
                    {/* Left Side - Project Cards */}
                    <div className="lg:w-2/5 space-y-4 max-h-[700px] overflow-visible pr-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                        {filteredProjects.map((project) => (
                            <motion.div
                                key={project.id}
                                onClick={() => setSelectedProject(project)}
                                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                                    selectedProject.id === project.id 
                                        ? 'bg-[#7875A2] shadow-lg transform scale-[1.02]' 
                                        : 'bg-gray-700/60 hover:bg-gray-600/60'
                                }`}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h3 className="text-lg font-bold text-white mb-3">
                                    {project.title}
                                </h3>
                                <p className="text-white/80 text-md leading-relaxed mb-4">
                                    {project.description}
                                </p>
                                
                                {/* Technologies */}
                                {project.languages && project.languages.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {project.languages.slice(0, 2).map((lang, idx) => (
                                            <span 
                                                key={idx} 
                                                className="px-4 py-2 rounded-2xl text-white text-sm"
                                                style={{ background: '#222046' }}
                                            >
                                                {lang}
                                            </span>
                                        ))}
                                        {project.languages.length > 2 && (
                                            <span 
                                                className="px-4 py-2 rounded-2xl text-white text-sm"
                                                style={{ background: '#222046' }}
                                            >
                                                +{project.languages.length - 2}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Side - Project Details */}
                    <div className="lg:w-4/5 space-y-6">
                        {/* Category Filter Bar */}
                        <motion.div 
                            className="p-4 rounded-2xl bg-gray-700/60"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex flex-wrap justify-center gap-4">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                                        className={`px-6 py-3 rounded-lg text-lg text-center transition-all duration-300 ${
                                            activeCategory === category
                                                ? 'bg-white text-gray-800 font-semibold'
                                                : 'text-white hover:bg-white/10'
                                        } ${category === 'Machine Learning & AI' ? 'text-base' : ''}`}
                                        disabled // Disabled for now since categories are not implemented
                                        style={{ opacity: 0.5, cursor: 'not-allowed' }}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Main Project Display */}
                        <div className="bg-gray-700/60 rounded-2xl overflow-hidden h-[500px] relative">
                            {/* Hide Details & Maximize Buttons */}
                            <div className="absolute top-4 right-4 z-20 flex gap-2">
                                <button
                                    onClick={() => setShowDetails((prev) => !prev)}
                                    className="bg-black/60 hover:bg-black/80 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 font-semibold text-sm"
                                    aria-label={showDetails ? "Hide Details" : "Show Details"}
                                >
                                    {showDetails ? "Hide Details" : "Show Details"}
                                </button>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="bg-violet-600/80 hover:bg-violet-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 font-semibold text-sm"
                                    aria-label="Maximize Project"
                                >
                                    Maximize
                                </button>
                            </div>
                            {/* Single Project Display */}
                            <div className="h-full w-full relative overflow-hidden">
                                {/* Project Image/GIF */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={getValidImageSrc(selectedProject)}
                                    alt={selectedProject.title}
                                    className="w-full h-full object-cover transition-all duration-500"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                                {/* Project Info Overlay */}
                                {showDetails && (
                                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                    <div className="space-y-4 text-left max-w-4xl">
                                        {/* Project Title and Description */}
                                        <div>
                                            <motion.h3 
                                                key={`title-${selectedProject.id}`}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5 }}
                                                className="text-sm md:text-lg lg:text-md font-bold text-white mb-2"
                                            >
                                                {selectedProject.title}
                                            </motion.h3>
                                            <motion.p 
                                                key={`desc-${selectedProject.id}`}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.1 }}
                                                className="text-white/90 text-sm md:text-base lg:text-xs leading-relaxed max-w-2xl"
                                            >
                                                {selectedProject.details || selectedProject.description}
                                            </motion.p>
                                        </div>

                                        {/* Technologies and Action Buttons */}
                                        <motion.div 
                                            key={`actions-${selectedProject.id}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
                                        >
                                            {/* Technologies */}
                                            {selectedProject.languages && selectedProject.languages.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedProject.languages.map((lang, idx) => (
                                                        <span 
                                                            key={idx} 
                                                            className="px-3 py-1 rounded-lg text-white text-xs md:text-sm backdrop-blur-sm"
                                                            style={{ background: 'rgba(34, 32, 70, 0.8)' }}
                                                        >
                                                            {lang}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex gap-3">
                                                {selectedProject.liveLink && (
                                                    <Link href={selectedProject.liveLink} target="_blank">
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="px-4 py-2 bg-violet-500/90 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-violet-600 transition-colors text-sm md:text-base"
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
                                                            className="px-4 py-2 bg-black/50 backdrop-blur-sm border-2 border-white/30 text-white rounded-lg font-semibold hover:bg-black/70 hover:border-white/50 transition-colors text-sm md:text-base"
                                                        >
                                                            View Code
                                                        </motion.button>
                                                    </Link>
                                                )}
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                                )}
                            </div>
                        </div>
                        {/* Modal for Full View */}
                        <Transition show={showModal} as={Fragment}>
                            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={() => setShowModal(false)}>
                                <div className="flex items-center justify-center min-h-screen px-4">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
                                    </Transition.Child>
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        <div className="relative bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full mx-auto overflow-hidden">
                                            {/* Close Button */}
                                            <button
                                                onClick={() => setShowModal(false)}
                                                className="absolute top-4 right-4 z-10 bg-black/70 hover:bg-black/90 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 font-semibold text-sm"
                                                aria-label="Close Full View"
                                            >
                                                Close
                                            </button>
                                            {/* Full Project Image */}
                                            <img
                                                src={getValidImageSrc(selectedProject)}
                                                alt={selectedProject.title}
                                                className="w-full h-[400px] object-cover"
                                            />
                                            {/* Info Overlay */}
                                            <div className="p-8">
                                                <h2 className="text-lg font-bold mb-4">{selectedProject.title}</h2>
                                                <p className="text-white/90 mb-4 text-sm">{selectedProject.details || selectedProject.description}</p>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {selectedProject.languages?.map((lang, idx) => (
                                                        <span key={idx} className="px-3 py-1 rounded-lg text-white text-xs md:text-sm backdrop-blur-sm" style={{ background: 'rgba(34, 32, 70, 0.8)' }}>
                                                            {lang}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex gap-3">
                                                    {selectedProject.liveLink && (
                                                        <Link href={selectedProject.liveLink} target="_blank">
                                                            <button className="px-4 py-2 bg-violet-500/90 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-violet-600 transition-colors text-sm md:text-base">
                                                                Live Demo
                                                            </button>
                                                        </Link>
                                                    )}
                                                    {selectedProject.githubLink && (
                                                        <Link href={selectedProject.githubLink} target="_blank">
                                                            <button className="px-4 py-2 bg-black/50 backdrop-blur-sm border-2 border-white/30 text-white rounded-lg font-semibold hover:bg-black/70 hover:border-white/50 transition-colors text-sm md:text-base">
                                                                View Code
                                                            </button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Transition.Child>
                                </div>
                            </Dialog>
                        </Transition>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center pt-16">
                    <Link href="/projects" className="inline-block">
                        <motion.button
                            whileHover={{ 
                                scale: 1.05,
                                boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="px-12 py-5 bg-gradient-to-r from-violet-500 via-violet-600 to-violet-500 
                                    text-white rounded-xl font-semibold relative overflow-hidden group
                                    transition-all duration-300 ease-out text-lg shadow-lg"
                        >
                            <span className="relative z-10">Explore All Projects</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-violet-500 to-violet-600 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.button>
                    </Link>
                </div>
            </div>
        </section>
    )
}