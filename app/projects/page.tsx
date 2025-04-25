import React from 'react'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import ProjectsList from './ProjectsList'
import { headers } from 'next/headers'

// Improved fetch projects function
async function getProjects() {
    try {
        console.log('Environment:', process.env.NODE_ENV);
        console.log('Fetching projects from API...');
        
        // Determine if we're in development or production
        const isDev = process.env.NODE_ENV === 'development';
        
        // Get the host from request headers when possible
        let baseUrl;
        try {
            const headersList = await headers();
            const host = headersList.get('host') || '';
            const protocol = host.includes('localhost') ? 'http://' : 'https://';
            baseUrl = `${protocol}${host}`;
            console.log('Using host from headers:', baseUrl);
        } catch (e) {
            // Fallback if headers() fails (can happen in certain contexts)
            baseUrl = isDev 
                ? 'http://localhost:3000' 
                : process.env.NEXT_PUBLIC_VERCEL_URL 
                    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
                    : '';
            console.log('Using fallback base URL:', baseUrl);
        }
        
        // Use a correctly constructed URL with explicit protocol
        const apiUrl = `${baseUrl}/api/projects`;
        console.log('API URL:', apiUrl);
        
        const res = await fetch(apiUrl, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!res.ok) {
            console.error('API response not OK:', res.status, res.statusText);
            return [];
        }
        
        const data = await res.json();
        if (data.success) {
            console.log('Successfully fetched projects:', data.projects.length);
            return data.projects;
        }
        
        console.error('Failed to fetch projects:', data);
        return [];
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

const ProjectsPage = async () => {
    const projects = await getProjects();
    
    // Add debug info visible on the page during development
    const isDev = process.env.NODE_ENV === 'development';
    
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
                    
                    {isDev && (
                        <div className="bg-gray-900 p-4 mb-8 rounded-lg">
                            <p className="text-sm text-gray-400">Debug info (dev only):</p>
                            <p className="text-sm text-gray-400">Projects count: {projects.length}</p>
                            <p className="text-sm text-gray-400">NODE_ENV: {process.env.NODE_ENV}</p>
                        </div>
                    )}
                    
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
    );
};

export default ProjectsPage;