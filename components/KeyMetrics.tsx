"use client"

import React from "react";
import { motion, useInView } from "framer-motion";

const metrics = [
    { id: 1, value: '5+', label: 'Projects Completed' },
    { id: 2, value: '100%', label: 'Satisfaction Rate' },
    { id: 3, value: '4.9/5', label: 'Average Rating' },
    { id: 4, value: '100%', label: 'On-Time Delivery' },
    { id: 5, value: '100%', label: 'On-Budget Delivery' }


]


export const KeyMetrics = () => {
    const ref = React.useRef<HTMLElement>(null);
    const isInView = useInView(ref, {once:false});
    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0,y: 50 }}
            animate={ isInView ? {opacity: 1,y: 0} : {opacity: 0,y: 50} }
            transition={{ duration: 0.8 }}
            className="px-4 py-32 text-white glass"
            id="about"
        >
            <div className="container mx-auto">
            <motion.h2
                initial={{ opacity: 0,y: 20 }}
                animate={ isInView ? {opacity: 1,y: 0} : {opacity: 0,y: 20} }
                transition={{ delay:0.2, duration: 0.8 }}
                className="text-6xl font-bold mb-12"
            >
                Key Metrics
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {metrics.map((metric, index) => (
                    <motion.div
                        key={metric.id}
                        initial={{ opacity: 0,y: 20 }}
                        animate={ isInView ? {opacity: 1,y: 0} : {opacity: 0,y: 20} }
                        transition={{ delay:0.4 + index * 0.1, duration: 0.8 }}
                        className="flex flex-col"
                    >
                    <motion.h3 
                        className="text-4xl font-bold text-purple-300 mb-2"
                        initial={{ scale: 0.5}}
                        animate={ isInView ? {scale: 1} : {scale:0.5} }
                        transition={{ delay:0.6 + index * 0.1, duration: 0.4, type: 'spring', stiffness: 260 }}
                    >
                        {metric.value}
                    </motion.h3>
                        <motion.p
                            initial={{ opacity: 0,y: 20 }}
                            animate={ isInView ? {opacity: 1,y: 0} : {opacity: 0,y: 20} }
                            transition={{ delay:0.8 + index * 0.1, duration: 0.8 }}
                            className="text-xl font-semibold mb-2"
                        >
                            {metric.label}
                            
                            </motion.p>
                    </motion.div>
                ))}
            </div>
            </div>

        </motion.section>

    );

}