"use client"

import React, { useState, useCallback, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
    FaBolt, 
    FaRocket, 
    FaTools, 
    FaGem, 
    FaGithub,
    FaFire,
    FaStar,
    FaHeart,
    FaCrown,
    FaMagic
} from "react-icons/fa";

interface Metric {
    id: number;
    value: string;
    label: string;
    description: string;
    baseValue: number;
    maxValue: number;
    color: string;
    icon: React.ComponentType<any>;
    clickCount: number;
    theme: {
        name: string;
        levels: {
            threshold: number;
            name: string;
            border: string;
            glow: string;
            background: string;
            particles: string;
            icon?: React.ComponentType<any>;
        }[];
    };
}

const initialMetrics: Metric[] = [
    { 
        id: 1, 
        value: '2+', 
        label: 'Years of Experience', 
        description: 'Dedicated to mastering skill in full-stack development.',
        baseValue: 2,
        maxValue: 10,
        color: 'from-blue-400 to-blue-600',
        icon: FaBolt,
        clickCount: 0,
        theme: {
            name: 'Lightning',
            levels: [
                { threshold: 0, name: 'Spark', border: 'border-gray-500', glow: 'shadow-gray-500/20', background: 'from-gray-900/40', particles: 'from-gray-400 to-gray-600', icon: FaBolt },
                { threshold: 25, name: 'Thunder', border: 'border-blue-400', glow: 'shadow-blue-500/30', background: 'from-blue-900/40', particles: 'from-blue-400 to-blue-600', icon: FaBolt },
                { threshold: 50, name: 'Storm', border: 'border-purple-400', glow: 'shadow-purple-500/40', background: 'from-purple-900/40', particles: 'from-purple-400 to-purple-600', icon: FaBolt },
                { threshold: 100, name: 'Tempest', border: 'border-yellow-400', glow: 'shadow-yellow-500/50', background: 'from-yellow-900/40', particles: 'from-yellow-400 to-yellow-600', icon: FaFire },
                { threshold: 150, name: 'Lightning God', border: 'border-white', glow: 'shadow-white/60', background: 'from-white/20', particles: 'from-white to-yellow-300', icon: FaCrown },
            ]
        }
    },
    { 
        id: 2, 
        value: '20+', 
        label: 'Projects Completed', 
        description: 'From small application to complex web platforms.',
        baseValue: 20,
        maxValue: 100,
        color: 'from-green-400 to-green-600',
        icon: FaRocket,
        clickCount: 0,
        theme: {
            name: 'Space',
            levels: [
                { threshold: 0, name: 'Ground', border: 'border-stone-500', glow: 'shadow-stone-500/20', background: 'from-stone-900/40', particles: 'from-stone-400 to-stone-600', icon: FaRocket },
                { threshold: 25, name: 'Atmosphere', border: 'border-cyan-400', glow: 'shadow-cyan-500/30', background: 'from-cyan-900/40', particles: 'from-cyan-400 to-cyan-600', icon: FaRocket },
                { threshold: 50, name: 'Orbit', border: 'border-blue-400', glow: 'shadow-blue-500/40', background: 'from-blue-900/40', particles: 'from-blue-400 to-blue-600', icon: FaRocket },
                { threshold: 100, name: 'Deep Space', border: 'border-purple-400', glow: 'shadow-purple-500/50', background: 'from-purple-900/40', particles: 'from-purple-400 to-purple-600', icon: FaStar },
                { threshold: 150, name: 'Cosmic', border: 'border-pink-400', glow: 'shadow-pink-500/60', background: 'from-pink-900/40', particles: 'from-pink-400 to-pink-600', icon: FaMagic },
            ]
        }
    },
    { 
        id: 3, 
        value: '5+', 
        label: 'Technologies Mastered', 
        description: 'Proficient in various programming languages and frameworks.',
        baseValue: 5,
        maxValue: 20,
        color: 'from-purple-400 to-purple-600',
        icon: FaTools,
        clickCount: 0,
        theme: {
            name: 'Forge',
            levels: [
                { threshold: 0, name: 'Iron', border: 'border-gray-400', glow: 'shadow-gray-500/20', background: 'from-gray-800/40', particles: 'from-gray-400 to-gray-500', icon: FaTools },
                { threshold: 25, name: 'Bronze', border: 'border-orange-600', glow: 'shadow-orange-500/30', background: 'from-orange-900/40', particles: 'from-orange-600 to-orange-700', icon: FaTools },
                { threshold: 50, name: 'Silver', border: 'border-slate-300', glow: 'shadow-slate-400/40', background: 'from-slate-800/40', particles: 'from-slate-300 to-slate-400', icon: FaTools },
                { threshold: 100, name: 'Gold', border: 'border-yellow-400', glow: 'shadow-yellow-500/50', background: 'from-yellow-900/40', particles: 'from-yellow-400 to-yellow-500', icon: FaStar },
                { threshold: 150, name: 'Mythril', border: 'border-emerald-400', glow: 'shadow-emerald-500/60', background: 'from-emerald-900/40', particles: 'from-emerald-400 to-emerald-500', icon: FaCrown },
            ]
        }
    },
    { 
        id: 4, 
        value: '99%', 
        label: 'Code Quality', 
        description: 'Ensuring clean and maintainable code.',
        baseValue: 99,
        maxValue: 100,
        color: 'from-orange-400 to-orange-600',
        icon: FaGem,
        clickCount: 0,
        theme: {
            name: 'Crystal',
            levels: [
                { threshold: 0, name: 'Quartz', border: 'border-gray-300', glow: 'shadow-gray-400/20', background: 'from-gray-700/40', particles: 'from-gray-300 to-gray-400', icon: FaGem },
                { threshold: 25, name: 'Amethyst', border: 'border-purple-400', glow: 'shadow-purple-500/30', background: 'from-purple-900/40', particles: 'from-purple-400 to-purple-500', icon: FaGem },
                { threshold: 50, name: 'Sapphire', border: 'border-blue-400', glow: 'shadow-blue-500/40', background: 'from-blue-900/40', particles: 'from-blue-400 to-blue-500', icon: FaGem },
                { threshold: 100, name: 'Ruby', border: 'border-red-400', glow: 'shadow-red-500/50', background: 'from-red-900/40', particles: 'from-red-400 to-red-500', icon: FaHeart },
                { threshold: 150, name: 'Diamond', border: 'border-white', glow: 'shadow-white/60', background: 'from-white/10', particles: 'from-white to-blue-200', icon: FaMagic },
            ]
        }
    },
    { 
        id: 5, 
        value: '300+', 
        label: 'Commits on Github', 
        description: 'Active in contributing to open-source and personal projects.',
        baseValue: 300,
        maxValue: 1000,
        color: 'from-teal-400 to-teal-600',
        icon: FaGithub,
        clickCount: 0,
        theme: {
            name: 'Nature',
            levels: [
                { threshold: 0, name: 'Seed', border: 'border-amber-600', glow: 'shadow-amber-500/20', background: 'from-amber-900/40', particles: 'from-amber-600 to-amber-700', icon: FaGithub },
                { threshold: 25, name: 'Sprout', border: 'border-green-400', glow: 'shadow-green-500/30', background: 'from-green-900/40', particles: 'from-green-400 to-green-500', icon: FaGithub },
                { threshold: 50, name: 'Tree', border: 'border-emerald-400', glow: 'shadow-emerald-500/40', background: 'from-emerald-900/40', particles: 'from-emerald-400 to-emerald-500', icon: FaGithub },
                { threshold: 100, name: 'Forest', border: 'border-teal-400', glow: 'shadow-teal-500/50', background: 'from-teal-900/40', particles: 'from-teal-400 to-teal-500', icon: FaStar },
                { threshold: 150, name: 'World Tree', border: 'border-lime-400', glow: 'shadow-lime-500/60', background: 'from-lime-900/40', particles: 'from-lime-400 to-lime-500', icon: FaMagic },
            ]
        }
    },
];

// Helper function to convert Tailwind gradient to CSS gradient
const convertGradientToCss = (tailwindGradient: string) => {
    const colorMap: {[key: string]: string} = {
        'gray-400': '#9ca3af',
        'gray-600': '#4b5563',
        'blue-400': '#60a5fa',
        'blue-600': '#2563eb',
        'purple-400': '#a78bfa',
        'purple-600': '#7c3aed',
        'yellow-400': '#facc15',
        'yellow-600': '#ca8a04',
        'white': '#ffffff',
        'yellow-300': '#fde047',
        'stone-400': '#a8a29e',
        'stone-600': '#57534e',
        'cyan-400': '#22d3ee',
        'cyan-600': '#0891b2',
        'pink-400': '#f472b6',
        'pink-600': '#db2777',
        'gray-500': '#6b7280',
        'orange-600': '#ea580c',
        'orange-700': '#c2410c',
        'slate-300': '#cbd5e1',
        'slate-400': '#94a3b8',
        'yellow-500': '#eab308',
        'emerald-400': '#34d399',
        'emerald-500': '#10b981',
        'gray-300': '#d1d5db',
        'purple-500': '#8b5cf6',
        'blue-500': '#3b82f6',
        'red-400': '#f87171',
        'red-500': '#ef4444',
        'blue-200': '#dbeafe',
        'amber-600': '#d97706',
        'amber-700': '#b45309',
        'green-400': '#4ade80',
        'green-500': '#22c55e',
        'teal-400': '#2dd4bf',
        'teal-500': '#14b8a6',
        'lime-400': '#a3e635',
        'lime-500': '#84cc16'
    };

    const gradientMatch = tailwindGradient.match(/from-(.+?)\s+to-(.+)/);
    if (gradientMatch) {
        const fromColor = colorMap[gradientMatch[1]] || '#ffffff';
        const toColor = colorMap[gradientMatch[2]] || '#000000';
        return `linear-gradient(to right, ${fromColor}, ${toColor})`;
    }
    return 'linear-gradient(to right, #ffffff, #000000)';
};

export const KeyMetrics = () => {
    const ref = React.useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: false });
    
    const [metrics, setMetrics] = useState(initialMetrics);
    const [showParticles, setShowParticles] = useState<number | null>(null);
    const [comboCounters, setComboCounters] = useState<{[key: number]: number}>({});
    const [lastClickTimes, setLastClickTimes] = useState<{[key: number]: number}>({});
    const [showFloatingText, setShowFloatingText] = useState<{[key: number]: {text: string, color: string}}>({});
    const comboTimeouts = useRef<{[key: number]: NodeJS.Timeout}>({});

    const getComboColor = useCallback((comboCount: number) => {
        if (comboCount < 3) return 'from-blue-400 to-blue-600';
        if (comboCount < 5) return 'from-green-400 to-green-600';
        if (comboCount < 8) return 'from-purple-400 to-purple-600';
        if (comboCount < 12) return 'from-red-400 to-red-600';
        return 'from-yellow-400 to-yellow-600';
    }, []);

    const handleMetricClick = useCallback((metricId: number) => {
        const currentTime = Date.now();
        const lastClickTime = lastClickTimes[metricId] || 0;
        const timeDiff = currentTime - lastClickTime;
        
        // Individual combo logic for each card
        let newCombo = 1;
        if (timeDiff < 1000 && lastClickTime > 0) {
            newCombo = (comboCounters[metricId] || 0) + 1;
        }
        
        setComboCounters(prev => ({ ...prev, [metricId]: newCombo }));
        setLastClickTimes(prev => ({ ...prev, [metricId]: currentTime }));
        
        // Clear existing timeout for this metric
        if (comboTimeouts.current[metricId]) {
            clearTimeout(comboTimeouts.current[metricId]);
        }
        
        // Reset combo after 1.5 seconds of inactivity
        comboTimeouts.current[metricId] = setTimeout(() => {
            setComboCounters(prev => ({ ...prev, [metricId]: 0 }));
        }, 1500);
        
        // Update click count (simple increment)
        setMetrics(prev => prev.map(metric => 
            metric.id === metricId 
                ? { ...metric, clickCount: metric.clickCount + 1 }
                : metric
        ));
        
        // Show floating text with combo feedback
        const floatingTexts = [
            "Nice!", "Great!", "Awesome!", "Perfect!", "Amazing!", 
            "Incredible!", "Fantastic!", "Legendary!", "Godlike!", "ULTIMATE!"
        ];
        const textIndex = Math.min(newCombo - 1, floatingTexts.length - 1);
        const color = getComboColor(newCombo);
        
        setShowFloatingText(prev => ({
            ...prev,
            [metricId]: { text: floatingTexts[textIndex], color }
        }));
        
        setTimeout(() => {
            setShowFloatingText(prev => {
                const newState = { ...prev };
                delete newState[metricId];
                return newState;
            });
        }, 800);
        
        setShowParticles(metricId);
        setTimeout(() => setShowParticles(null), 600);
    }, [comboCounters, lastClickTimes, getComboColor]);

    const getCurrentLevel = useCallback((metric: Metric) => {
        const levels = metric.theme.levels;
        for (let i = levels.length - 1; i >= 0; i--) {
            if (metric.clickCount >= levels[i].threshold) {
                return levels[i];
            }
        }
        return levels[0];
    }, []);

    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="px-4 py-32 text-white glass relative overflow-hidden"
            id="about"
        >
            <div className="container mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-6xl font-bold mb-4"
                >
                    Developer Stats
                </motion.h2>
                
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-gray-400 mb-12 text-lg"
                >
                    Click rapidly to build combos and evolve each card through magical transformations!
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {metrics.map((metric, index) => {
                        const currentLevel = getCurrentLevel(metric);
                        const comboCount = comboCounters[metric.id] || 0;
                        const comboColor = getComboColor(comboCount);
                        const CurrentIcon = currentLevel.icon || metric.icon;
                        const floatingText = showFloatingText[metric.id];
                        
                        return (
                            <motion.div
                                key={metric.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
                                className="relative group"
                            >
                                {/* Floating Text Effect */}
                                {floatingText && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0, y: 0 }}
                                        animate={{ 
                                            scale: [0, 1.2, 1], 
                                            opacity: [0, 1, 0], 
                                            y: [0, -30, -60] 
                                        }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none"
                                    >
                                        <div 
                                            className="text-lg font-bold text-center drop-shadow-lg"
                                            style={{
                                                backgroundImage: convertGradientToCss(floatingText.color),
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text'
                                            }}
                                        >
                                            {floatingText.text}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Individual Combo Display */}
                                {comboCount > 1 && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none"
                                    >
                                        <motion.div
                                            className="text-xl font-bold text-center drop-shadow-lg"
                                            style={{
                                                backgroundImage: convertGradientToCss(comboColor),
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text'
                                            }}
                                            animate={{ 
                                                scale: [1, 1.2, 1],
                                                rotate: comboCount > 5 ? [0, 360] : [0, 0]
                                            }}
                                            transition={{ 
                                                scale: { duration: 0.3 },
                                                rotate: { duration: 0.6, ease: "easeInOut" }
                                            }}
                                        >
                                            {comboCount}x COMBO!
                                        </motion.div>
                                    </motion.div>
                                )}

                                <motion.button
                                    onClick={() => handleMetricClick(metric.id)}
                                    className={`
                                        w-full h-full p-6 rounded-xl border-2 transition-all duration-300 relative overflow-hidden cursor-pointer 
                                        ${currentLevel.border} hover:${currentLevel.glow} ${currentLevel.glow}
                                        bg-gradient-to-br ${currentLevel.background} to-gray-900/40 backdrop-blur-sm
                                        select-none
                                    `}
                                    whileHover={{ 
                                        y: -5,
                                        scale: 1.02,
                                        transition: { duration: 0.2, ease: "easeOut" }
                                    }}
                                    whileTap={{ 
                                        scale: 0.95,
                                        transition: { duration: 0.1, ease: "easeInOut" }
                                    }}
                                >
                                    {/* Level Progress Indicator */}
                                    <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                                        <motion.div 
                                            className={`text-xs font-bold px-2 py-1 rounded bg-gradient-to-r ${currentLevel.particles} text-white shadow-lg`}
                                            animate={comboCount > 0 ? {
                                                scale: [1, 1.1, 1]
                                            } : {}}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {currentLevel.name}
                                        </motion.div>
                                        <div className="text-xs text-gray-400">
                                            {metric.clickCount}/200
                                        </div>
                                    </div>

                                    {/* Enhanced Particles Effect */}
                                    {showParticles === metric.id && (
                                        <div className="absolute inset-0 pointer-events-none">
                                            {[...Array(6)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className={`absolute w-2 h-2 bg-gradient-to-r ${currentLevel.particles} rounded-full shadow-lg`}
                                                    initial={{ 
                                                        x: "50%", 
                                                        y: "50%", 
                                                        scale: 0,
                                                        opacity: 1 
                                                    }}
                                                    animate={{ 
                                                        x: `${50 + (Math.random() - 0.5) * 300}%`,
                                                        y: `${50 + (Math.random() - 0.5) * 300}%`,
                                                        scale: [0, 1.5, 0],
                                                        opacity: [1, 1, 0],
                                                        rotate: [0, 360]
                                                    }}
                                                    transition={{ 
                                                        duration: 0.6,
                                                        delay: i * 0.05,
                                                        ease: "easeOut"
                                                    }}
                                                />
                                            ))}
                                            
                                            {/* Star burst effect for high combos */}
                                            {comboCount > 5 && [...Array(4)].map((_, i) => (
                                                <motion.div
                                                    key={`star-${i}`}
                                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                                    initial={{ scale: 0, rotate: 0, opacity: 1 }}
                                                    animate={{ 
                                                        scale: [0, 1.5, 0],
                                                        rotate: [0, 180],
                                                        opacity: [1, 1, 0]
                                                    }}
                                                    transition={{ 
                                                        duration: 0.5,
                                                        delay: i * 0.1,
                                                        ease: "easeOut"
                                                    }}
                                                >
                                                    <FaStar className="text-yellow-400 text-lg" />
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Icon with enhanced level effects */}
                                    <motion.div 
                                        className="text-4xl mb-4 flex justify-center"
                                        animate={showParticles === metric.id ? {
                                            rotate: [0, 15, -15, 0],
                                            scale: [1, 1.3, 1]
                                        } : {}}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                    >
                                        <CurrentIcon 
                                            style={{
                                                backgroundImage: convertGradientToCss(currentLevel.particles),
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text'
                                            }}
                                        />
                                    </motion.div>

                                    {/* Value with enhanced animation */}
                                    <motion.h3 
                                        className="text-3xl font-bold mb-3"
                                        style={{
                                            backgroundImage: convertGradientToCss(currentLevel.particles),
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}
                                        animate={showParticles === metric.id ? {
                                            scale: [1, 1.2, 1]
                                        } : {}}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                    >
                                        {metric.value}
                                    </motion.h3>

                                    <p className="text-sm font-semibold mb-2 text-gray-200">
                                        {metric.label}
                                    </p>

                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        {metric.description}
                                    </p>

                                    {/* Enhanced level progress bar */}
                                    <div className="absolute bottom-2 left-2 right-2">
                                        <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                                            <motion.div
                                                className="h-full shadow-lg"
                                                style={{
                                                    backgroundImage: convertGradientToCss(currentLevel.particles)
                                                }}
                                                initial={{ width: "0%" }}
                                                animate={{ 
                                                    width: `${Math.min(((metric.clickCount % 25) / 25) * 100, 100)}%`
                                                }}
                                                transition={{ duration: 0.3, ease: "easeOut" }}
                                            />
                                        </div>
                                    </div>

                                    {/* Dynamic interaction hint */}
                                    <motion.div
                                        className="absolute bottom-8 left-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        initial={{ y: 5 }}
                                        animate={{ y: 0 }}
                                    >
                                        <span 
                                            className="font-semibold drop-shadow-sm"
                                            style={{
                                                backgroundImage: convertGradientToCss(currentLevel.particles),
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text'
                                            }}
                                        >
                                            {comboCount > 0 
                                                ? `${comboCount}x Combo Active!` 
                                                : `Next: ${metric.theme.levels.find(l => l.threshold > metric.clickCount)?.name || 'MAX'}`
                                            }
                                        </span>
                                    </motion.div>
                                </motion.button>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Enhanced Global Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 text-center space-y-6"
                >
                    <h3 className="text-2xl font-bold text-gray-300 mb-6">Evolution Progress</h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {metrics.map(metric => {
                            const currentLevel = getCurrentLevel(metric);
                            const CurrentIcon = currentLevel.icon || metric.icon;
                            const progress = (metric.clickCount / 200) * 100;
                            
                            return (
                                <motion.div 
                                    key={metric.id} 
                                    className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <CurrentIcon 
                                            className="text-xl"
                                            style={{
                                                backgroundImage: convertGradientToCss(currentLevel.particles),
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text'
                                            }}
                                        />
                                        <span className="text-sm font-semibold text-gray-300">{metric.theme.name}</span>
                                    </div>
                                    <div 
                                        className="text-sm font-bold mb-1"
                                        style={{
                                            backgroundImage: convertGradientToCss(currentLevel.particles),
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}
                                    >
                                        {currentLevel.name} Level
                                    </div>
                                    <div className="text-xs text-gray-400 mb-2">
                                        {metric.clickCount} / 200 clicks
                                    </div>
                                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full"
                                            style={{
                                                backgroundImage: convertGradientToCss(currentLevel.particles)
                                            }}
                                            initial={{ width: "0%" }}
                                            animate={{ width: `${Math.min(progress, 100)}%` }}
                                            transition={{ duration: 1, delay: 0.1 * metric.id, ease: "easeOut" }}
                                        />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
};