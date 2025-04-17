"use client"

import { useEffect } from "react"
import { useMotionValue } from "framer-motion"
import { animate } from "framer-motion"
import { useMotionTemplate } from "framer-motion"
import { motion } from "framer-motion"
import { FiArrowRight, FiMail } from "react-icons/fi"



const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"]

export const Hero = () => {
    const color = useMotionValue(COLORS_TOP[0])

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

    const scrollToContact = () => {
        const contactSection = document.querySelector('#contact')
        contactSection?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }

    return(
        <motion.section
        style={{
            backgroundImage
        }}
        className="relative grid min-h-screen place-content-center overflow-hidden px-4 py-24 text-gray-200"
        >
            <div className="z-10 flex flex-col items-center">
                <span className="mb-1.5 inline-block rounded-full bg-gray-600/50 px-3 py-1.5 text-sm">
                    Open for work
                </span>
                <h1 className="text-white/40 text-7xl font-black">Hi, I am</h1>
                <h1 className="max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text font-black leading-tight text-transparent md:text-7xl"> 
                    Gilbert Hasiholan S
                </h1>
                {/* <Image
                    src={profilePic}
                    alt ="Profile Picture"
                    width = {250}
                />
                <div className="flex bg-white/10 shadow-xl p-3 rounded-3xl justify-center items-center space-x-2 mb-4">
                    <Image
                        src = {obj}
                        alt = "object"
                        width={30}
                        className="rounded-2xl mx-auto "
                    
                    />
                    
                </div> */}

                <p className="my-6 max-w-xl"> Fullstack Developer based in Bandar Lampung, With over 2 years of experience</p>

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

            </div>
            <div className="bg-circle-container">
                <div className="bg-circle-background"></div>
                <div className="bg-circle"></div>
            </div>

        </motion.section>
    )
}