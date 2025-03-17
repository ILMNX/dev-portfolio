'use client'

import React, { useState, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import proj1 from '@/public/project1.png'
import proj2 from '@/public/project2.png'
import proj3 from '@/public/proj3.png'
import { Footer } from '@/components/Footer'

const projects = [
    {
        id: 1,
        year: 2024,
        title: "E-Retirement",
        description: "E-retirement is platform created to manage retirement funds",
        image: proj1,
        languages: ["React", "Node.js", "MongoDB"],
        details: "A comprehensive retirement fund management platform that helps users track and manage their retirement savings, investments, and benefits.",
        githubLink: "#",
        liveLink: "#"
    },
    {
        id: 2,
        year: 2024,
        title: "ChatGPT Table Maker",
        description: "ChatGPT Table Maker is a tool that allows you to copy table in ChatGPT and paste it in word or excel table format",
        image: proj2,
        languages: ["JavaScript", "HTML", "CSS"],
        details: "A utility tool that converts ChatGPT table outputs into formatted tables compatible with Microsoft Word and Excel.",
        githubLink: "#",
        liveLink: "#"
    },
    {
        id: 3,
        year: 2024,
        title: "Plant data extraction",
        description: "Plant data extraction is a tool that allows you to extract data from plant pdf using python",
        image: proj3,
        languages: ["Python", "PyPDF2", "Pandas"],
        details: "An automated tool that extracts and processes plant-related data from PDF documents using Python's data processing capabilities.",
        githubLink: "#",
        liveLink: "#"
    }
]

const ProjectDetail = ({ params }: { params: Promise<{ id: string }> }) => {
    const resolvedParams = use(params)
    const project = projects.find(p => p.id === parseInt(resolvedParams.id))
    const [currentImage, setCurrentImage] = useState(0)
    const [direction, setDirection] = useState(0)

    if (!project) return <div>Project not found</div>

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
                        {/* Carousel Section */}
                        <div className="relative h-[500px] overflow-hidden rounded-xl">
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
                                <Image
                                    src={project.image.src}
                                    alt={project.title}
                                    fill
                                    className="object-cover rounded-xl"
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

                            <div className="flex gap-4">
                                <a
                                    href={project.githubLink}
                                    className="px-6 py-2 bg-violet-500 rounded-lg hover:bg-violet-600 transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    GitHub
                                </a>
                                <a
                                    href={project.liveLink}
                                    className="px-6 py-2 bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Live Demo
                                </a>
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