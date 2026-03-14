'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Timer, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { fireConfetti } from '@/lib/confetti';

interface MindfulEatingTimerProps {
    onComplete: () => void;
}

export function MindfulEatingTimer({ onComplete }: MindfulEatingTimerProps) {
    const t = useTranslations('MindfulNutrition');
    const [seconds, setSeconds] = useState(1200); // 20 minutes default
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState(0);

    const sensoryPrompts = [
        t('timerSensory1'),
        t('timerSensory2'),
        t('timerSensory3'),
        t('timerSensory4'),
    ];

    useEffect(() => {
        let interval: any = null;
        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds((s) => s - 1);
            }, 1000);
        } else if (seconds === 0) {
            setIsActive(false);
            fireConfetti();
            onComplete();
        }
        return () => clearInterval(interval);
    }, [isActive, seconds, onComplete]);

    // Update sensory phase every 5 minutes
    useEffect(() => {
        const currentPhase = Math.min(3, Math.floor((1200 - seconds) / 300));
        setPhase(currentPhase);
    }, [seconds]);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((1200 - seconds) / 1200) * 100;

    return (
        <div className="flex flex-col items-center gap-8 py-8">
            <div className="relative w-64 h-64">
                {/* Progress Circle Backdrop */}
                <svg className="w-full h-full -rotate-90">
                    <circle
                        cx="128"
                        cy="128"
                        r="120"
                        className="stroke-primary/10 fill-none"
                        strokeWidth="8"
                    />
                    <motion.circle
                        cx="128"
                        cy="128"
                        r="120"
                        className="stroke-primary fill-none"
                        strokeWidth="8"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: progress / 100 }}
                        transition={{ type: 'spring', stiffness: 20, damping: 10 }}
                    />
                </svg>

                {/* Timer Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
                    <span className="text-4xl font-black font-headline text-foreground tabular-nums">
                        {formatTime(seconds)}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                        {isActive ? 'Flowing...' : 'Paused'}
                    </span>
                </div>
            </div>

            <div className="text-center max-w-xs h-16 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={phase}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="text-sm font-medium text-primary italic leading-relaxed"
                    >
                        "{sensoryPrompts[phase]}"
                    </motion.p>
                </AnimatePresence>
            </div>

            <div className="flex gap-4">
                <Button
                    size="lg"
                    onClick={() => setIsActive(!isActive)}
                    className="rounded-2xl px-8 h-12 shadow-lg shadow-primary/20"
                >
                    {isActive ? 'Pause Reflection' : 'Resume Flow'}
                </Button>
                <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => setSeconds(10)} // For testing/quick completion
                    className="rounded-2xl h-12"
                >
                    Fast Track
                </Button>
            </div>
        </div>
    );
}
