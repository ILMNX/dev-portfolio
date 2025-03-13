"use client"

import {motion} from "framer-motion"

export const Contact = () => {
    return(
        <section id="contact" className="max-w-[1200px] mx-auto px-4text-white py-32">
            <motion.div
                initial={{opacity: 0, y:20}}
                transition={{duration: 0.8}}
                whileInView={{opacity: 1,y:0}}
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
                        whileInView={{opacity: 1,y:0}}
                        className="glass p-8 rounded-2xl space-y-8"
                    >
                        <div className="space-y-2">
                            <p className="text-lg text-gray-300">Phone</p>
                            <a href="tel:+62 878 2209 1974" className="text-2xl font-semibold hover:text-gray-400 transition duration-300 flex items-center gap-2">
                                +62 878 2209 1974
                            </a>
                            <span className="text-gray-500">⇗</span>
                        </div>
                        <div className="space-y-2">
                            <p className="text-lg text-gray-300">Email</p>
                            <a href="mailto : gilbertsibuea8539@gmail.com" className="text-3xl lg:text-4xl font-semibold hover:text-gray-400 transition duration-300 flex items-center gap-2">
                                gilbertsibuea8539@gmail.com
                            </a>
                            <span className="text-gray-500">⇗</span>
                        </div>
                        <div className="space-y-2">
                            <p className="text-lg text-gray-300">LinkedIn</p>
                            <a href="https://www.linkedin.com/in/gilbert-sibuea-93b524246/" className="text-3xl lg:text-4xl font-semibold hover:text-gray-400 transition duration-300 flex items-center gap-2">
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
                    <iframe 
                        src="https://www.youtube.com/embed/6otHgtUkTE0?si=HeaS6vie1kd0XYZD" 
                        width="100%"
                        height="100%"
                        style={{border: "0"}}
                        allowFullScreen
                        loading="lazy"
                    ></iframe>
                        

                </motion.div>


            </motion.div>
        </section>
    );
}