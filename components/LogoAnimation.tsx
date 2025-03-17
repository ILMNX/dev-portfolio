"use client"

import Image from "next/image";
import { motion } from "framer-motion";
import figma from "@/public/figma.png";
import colab from "@/public/colab.png";
import firebase from "@/public/Firebase.png";
import vscode from "@/public/vscode.png";
import azure from "@/public/azure.png";
import github from "@/public/github.png";


const images =[
    {src: figma, alt: "figma"},
    {src: colab, alt: "colab"},
    {src: firebase, alt: "firebase"},
    {src: vscode, alt: "vscode"},
    {src: azure, alt: "azure"},
    {src: github, alt: "github"},
    {src: figma, alt: "figma"},
    {src: colab, alt: "colab"},
    {src: firebase, alt: "firebase"},
    {src: vscode, alt: "vscode"},
    {src: azure, alt: "azure"},
    {src: github, alt: "github"},
    {src: figma, alt: "figma"},
    {src: colab, alt: "colab"},
    {src: firebase, alt: "firebase"},
    {src: vscode, alt: "vscode"},
    {src: azure, alt: "azure"},
    {src: github, alt: "github"},
   
]


export const LogoAnimation = () => {
    return(
        <div className="py-8 bg-purple-200/10 opacity-80">
            <div className="container mx-auto">
                <div className="overflow-hidden [mask-image:linear-gradient(to_right,_transparent,_black_25%,_black_75%,_transparent)]">
                    <motion.div
                        className="flex gap-14 flex-none pr-14"
                        animate={{
                            translateX:'-50%',
                        }}
                        transition={{
                            duration: 35,
                            repeat: Infinity,
                            ease: 'linear',
                            repeatType:"loop",
                        }}
                    >
                        {images.map((image, index) => (
                            <Image
                                key={index}
                                src={image.src}
                                alt={image.alt}
                                height={30}
                            />
                         ))}
                    
                    </motion.div>   
                </div>
            </div>
        </div>
    );


}
