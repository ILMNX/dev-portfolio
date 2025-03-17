"use client"

import React,{useState,useEffect} from "react"
import Image from "next/image"
import Link from "next/link"
import proj1 from "@/public/project1.png"
import proj2 from "@/public/project2.png"
import proj3 from "@/public/proj3.png"
import { useMotionTemplate, useMotionValue, motion, animate } from "framer-motion"

const projects = [
    {id:1, year: 2024, title: "E-Retirement", description: "E-retirement is platform created to manage retirement funds", image: proj1},
    {id:2, year: 2024, title: "ChatGPT Table Maker", description: "ChatGPT Table Maker is a tool that allows you to copy table in ChatGPT and paste it in word or excel table format", image: proj2}, 
    {id:3, year: 2024, title: "Plant data extraction", description: "Plant data extraction is a tool that allows you to extract data from plant pdf using python", image: proj3}
]

export const Portfolio = () => {
    const [selectedProject, setSelectedProject] = useState(projects[0])
    const COLORS_TOP = ["#00ffbb", "#4444ff", "#ff44ff", "#ff4444"]
    const COLORS_BOTTOM = ["#000833", "#000833", "#330033", "#330033"]
    const primaryColor = useMotionValue(COLORS_TOP[0])
    const secondaryColor = useMotionValue(COLORS_BOTTOM[0])

    useEffect(() => {
        animate(primaryColor, COLORS_TOP, {
            ease: "easeInOut",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror"
        })

        animate(secondaryColor, COLORS_BOTTOM, {
            ease: "easeInOut",
            duration: 15, 
            repeat: Infinity,
            repeatType: "mirror"
        })
    }, [])
    const backgroundImage = useMotionTemplate`
        linear-gradient(
            45deg,
            ${secondaryColor} 0%,
            ${primaryColor} 35%,
            ${secondaryColor} 50%,
            ${primaryColor} 65%,
            ${secondaryColor} 100%
        ),
        radial-gradient(
            circle at top right,
            ${primaryColor} 0%,
            transparent 50%
        ),
        radial-gradient(
            circle at bottom left,
            ${secondaryColor} 0%,
            transparent 50%
        )
    `

    return(
        <motion.section  style={{
            backgroundImage,
            backgroundBlendMode: "overlay",
            backgroundSize: "200% 200%"
        }}
        animate={{
            backgroundPosition: ["0% 0%", "100% 100%"]
        }}
        transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
        }}
        className="py-32 text-white relative "
        id="portfolio">
            <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12">
                <div>

                    <h2 className="text-6xl font-bold mb-10">Selected <span className="text-gray-400">Projects</span></h2>
                    {projects.map((project) => (
                        <div 
                            key={project.id} 
                            onClick={() => setSelectedProject(project)}
                            className="cursoir-pointer mb-8 group"
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

                <Image
                    src={selectedProject.image.src}
                    alt={selectedProject.title}
                    className="rounded-xl shadow-lg transition-opacity duration-500 ease-in-out"
                    width={800}
                    height={450}
                />
            </div>
        </motion.section>
    )
}

