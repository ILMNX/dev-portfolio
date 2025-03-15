"use client"

import React from 'react';
import { FaReact } from 'react-icons/fa';
import { SiJavascript } from 'react-icons/si';
import { SiTypescript } from 'react-icons/si';
import { TbBrandNextjs } from 'react-icons/tb';
import { SiMysql } from "react-icons/si";
import { FaLaravel } from "react-icons/fa";
import { FaPython } from "react-icons/fa";
import { FaFlutter } from "react-icons/fa6";
import { FaJava } from "react-icons/fa";
import { FaPhp } from 'react-icons/fa';
import { motion } from 'framer-motion';


const stackItems =[
    {id:1,name:"React",icon:FaReact, color: '#61DAFB'},
    {id:2,name:"Laravel",icon:FaLaravel, color: '#FF2D20'},
    {id:3,name:"Javascript",icon:SiJavascript, color: '#F7DF1E'},
    {id:4,name:"Typescript",icon:SiTypescript, color: '#3178C6'},
    {id:5,name:"MySQL",icon:SiMysql, color: '#4479A1'},
    {id:6,name:"Next.js",icon:TbBrandNextjs, color: '#000000'},
    {id:7,name:"Python",icon:FaPython, color: '#3776AB'},
    {id:8,name:"Flutter",icon:FaFlutter, color: '#02569B'},
    {id:9,name:"Java",icon:FaJava, color: '#FF0000'},
    {id:10,name:"PHP",icon:FaPhp, color: '#777BB4'}

]
export const Stack = () => {
    return(
        <section className='py-16 glass' id='stack'>
            <div className='max-w-[1200px] mx-auto px-4 text-center'>
                <h2 className='text-5xl text-center text-gray-200 mb-4'>My Stack</h2>
                <div className='grid grid-cols-5 grid-rows-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-5'>
                    {stackItems.map((item) => (
                        <motion.div 
                            key={item.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            className='flex items-center justify-center flex-col rounded-xl p-2 sm:p-4 cursor-pointer bg-white/5 hover:bg-white/10'
                        >
                            <motion.div 
                                className='mb-2 sm:mb-4 p-2 sm:p-6 rounded-xl'
                                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                                transition={{ duration: 0.5 }}
                            >
                                {React.createElement(item.icon, {
                                    className: "w-8 h-8 sm:w-16 sm:h-16 md:w-24 md:h-24 lg:w-32 lg:h-32",
                                    style: { color: item.color }
                                })}
                            </motion.div>
                            <p className='text-xs sm:text-sm md:text-base text-gray-400 font-semibold'>{item.name}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}