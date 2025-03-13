"use client"

import { use } from "react"
import { useEffect } from "react"
import { useMotionValue } from "framer-motion"
import { animate } from "framer-motion"
import { useMotionTemplate } from "framer-motion"
import { motion } from "framer-motion"
import Image from "next/image"
import profilePic from "@/public/profile.png"
import obj from "@/public/object.png"
import { FiArrowRight } from "react-icons/fi"



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
    },[])

    const backgroundImage = useMotionTemplate `radial-gradient(125% 125% at 50% 0%, #000 50%, ${color})`
    const border = useMotionTemplate `1px solid ${color}`
    const boxShadow = useMotionTemplate `0px 4px 24px ${color}`


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
                    Gilbert Hasiholan
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

                <motion.button
                    style={{
                        border,
                        boxShadow
                    }}
                    whileHover={
                        {
                            scale: 1.05,
                            boxShadow: `0px 4px 24px ${color}`
                        }
                    }
                    whileTap={
                        {
                            scale: 0.985
                        }
                    }
                    className="flex w-fit items-center gap-2 rounded-ful px-4 py-2"
                >
                    Download CV
                <FiArrowRight className=""/>   

                </motion.button>

            </div>
            <div className="bg-circle-container">
                <div className="bg-circle-background"></div>
                <div className="bg-circle"></div>
            </div>

        </motion.section>
    )
}