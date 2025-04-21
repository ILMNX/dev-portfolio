import React from 'react'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import ProjectsList from './ProjectsList' // This is now correctly importing from the same directory

// Fetch projects from the API (server-side)
async function getProjects() {
    try {
        console.log('Fetching projects from API...')
        // Fix: Use absolute URL with proper origin
        const baseUrl = process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}` 
            : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
            
        const res = await fetch(`${baseUrl}/api/projects`, {
            cache: 'no-store',
        })
        const data = await res.json()
        if (data.success) {
            console.log('Successfully fetched projects:', data.projects.length)
            return data.projects
        }
        console.error('Failed to fetch projects:', data)
        return []
    } catch (error) {
        console.error('Error fetching projects:', error)
        return []
    }
}

const ProjectsPage = async () => {
    const projects = await getProjects()
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
                    
                    {projects.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <p>No projects found. Add some projects to showcase your work!</p>
                        </div>
                    ) : (
                        <ProjectsList projects={projects} />
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ProjectsPage