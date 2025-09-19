"use client"

import React from "react";
import { motion } from "framer-motion";
import { 
    FaBolt, 
    FaRocket, 
    FaTools, 
    FaGem, 
    FaGithub
} from "react-icons/fa";
import GitHubContributions from "./GitHubContributions";
// import WakatimeTracker from "./WakatimeTracker";

const metrics = [
    { 
        id: 1, 
        value: '2+', 
        label: 'Years of Experience', 
        description: 'Dedicated to mastering skill in full-stack development.',
        icon: FaBolt,
    },
    { 
        id: 2, 
        value: '20+', 
        label: 'Projects Completed', 
        description: 'From small application to complex web platforms.',
        icon: FaRocket,
    },
    { 
        id: 3, 
        value: '5+', 
        label: 'Technologies Mastered', 
        description: 'Proficient in various programming languages and frameworks.',
        icon: FaTools,
    },
    { 
        id: 4, 
        value: '99%', 
        label: 'Code Quality', 
        description: 'Ensuring clean and maintainable code.',
        icon: FaGem,
    },
    { 
        id: 5, 
        value: '300+', 
        label: 'Commits on Github', 
        description: 'Active in contributing to open-source and personal projects.',
        icon: FaGithub,
    },
];

export const KeyMetrics = () => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="px-4 py-32 text-white glass relative overflow-hidden"
            id="about"
        >
            <div className="container mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-6xl font-bold mb-4"
                >
                    Developer Stats
                </motion.h2>
                
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-gray-400 mb-12 text-lg"
                >
                    A quick glance at my journey and achievements as a developer.
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
                    {metrics.map((metric) => {
                        const Icon = metric.icon;
                        return (
                            <motion.div
                                key={metric.id}
                                whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(80,80,120,0.15)" }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, }}
                                className="bg-white/5 rounded-xl border border-white/10 p-8 shadow-lg backdrop-blur-md"
                            >
                                <div className="flex justify-center mb-4">
                                    <Icon className="text-4xl text-violet-300" />
                                </div>
                                <h3 className="text-3xl font-bold mb-2 text-center text-white">
                                    {metric.value}
                                </h3>
                                <p className="text-lg font-semibold mb-2 text-center text-white">
                                    {metric.label}
                                </p>
                                <p className="text-sm text-gray-200 text-center">
                                    {metric.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* GitHub Contributions Section */}
                <GitHubContributions username="ILMNX" />
                {/* <WakatimeTracker /> */}
            </div>
        </motion.section>
    );
};