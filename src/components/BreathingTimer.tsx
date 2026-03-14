'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface BreathingTimerProps {
    onComplete: () => void;
    onClose: () => void;
}

export function BreathingTimer({ onComplete, onClose }: BreathingTimerProps) {
    const t = useTranslations('Wellness');
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
                if (timeLeft % 4 === 0) {
                    setPhase((p) => (p === 'inhale' ? 'exhale' : 'inhale'));
                }
            }, 1000);
        } else if (timeLeft === 0 && !isFinished) {
            setIsFinished(true);
            setIsActive(false);
            setTimeout(() => {
                onComplete();
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, onComplete, isFinished]);

    const progress = ((60 - timeLeft) / 60) * 100;

    return (
        <div className="flex flex-col items-center justify-center space-y-8 p-10 text-center">
            <div className="flex items-center justify-center w-full mb-4">
                <h3 className="text-2xl font-black font-headline text-foreground">
                    {t('breathingTitle')}
                </h3>
            </div>

            {!isFinished ? (
                <>
                    <div className="relative w-64 h-64 flex items-center justify-center">
                        {/* Background Circle */}
                        <div className="absolute inset-0 rounded-full border-4 border-primary/10" />

                        {/* Animated Breath Circle */}
                        <motion.div
                            animate={{
                                scale: isActive ? (phase === 'inhale' ? 1.5 : 0.8) : 1,
                                opacity: isActive ? (phase === 'inhale' ? 0.8 : 0.4) : 0.5,
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="w-32 h-32 bg-primary rounded-full blur-2xl"
                        />

                        <div className="relative z-10 flex flex-col items-center">
                            <Wind className="w-12 h-12 text-primary mb-2 animate-pulse" />
                            <span className="text-4xl font-black font-headline tabular-nums">
                                {timeLeft}s
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4 w-full">
                        <p className="text-lg font-medium text-muted-foreground animate-pulse">
                            {isActive ? (phase === 'inhale' ? 'Inhale deeply...' : 'Exhale slowly...') : t('breathingInstruction')}
                        </p>
                        <Progress value={progress} className="h-2 w-full bg-primary/10" />

                        {!isActive && (
                            <Button
                                onClick={() => setIsActive(true)}
                                className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20"
                            >
                                Start Session
                            </Button>
                        )}
                    </div>
                </>
            ) : (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center space-y-6 py-12"
                >
                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                        <CheckCircle2 className="w-16 h-16" />
                    </div>
                    <p className="text-xl font-bold text-foreground">
                        {t('breathingComplete')}
                    </p>
                </motion.div>
            )}
        </div>
    );
}
