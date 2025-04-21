"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useMotionTemplate, useMotionValue, motion, animate, AnimatePresence } from "framer-motion"

// Project type definition
interface Project {
    id: number
    year: number
    title: string
    description: string
    image: { src: string }
    languages: string[]
    details?: string
    githubLink?: string
    liveLink?: string
}

export const Portfolio = () => {
    const [projects, setProjects] = useState<Project[]>([])
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)
    const [direction, setDirection] = useState(0) // -1 for left, 1 for right
    const carouselRef = useRef(null)
    
    // Fetch projects from the API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                console.log('Portfolio component: Fetching projects from API...')
                // Fix: Use absolute URL with proper origin
                const baseUrl = window.location.origin;
                const res = await fetch(`${baseUrl}/api/projects`)
                const data = await res.json()
                
                if (data.success && data.projects?.length > 0) {
                    console.log('Portfolio component: Successfully fetched projects:', data.projects.length)
                    setProjects(data.projects)
                    setSelectedProject(data.projects[0])
                } else {
                    console.error('Portfolio component: Failed to fetch projects or no projects found:', data)
                }
            } catch (error) {
                console.error('Portfolio component: Error fetching projects:', error)
            } finally {
                setLoading(false)
            }
        }
        
        fetchProjects()
    }, [])
    
    // Vibrant color palette based on the image (purple, pink, blue, green)
    const colorPalette = {
        purples: ["#3a1c71", "#4C1D95", "#6D28D9", "#8B5CF6"],
        pinks: ["#EC4899", "#F472B6", "#DB2777", "#BE185D"],
        blues: ["#0284C7", "#38BDF8", "#0EA5E9", "#0369A1"],
        greens: ["#10B981", "#34D399", "#059669", "#047857"]
    }
    
    // Motion values for gradient positions and colors
    const gradientPos1 = useMotionValue(0)
    const gradientPos2 = useMotionValue(33)
    const gradientPos3 = useMotionValue(66)
    const gradientPos4 = useMotionValue(100)
    
    const color1 = useMotionValue(colorPalette.purples[0])
    const color2 = useMotionValue(colorPalette.pinks[0])
    const color3 = useMotionValue(colorPalette.blues[0]) 
    const color4 = useMotionValue(colorPalette.greens[0])
    
    // Values for breathing effect
    const gradientSize = useMotionValue(100)
    const gradientAngle = useMotionValue(130)

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

    useEffect(() => {
        // Animate gradient positions for movement
        animate(gradientPos1, [0, 10, 0], {
            ease: "easeInOut",
            duration: 20,
            repeat: Infinity,
            repeatType: "mirror"
        })
        
        animate(gradientPos2, [33, 28, 38, 33], {
            ease: "easeInOut",
            duration: 18,
            repeat: Infinity,
            repeatType: "mirror"
        })
        
        animate(gradientPos3, [66, 62, 72, 66], {
            ease: "easeInOut",
            duration: 22,
            repeat: Infinity,
            repeatType: "mirror"
        })
        
        animate(gradientPos4, [100, 95, 105, 100], {
            ease: "easeInOut",
            duration: 24,
            repeat: Infinity,
            repeatType: "mirror"
        })

        // Animate colors to cycle through their palettes
        animate(color1, colorPalette.purples, {
            ease: "easeInOut",
            duration: 15,
            repeat: Infinity,
            repeatType: "loop"
        })
        
        animate(color2, colorPalette.pinks, {
            ease: "easeInOut",
            duration: 18, 
            repeat: Infinity,
            repeatType: "loop"
        })
        
        animate(color3, colorPalette.blues, {
            ease: "easeInOut",
            duration: 17,
            repeat: Infinity,
            repeatType: "loop"
        })
        
        animate(color4, colorPalette.greens, {
            ease: "easeInOut",
            duration: 19,
            repeat: Infinity,
            repeatType: "loop"
        })

        // Animate angle for subtle rotation
        animate(gradientAngle, [130, 150, 130], {
            ease: "easeInOut",
            duration: 30,
            repeat: Infinity,
            repeatType: "mirror"
        })
        
        // Animate gradient size for breathing effect
        animate(gradientSize, [100, 120, 100], {
            ease: "easeInOut",
            duration: 12,
            repeat: Infinity,
            repeatType: "mirror"
        })
    }, [])

    // Helper function to ensure valid image URLs
    const getValidImageSrc = (project: Project | null): string => {
        // Default fallback image - always use absolute path
        const fallbackImage = '/proj1.png';
        
        try {
            // Safety check for missing project
            if (!project) {
                console.log('Missing project data');
                return fallbackImage;
            }

            // Log actual image data for debugging
            console.log('Image data type:', typeof project.image, 'Value:', project.image);
            
            // Case 1: No image data
            if (!project.image) {
                return fallbackImage;
            }
            
            // Case 2: Image is a string (direct path)
            if (typeof project.image === 'string') {
                // Ensure the string is not empty
                const imageStr = project.image as string;
                if (!imageStr.trim()) {
                    return fallbackImage;
                }
                
                // Handle relative paths - ensure they start with '/'
                // Using explicit type guard to avoid 'never' type issue
                const imgPath: string = imageStr;
                if (!imgPath.startsWith('/') && !imgPath.startsWith('http')) {
                    return '/' + imgPath;
                }
                
                return imgPath;
            }
            
            // Case 3: Image is an object with src property
            if (typeof project.image === 'object' && project.image !== null) {
                // Access the src property safely
                const src = project.image.src;
                
                // Ensure src exists and is a string
                if (!src || typeof src !== 'string') {
                    console.log('Invalid src property:', src);
                    return fallbackImage;
                }
                
                // Handle relative paths - ensure they start with '/'
                // Using explicit typing to avoid 'never' type issue
                const imgSrc: string = src;
                if (!imgSrc.startsWith('/') && !imgSrc.startsWith('http')) {
                    return '/' + imgSrc;
                }
                
                return imgSrc;
            }
            
            // Case 4: Unexpected image format
            console.log('Unexpected image format:', project.image);
            return fallbackImage;
        } catch (error) {
            console.error('Error processing image source:', error);
            return fallbackImage;
        }
    };

    // Vibrant breathing gradient based on the image
    const backgroundImage = useMotionTemplate`
        linear-gradient(
            ${gradientAngle}deg,
            ${color1} ${gradientPos1}%,
            ${color2} ${gradientPos2}%,
            ${color3} ${gradientPos3}%,
            ${color4} ${gradientPos4}%
        ),
        radial-gradient(
            circle at 25% 25%,
            ${color1}99 0%,
            transparent ${gradientSize}%
        ),
        radial-gradient(
            circle at 75% 75%,
            ${color3}99 0%,
            transparent ${gradientSize}%
        )
    `

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

    // Show loading spinner if loading or no projects
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

    // Handle no projects found
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
        <motion.section 
            style={{
                backgroundImage,
                backgroundSize: "300% 300%",
                position: "relative",
            }}
            animate={{
                backgroundPosition: ["0% 0%", "100% 100%"]
            }}
            transition={{
                duration: 30,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut"
            }}
            className="py-32 relative overflow-hidden text-white"
            id="portfolio"
        >
            <div className="relative z-10">
                <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-5">
                        <h2 className="text-6xl font-bold mb-10">Selected <span className="text-gray-200">Projects</span></h2>
                        {projects.map((project) => (
                            <div 
                                key={project.id} 
                                onClick={() => setSelectedProject(project)}
                                className="cursor-pointer mb-8 group"
                            >
                                <p className="text-gray-400 text-lg mb-2">{project.year}</p>
                                <h3 className={`text-3xl font-semibold group-hover:text-gray-400 transition-colors 
                                    ${selectedProject.id === project.id ? 'text-gray-200' : ''} duration-300`}>
                                    {project.title}
                                </h3>
                                {selectedProject.id === project.id && (
                                    <div className="border-b-2 border-gray-200 my-4"></div>
                                )}
                                {selectedProject.id === project.id && (
                                    <p className="text-gray-400 transition-colors duration-500 ease-in-out">
                                        {project.description}
                                    </p>
                                )}                    
                            
                            </div>
                        ))}

                        <Link href="/projects" className="inline-block">
                            <motion.button
                                whileHover={{ 
                                    scale: 1.05,
                                    boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)",
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-8 px-8 py-3 bg-gradient-to-r from-violet-500 via-violet-600 to-violet-500 
                                        text-white rounded-lg font-semibold relative overflow-hidden group
                                        transition-all duration-300 ease-out"
                            >
                                <span className="relative z-10">View All Projects</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-violet-500 to-violet-600 
                                            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] 
                                            bg-[length:250%_250%] group-hover:bg-[position:100%_100%] transition-[background-position] duration-500" />
                            </motion.button>
                        </Link>
                    </div>

                    <div className="lg:col-span-7 relative" ref={carouselRef}>
                        {/* Project image carousel */}
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={selectedProject.id}
                                custom={direction}
                                variants={imageVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="w-full h-full"
                            >
                                <div className="relative overflow-hidden rounded-xl group">
                                    <Image
                                        src={getValidImageSrc(selectedProject)}
                                        alt={selectedProject.title}
                                        className="object-cover w-full h-auto rounded-xl shadow-lg transition-all duration-500"
                                        width={1000}
                                        height={600}
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                        <div className="p-6 text-white w-full">
                                            <h3 className="text-2xl font-bold">{selectedProject.title}</h3>
                                            <p className="mt-2">{selectedProject.description}</p>
                                            {selectedProject.languages && (
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {selectedProject.languages.map((lang, idx) => (
                                                        <span key={idx} className="px-2 py-1 bg-violet-500/20 text-violet-300 rounded-full text-xs">
                                                            {lang}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Carousel Navigation */}
                        <div className="flex justify-between absolute top-1/2 w-full px-4 -translate-y-1/2 z-10">
                            <motion.button 
                                onClick={handlePrevProject}
                                className="bg-black/30 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/50 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 18l-6-6 6-6"/>
                                </svg>
                            </motion.button>
                            <motion.button 
                                onClick={handleNextProject}
                                className="bg-black/30 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/50 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 18l6-6-6-6"/>
                                </svg>
                            </motion.button>
                        </div>

                        {/* Dots indicator */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                            {projects.map((project) => (
                                <button 
                                    key={project.id}
                                    onClick={() => setSelectedProject(project)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                        selectedProject.id === project.id 
                                            ? 'bg-white scale-125' 
                                            : 'bg-white/50 hover:bg-white/80'
                                    }`}
                                    aria-label={`View ${project.title}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    )
}

