import React from 'react';
import { FaReact } from 'react-icons/fa';
import { SiTypescript } from 'react-icons/si';
import { TbBrandNextjs } from 'react-icons/tb';
import { SiMysql } from "react-icons/si";
import { FaLaravel } from "react-icons/fa";
import { FaPython } from "react-icons/fa";


const stackItems =[
    {id:1,name:"React",icon:FaReact, color: '#61DAFB'},
    {id:2,name:"Laravel",icon:FaLaravel, color: '#FF2D20'},
    {id:3,name:"Typescript",icon:SiTypescript, color: '#3178C6'},
    {id:4,name:"MySQL",icon:SiMysql, color: '#4479A1'},
    {id:5,name:"Next.js",icon:TbBrandNextjs, color: '#000000'},
    {id:6,name:"Python",icon:FaPython, color: '#3776AB'},
]
export const Stack = () => {
    return(
        <section className='py-16 glass' id='stack'>
            <div className='max-w-[1200px] mx-auto px-4 text-center'>
                <h2 className='text-5xl text-center text-gray-200 mb-4'>My Stack</h2>
                <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2'>
                    {stackItems.map((item) => (
                        <div 
                            key={item.id} 
                            className='flex items-center justify-center flex-col rounded-xl p-4'>
                                <div className='mb-4 bg-white/10 p-6 rounded-xl'>
                                    {React.createElement(item.icon, {
                                        className: "w-32 h-32 ",
                                        style: {color: item.color}
                                    
                                    })}
                                </div>
                                <p className='text-gray-400 font-semibold '>{item.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>)

}