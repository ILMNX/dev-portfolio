'use client'

import React from 'react'
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

const ProjectsPage = () => {
    return (
        <>
            <div className="min-h-screen bg-black text-white py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <Link 
                        href="/"
                        className="inline-flex items-center text-violet-500 hover:text-violet-400 mb-8"
                    >
                        ← Back to Home
                    </Link>

                    <h1 className="text-6xl font-bold mb-16 text-center">My <span className="text-gray-500">Projects</span></h1>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project, index) => (
                            <Link href={`/projects/${project.id}`} key={project.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-gray-900 rounded-xl overflow-hidden group"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={project.image.src}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <p className="text-gray-400 text-sm mb-2">{project.year}</p>
                                        <h2 className="text-2xl font-bold mb-3 group-hover:text-violet-500 transition-colors">
                                            {project.title}
                                        </h2>
                                        <p className="text-gray-400 mb-4 line-clamp-2">
                                            {project.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.languages.map((lang, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-sm"
                                                >
                                                    {lang}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ProjectsPage 