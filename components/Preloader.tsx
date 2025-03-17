'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000) // Increased to 3s to show full animation

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 2.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <div className="relative flex items-center justify-center">
        {/* G Letter */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1,
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className="text-7xl font-bold text-gray-500 mr-2"
        >
          Gibe
        </motion.div>

        {/* D Letter */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1,
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            ease: "easeOut",
          }}
          className="text-7xl font-bold text-white"
        >
          Dev
        </motion.div>

        {/* Animated Ring */}
        <motion.div
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ 
            scale: [1.5, 1, 1, 1.5],
            opacity: [0, 1, 1, 0],
            rotate: [0, 0, 270, 270],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.2, 0.8, 1],
            repeat: Infinity,
          }}
          className="absolute inset-0 border-4 border-gray-500 rounded-full"
        />

        {/* Animated Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="absolute -bottom-8 text-white text-2xl tracking-wider"
        >
          . . .
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Preloader 