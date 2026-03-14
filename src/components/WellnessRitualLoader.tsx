'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Loader2, Sparkles, Wind } from 'lucide-react';

export function WellnessRitualLoader() {
    const t = useTranslations('WellnessRitual');
    const [breathPhase, setBreathPhase] = useState<'in' | 'hold' | 'out'>('in');
    const [factIndex, setFactIndex] = useState(0);

    const facts = [
        t('fact1'),
        t('fact2'),
        t('fact3'),
        t('fact4')
    ];

    useEffect(() => {
        // Breathing cycle: In (4s), Hold (4s), Out (4s)
        const interval = setInterval(() => {
            setBreathPhase(current => {
                if (current === 'in') return 'hold';
                if (current === 'hold') return 'out';
                return 'in';
            });
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Rotate facts every 8 seconds
        const interval = setInterval(() => {
            setFactIndex(prev => (prev + 1) % facts.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [facts.length]);

    const getBreathLabel = () => {
        if (breathPhase === 'in') return t('breathingIn');
        if (breathPhase === 'hold') return t('breathingHold');
        return t('breathingOut');
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/40 backdrop-blur-2xl px-6">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 -z-10" />

            <div className="relative w-64 h-64 mb-16">
                {/* Pulsing Guide Circle */}
                <motion.div
                    animate={{
                        scale: breathPhase === 'in' ? 1.5 : breathPhase === 'hold' ? 1.5 : 1,
                        opacity: breathPhase === 'out' ? 0.3 : 0.6
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"
                />

                {/* Main Breathing Circle */}
                <motion.div
                    animate={{
                        scale: breathPhase === 'in' ? 1.2 : breathPhase === 'hold' ? 1.2 : 0.8,
                        borderWidth: breathPhase === 'hold' ? "12px" : "4px"
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="absolute inset-0 border-4 border-primary rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(var(--primary),0.3)]"
                >
                    <div className="text-center space-y-2">
                        <Wind className="w-8 h-8 text-primary mx-auto animate-pulse" />
                        <p className="text-xs font-black uppercase tracking-widest text-primary/80">
                            {getBreathLabel()}
                        </p>
                    </div>
                </motion.div>
            </div>

            <div className="text-center max-w-lg space-y-8">
                <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-primary">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm font-black uppercase tracking-[0.2em]">{t('preparing')}</span>
                    </div>
                    <h2 className="text-3xl font-black font-headline text-foreground tracking-tight">
                        Creating Your Zen Plan
                    </h2>
                </div>

                <div className="glass p-8 rounded-[2.5rem] border border-primary/10 shadow-xl min-h-[140px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={factIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex gap-4 items-start text-left"
                        >
                            <Sparkles className="w-6 h-6 text-primary shrink-0 mt-1" />
                            <p className="text-lg font-medium text-muted-foreground italic leading-relaxed">
                                "{facts[factIndex]}"
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <div className="absolute bottom-12 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 px-8 py-2 border border-muted-foreground/10 rounded-full">
                Propelling your wellness journey
            </div>
        </div>
    );
}
