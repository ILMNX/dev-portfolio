"use client"

import {motion} from "framer-motion"
import { useEffect } from "react"

export const Contact = () => {
    useEffect(() => {
        // Load Calendly widget script
        const script = document.createElement('script')
        script.src = "https://assets.calendly.com/assets/external/widget.js"
        script.async = true
        document.body.appendChild(script)

        return () => {
            // Cleanup script when component unmounts
            document.body.removeChild(script)
        }
    }, [])
    return(
        <section id="contact" className="overflow-x-clip py-32 text-white max-w-[1200px] mx-auto px-4">
            <motion.div
                initial={{opacity: 0, y: 20}}
                transition={{duration: 0.8}}
                whileInView={{opacity: 1, y: 0}}
                className="grid lg:grid-cols-2 gap-16"
                viewport={{once: true}}
            >
                <div className="space-y-12">
                    <motion.h2
                        initial={{opacity: 0, x:-20}}
                        transition={{duration: 0.6, delay: 0.2}}
                        whileInView={{opacity: 1,x:0}}
                        className="text-7xl font-bold text-gray-300"
                    >
                        Get in <span className="text-gray-500">touch</span>
                    </motion.h2>
                    <motion.div
                        initial={{opacity: 0, x:-20}}
                        transition={{duration: 0.6, delay: 0.4}}
                        whileInView={{opacity: 1,x:0}}
                        className="glass p-8 rounded-2xl space-y-8"
                    >
                        <div className="space-y-2">
                            <p className="text-lg text-gray-300">Phone</p>
                            <a href=" https://wa.me/6285110806407?text=Hi Gilbert!, I'm%20interested%20in%20your%20programming%20service%20" target="_blank" 
                            className="text-2xl font-semibold hover:text-gray-400 transition duration-300 flex items-center gap-2">
                                +62 851 1080 6407
                            </a>
                            <span className="text-gray-500">⇗</span>
                        </div>
                        <div className="space-y-2">
                            <p className="text-lg text-gray-300">Email</p>
                            <a href="mailto : gilbertsibuea8539@gmail.com" className="text-2xl lg:text-3xl font-semibold hover:text-gray-400 transition duration-300 flex items-center gap-2">
                                gilbertsibuea8539@gmail.com
                            </a>
                            <span className="text-gray-500">⇗</span>
                        </div>
                        <div className="space-y-2">
                            <p className="text-lg text-gray-300">LinkedIn</p>
                            <a href="https://www.linkedin.com/in/gilbert-sibuea-93b524246/" className="text-2xl lg:text-4xl font-semibold hover:text-gray-400 transition duration-300 flex items-center gap-2">
                               Gilbert Sibuea
                            </a>
                            <span className="text-gray-500">⇗</span>
                        </div>
                        
                    </motion.div>

                </div>
                <motion.div
                    initial={{opacity: 0, x:20}}
                    transition={{duration: 0.6, delay: 0.6}}
                    whileInView={{opacity: 1,x:0}}
                    className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden"
                >
                    <div 
                        className="calendly-inline-widget" 
                        data-url="https://calendly.com/gilbertsibuea8539/30min?hide_event_type_details=1&background_color=2D2D2D&text_color=ffffff"
                        style={{
                            minWidth: "320px",
                            height: "600px",
                            backgroundColor: "black"
                        }}
                    />
                </motion.div>


            </motion.div>
        </section>
    );
}