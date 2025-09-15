'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface PreloaderProps {
  onLoadComplete?: () => void
}

const Preloader = ({ onLoadComplete }: PreloaderProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingStage, setLoadingStage] = useState('Initializing...')

  useEffect(() => {
    const loadResources = async () => {
      try {
        // Stage 1: Load critical data
        setLoadingStage('Loading projects...')
        setLoadingProgress(20)
        
        const projectsResponse = await fetch('/api/projects/selected')
        const projectsData = await projectsResponse.json()
        
        setLoadingProgress(40)
        setLoadingStage('Loading assets...')
        
        // Stage 2: Preload critical images
        const imagesToPreload: string[] = []
        if (projectsData.success && projectsData.projects) {
          projectsData.projects.forEach((project: { image?: string | { src?: string } }) => {
            if (project.image) {
              const imgSrc = typeof project.image === 'string' ? project.image : project.image?.src
              if (imgSrc) imagesToPreload.push(imgSrc)
            }
          })
        }
        
        // Preload images
        const imagePromises = imagesToPreload.slice(0, 3).map((src) => {
          return new Promise((resolve) => {
            const img = new Image()
            img.onload = resolve
            img.onerror = resolve // Continue even if image fails
            img.src = src
          })
        })
        
        await Promise.all(imagePromises)
        setLoadingProgress(70)
        setLoadingStage('Preparing experience...')
        
        // Stage 3: Load other critical resources
        await new Promise(resolve => setTimeout(resolve, 500)) // Minimum display time
        
        setLoadingProgress(100)
        setLoadingStage('Ready!')
        
        // Small delay before hiding
        setTimeout(() => {
          setIsLoading(false)
          onLoadComplete?.()
        }, 300)
        
      } catch (error) {
        console.error('Preloader error:', error)
        // Still proceed even if loading fails
        setTimeout(() => {
          setIsLoading(false)
          onLoadComplete?.()
        }, 1000)
      }
    }

    loadResources()
  }, [onLoadComplete])

  if (!isLoading) return null

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isLoading ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Logo Animation */}
        <div className="relative flex items-center justify-center mb-8">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-7xl font-bold text-gray-500 mr-2"
          >
            Gibe
          </motion.div>
          
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-7xl font-bold text-white"
          >
            Dev
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-violet-600"
            initial={{ width: 0 }}
            animate={{ width: `${loadingProgress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>

        {/* Loading Stage Text */}
        <motion.div
          key={loadingStage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-400 text-sm"
        >
          {loadingStage}
        </motion.div>

        {/* Percentage */}
        <motion.div
          className="text-white text-lg font-semibold mt-2"
          key={loadingProgress}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          {Math.round(loadingProgress)}%
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Preloader