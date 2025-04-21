'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Define the Project type
interface Project {
  id: number
  year: number
  title: string
  description: string
  image: { src: string } | string | null | undefined
  languages: string[]
  details?: string
  githubLink?: string
  liveLink?: string
}

interface ProjectsListProps {
  projects: Project[]
}

// Helper function to ensure valid image URLs
const getValidImageSrc = (project: Project): string => {
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
      if (!project.image.trim()) {
        return fallbackImage;
      }
      
      // Handle relative paths - ensure they start with '/'
      // Using explicit type guard to avoid 'never' type issue
      const imgPath: string = project.image;
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

const ProjectsList = ({ projects }: ProjectsListProps) => {
  // Add safety check for projects array
  if (!projects || !Array.isArray(projects)) {
    console.error('Invalid projects data:', projects);
    return (
      <div className="text-center py-12 text-gray-400">
        <p>Unable to display projects. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project: Project, index: number) => {
        // Get image source with extra logging
        const imageSrc = getValidImageSrc(project);
        console.log(`Project ${project.id} image source:`, imageSrc);
        
        return (
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
                  src={imageSrc}
                  alt={project.title || 'Project image'}
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
                  {project.languages?.map((lang: string, idx: number) => (
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
        );
      })}
    </div>
  )
}

export default ProjectsList