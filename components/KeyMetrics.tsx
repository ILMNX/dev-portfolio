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
            className="container mx-auto px-4 py-32 text-white"
        >
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
                        <motion.p className="text-5xl font-bold mb-4 text-purple-300">{metric.value}</motion.p>
                        <motion.p className="text-gray-400">{metric.label}</motion.p>
                    </motion.div>
                ))}
            </div>

        </motion.section>

    );

}