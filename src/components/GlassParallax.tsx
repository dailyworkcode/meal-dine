'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function GlassParallax() {
    const { scrollY } = useScroll();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 40,
                y: (e.clientY / window.innerHeight - 0.5) * 40,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
    const r1 = useTransform(scrollY, [0, 1000], [0, 45]);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
            {/* Ambient Glows */}
            <motion.div
                animate={{ x: mousePos.x, y: mousePos.y }}
                transition={{ type: 'spring', damping: 20 }}
                className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full"
            />
            <motion.div
                animate={{ x: -mousePos.x, y: -mousePos.y }}
                transition={{ type: 'spring', damping: 20 }}
                className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 blur-[150px] rounded-full"
            />

            {/* Floating Glass Blobs */}
            <motion.div
                style={{ y: y1, rotate: r1 }}
                className="absolute top-[20%] right-[10%] w-64 h-64 glass rounded-full opacity-30"
            />
            <motion.div
                style={{ y: y2 }}
                className="absolute top-[60%] left-[5%] w-96 h-96 glass-dark rounded-[40%] opacity-20"
            />
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[10%] left-[15%] w-32 h-32 glass rounded-2xl rotate-12 opacity-40"
            />
        </div>
    );
}
