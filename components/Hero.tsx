"use client"

import { useEffect, useRef } from "react"
import { useMotionValue, useTransform } from "framer-motion"
import { animate } from "framer-motion"
import { useMotionTemplate } from "framer-motion"
import { motion } from "framer-motion"
import { FiArrowRight, FiMail } from "react-icons/fi"

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"]

// SVG Path for blob animation
const blobVariants = {
  initial: {
    d: "M118.5,-133.6C156.9,-100.9,193.7,-66.7,205.8,-24.6C217.9,17.5,205.2,67.5,175.8,103.2C146.3,138.8,100.1,160.1,52.2,173.6C4.3,187.1,-45.4,192.9,-87.1,173.7C-128.7,154.5,-162.4,110.3,-181.6,61.4C-200.8,12.5,-205.4,-41.3,-183.3,-81.1C-161.2,-120.9,-112.3,-146.9,-68.4,-175.9C-24.5,-204.8,14.4,-236.9,50.3,-226.3C86.3,-215.7,119.2,-162.5,154.3,-124.8",
  },
  animate: {
    d: [
      "M118.5,-133.6C156.9,-100.9,193.7,-66.7,205.8,-24.6C217.9,17.5,205.2,67.5,175.8,103.2C146.3,138.8,100.1,160.1,52.2,173.6C4.3,187.1,-45.4,192.9,-87.1,173.7C-128.7,154.5,-162.4,110.3,-181.6,61.4C-200.8,12.5,-205.4,-41.3,-183.3,-81.1C-161.2,-120.9,-112.3,-146.9,-68.4,-175.9C-24.5,-204.8,14.4,-236.9,50.3,-226.3C86.3,-215.7,119.2,-162.5,118.5,-133.6",
      "M132.1,-154.1C170.4,-125.8,200.2,-82.2,206.8,-36.1C213.3,10,196.6,58.6,168.5,95.9C140.4,133.1,100.8,159,56.1,177.7C11.4,196.3,-38.5,207.7,-82.2,194.1C-125.9,180.5,-163.4,142,-186.6,96.6C-209.8,51.1,-218.7,-1.5,-208.5,-51.5C-198.3,-101.5,-168.9,-149,-128.2,-176.5C-87.4,-204.1,-35.3,-211.7,6.9,-219.4C49.1,-227,93.8,-182.5,132.1,-154.1",
      "M140.2,-169.8C177.8,-132.5,201.7,-84.3,209.3,-34.1C216.8,16.1,208,68.1,180.9,105.6C153.8,143.1,108.4,166,59.4,182.5C10.4,199,-42.1,209,-85.6,195.2C-129.1,181.3,-163.6,143.6,-185.9,98.9C-208.3,54.2,-218.5,2.5,-206.3,-41.2C-194.1,-84.8,-159.5,-120.4,-121.4,-157.3C-83.3,-194.2,-41.7,-232.4,4.2,-237.3C50,-242.2,100,-207,140.2,-169.8",
      "M118.5,-133.6C156.9,-100.9,193.7,-66.7,205.8,-24.6C217.9,17.5,205.2,67.5,175.8,103.2C146.3,138.8,100.1,160.1,52.2,173.6C4.3,187.1,-45.4,192.9,-87.1,173.7C-128.7,154.5,-162.4,110.3,-181.6,61.4C-200.8,12.5,-205.4,-41.3,-183.3,-81.1C-161.2,-120.9,-112.3,-146.9,-68.4,-175.9C-24.5,-204.8,14.4,-236.9,50.3,-226.3C86.3,-215.7,119.2,-162.5,118.5,-133.6"
    ],
    transition: {
      duration: 20,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut"
    }
  }
};

export const Hero = () => {
    const color = useMotionValue(COLORS_TOP[0])
    const blobRef = useRef(null)

    //to control the effect of the color change
    useEffect(() => {
        animate(color,COLORS_TOP,{
            ease: "easeInOut",
            duration : 10,
            repeat: Infinity,
            repeatType: "mirror"
        })
    },[color])

    const backgroundImage = useMotionTemplate `radial-gradient(125% 125% at 50% 0%, #000 50%, ${color})`
    const border = useMotionTemplate `1px solid ${color}`
    const boxShadow = useMotionTemplate `0px 4px 24px ${color}`
    const gradientStop1 = useMotionTemplate `${color}`
    
    // Adding slight rotation to the blob
    const rotate = useMotionValue(0)
    useEffect(() => {
        animate(rotate, 360, {
            duration: 60,
            repeat: Infinity,
            ease: "linear"
        })
    }, [rotate])

    const scrollToContact = () => {
        const contactSection = document.querySelector('#contact')
        contactSection?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }

    // Motion values for blob movement
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    
    useEffect(() => {
        const handleMouseMove = (e: { clientX: number; clientY: number }) => {
            // Subtle movement following the mouse
            const xPos = (e.clientX / window.innerWidth - 0.5) * 30
            const yPos = (e.clientY / window.innerHeight - 0.5) * 30
            
            animate(x, xPos, { duration: 2, ease: "easeOut" })
            animate(y, yPos, { duration: 2, ease: "easeOut" })
        }
        
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [x, y])

    // Transform motion values for blob movement
    const blobX = useTransform(x, [-15, 15], ['-2%', '2%'])
    const blobY = useTransform(y, [-15, 15], ['-2%', '2%'])
    const blobScale = useTransform(y, [-15, 15], [0.98, 1.02])

    return(
        <motion.section
        style={{
            backgroundImage
        }}
        className="relative grid min-h-screen place-content-center overflow-hidden px-4 py-24 text-gray-200"
        >
            <div className="z-10 flex flex-col items-center">
                <span className="mb-7 inline-block rounded-full bg-gray-600/50 px-3 py-1.5 text-sm">
                    Open for work
                </span>
                <h1 className="text-white/40 text-7xl font-black">Hi, I am</h1>
                <h1 className="max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text font-black leading-tight text-transparent md:text-7xl"> 
                    Gilbert Hasiholan S
                </h1>

                <p className="my-6 max-w-xl"> 
                    Fullstack Developer based in Bandar Lampung with over 2 years of experience, 
                    specializing in building end-to-end web applications.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <motion.button
                        onClick={() => window.open('https://www.canva.com/design/DAGhsbBQGPo/Cq0wE9ktnUkrnOQnH4F9KA/view?utm_content=DAGhsbBQGPo&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h6f3875e230', '_blank')}
                        style={{
                            border,
                            boxShadow
                        }}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: `0px 4px 24px ${color}`
                        }}
                        whileTap={{
                            scale: 0.985
                        }}
                        className="flex w-fit items-center gap-2 rounded-full px-4 py-2"
                    >
                        Download CV
                        <FiArrowRight className="ml-1"/>   
                    </motion.button>

                    <motion.button
                        onClick={scrollToContact}
                        style={{
                            border: useMotionTemplate `1px solid rgba(255,255,255,0.3)`,
                            backgroundColor: 'rgba(255,255,255,0.1)'
                        }}
                        whileHover={{
                            scale: 1.05,
                            backgroundColor: 'rgba(255,255,255,0.2)'
                        }}
                        whileTap={{
                            scale: 0.985
                        }}
                        className="flex w-fit items-center gap-2 rounded-full px-4 py-2"
                    >
                        Contact Me!
                        <FiMail className="ml-1"/>   
                    </motion.button>
                </div>

                {/* Social Links Container */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{
                        scale: 1.05,
                    }}
                    transition={{ duration: 0.7, delay: 0.2, type: "spring" }}
                    className="mt-32 flex flex-col items-center w-full group"
                >
                    <div
                        className="relative rounded-2xl px-6 py-4 shadow-2xl flex flex-col items-center w-full max-w-xl border border-white/10 overflow-hidden"
                        style={{
                            background: "rgba(20, 30, 40, 0.65)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                        }}
                    >
                        {/* Border highlight effect */}
                        <div
                            className="pointer-events-none absolute inset-0 transition-all duration-300 z-20"
                            style={{
                                borderRadius: '1rem', // matches rounded-2xl
                                boxSizing: "border-box",
                                border: "2px solid transparent",
                                ...( // Only show gradient border on hover
                                    {
                                        borderImage: "none",
                                    }
                                ),
                            }}
                        />
                        {/* Gradient border on hover */}
                        <div
                            className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
                            style={{
                                borderRadius: '1rem',
                                opacity: 0,
                                border: "2px solid transparent",
                                borderImage: "linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%) 1",
                                boxSizing: "border-box",
                            }}
                        />
                        <style jsx>{`
                            .group:hover > div:nth-child(2) {
                                opacity: 1 !important;
                            }
                        `}</style>
                        {/* Shine effect */}
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.12)_50%,transparent_75%)] bg-[length:250%_250%] group-hover:bg-[position:100%_100%] transition-[background-position] duration-500 z-10" />
                        <span className="mb-3 text-gray-300 font-semibold tracking-wide text-sm relative z-40">Find me on</span>
                        <ul className="flex gap-5 flex-wrap justify-center relative z-40">
                            <motion.a
                                href="https://github.com/ILMNX"
                                aria-label="GitHub"
                                className="text-gray-200 flex items-center justify-center w-10 h-10 rounded-full hover:text-[#13FFAA] transition-colors bg-white/5 hover:bg-white/10"
                                whileHover={{ scale: 1.15, rotate: -8 }}
                                whileTap={{ scale: 0.95 }}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="30" width="30" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0 1 38.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"></path>
                                </svg>
                            </motion.a>
                            <motion.a
                                href="https://www.linkedin.com/in/gilberthasiholan/"
                                aria-label="LinkedIn"
                                className="text-gray-200 flex items-center justify-center w-10 h-10 rounded-full hover:text-[#1E67C6] transition-colors bg-white/5 hover:bg-white/10"
                                whileHover={{ scale: 1.15, rotate: 8 }}
                                whileTap={{ scale: 0.95 }}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="30" width="30" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100.28 448H7.4V148.6h92.88zm-46.44-339.2c-29.9 0-54.1-24.2-54.1-54.1S24.94 0 54.84 0c29.9 0 54.1 24.2 54.1 54.1s-24.2 54.1-54.1 54.1zM447.6 448h-92.8V302c0-34.5-.7-78.8-47.9-78.8-47.9 0-55 .7-55 .7v224h-92.8V148.6h89v40h1c12.4-23.5 42.7-48 87.8-48 94 0 111 .6 111 .6v91z"></path>
                                </svg>
                            </motion.a>
                           
                            <motion.a
                                href="https://instagram.com/gilberths__"
                                aria-label="Instagram"
                                className="text-gray-200 flex items-center justify-center w-10 h-10 rounded-full hover:text-[#CE84CF] transition-colors bg-white/5 hover:bg-white/10"
                                whileHover={{ scale: 1.15, rotate: 8 }}
                                whileTap={{ scale: 0.95 }}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="30" width="30" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M512 378.7c-73.4 0-133.3 59.9-133.3 133.3S438.6 645.3 512 645.3 645.3 585.4 645.3 512 585.4 378.7 512 378.7zM911.8 512c0-55.2.5-109.9-2.6-165-3.1-64-17.7-120.8-64.5-167.6-46.9-46.9-103.6-61.4-167.6-64.5-55.2-3.1-109.9-2.6-165-2.6-55.2 0-109.9-.5-165 2.6-64 3.1-120.8 17.7-167.6 64.5C132.6 226.3 118.1 283 115 347c-3.1 55.2-2.6 109.9-2.6 165s-.5 109.9 2.6 165c3.1 64 17.7 120.8 64.5 167.6 46.9 46.9 103.6 61.4 167.6 64.5 55.2 3.1 109.9 2.6 165 2.6 55.2 0 109.9.5 165-2.6 64-3.1 120.8-17.7 167.6-64.5 46.9-46.9 61.4-103.6 64.5-167.6 3.2-55.1 2.6-109.8 2.6-165zM512 717.1c-113.5 0-205.1-91.6-205.1-205.1S398.5 306.9 512 306.9 717.1 398.5 717.1 512 625.5 717.1 512 717.1zm213.5-370.7c-26.5 0-47.9-21.4-47.9-47.9s21.4-47.9 47.9-47.9 47.9 21.4 47.9 47.9a47.84 47.84 0 0 1-47.9 47.9z"></path>
                                </svg>
                            </motion.a>
                            <motion.a
                                href="https://telegram.org"
                                aria-label="Telegram"
                                className="text-gray-200 flex items-center justify-center w-10 h-10 rounded-full hover:text-[#DD335C] transition-colors bg-white/5 hover:bg-white/10"
                                whileHover={{ scale: 1.15, rotate: -8 }}
                                whileTap={{ scale: 0.95 }}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="30" width="30" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z"></path>
                                </svg>
                            </motion.a>
                        </ul>
                    </div>
                </motion.div>
                {/* End Social Links Container */}

            </div>
            
            {/* Metallic Gradient Liquid Blob */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    className="absolute top-[-40%] right-[-20%] w-[120%] h-[120%] pointer-events-none"
                    style={{
                        x: blobX,
                        y: blobY,
                        scale: blobScale,
                        rotate: rotate,
                    }}
                >
                    <svg 
                        viewBox="-300 -300 600 600"
                        width="100%" 
                        height="100%" 
                        className="w-full h-full opacity-40"
                    >
                        <defs>
                            {/* Define the radial gradient */}
                            <radialGradient id="blobGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                <motion.stop offset="0%" style={{ stopColor: "#fff" }} />
                                <motion.stop offset="50%" style={{ stopColor: gradientStop1 }} />
                                <motion.stop offset="100%" style={{ stopColor: "#000" }} />
                            </radialGradient>
                            
                            {/* Metallic effect filters */}
                            <filter id="gooey" width="200%" height="200%" x="-50%" y="-50%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="gooey" />
                            </filter>
                            
                            <filter id="metallic" width="200%" height="200%" x="-50%" y="-50%">
                                <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                                <feSpecularLighting result="specOut" in="blur" specularExponent="20" lightingColor="#fff">
                                    <fePointLight x="0" y="0" z="200" />
                                </feSpecularLighting>
                                <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
                            </filter>
                            
                            <filter id="turbulence" width="200%" height="200%" x="-50%" y="-50%">
                                <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" seed="1" />
                                <feDisplacementMap in="SourceGraphic" scale="15" />
                            </filter>
                        </defs>
                        
                        <motion.path
                            ref={blobRef}
                            variants={blobVariants}
                            initial="initial"
                            animate="animate"
                            fill="url(#blobGradient)"
                            style={{ filter: "url(#metallic) url(#gooey)" }}
                            className="transform-origin-center"
                        />
                    </svg>
                </motion.div>
                
                {/* Secondary smaller blob for added effect */}
                <motion.div 
                    className="absolute bottom-[-30%] left-[-10%] w-[80%] h-[80%] opacity-30 pointer-events-none"
                    style={{
                        x: useTransform(x, [-15, 15], ['3%', '-3%']),
                        y: useTransform(y, [-15, 15], ['3%', '-3%']),
                        scale: useTransform(y, [-15, 15], [1.02, 0.98]),
                        rotate: useMotionValue(180),
                    }}
                    animate={{
                        rotate: 540,
                        transition: { duration: 80, repeat: Infinity, ease: "linear" }
                    }}
                >
                    <svg 
                        viewBox="-300 -300 600 600"
                        width="100%" 
                        height="100%" 
                        className="w-full h-full"
                    >
                        <motion.path
                            variants={blobVariants}
                            initial="initial"
                            animate="animate"
                            fill="url(#blobGradient)"
                            style={{ filter: "url(#turbulence) url(#gooey)" }}
                            className="transform-origin-center"
                        />
                    </svg>
                </motion.div>
            </div>
            {/* End Metallic Gradient Liquid Blob */}

        </motion.section>
    )
}