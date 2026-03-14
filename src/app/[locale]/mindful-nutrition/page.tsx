'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Link } from '@/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Sparkles, Heart, Brain, Utensils } from 'lucide-react';
import { GlassParallax } from '@/components/GlassParallax';
import { HungerScale } from '@/components/HungerScale';
import { MindfulEatingTimer } from '@/components/MindfulEatingTimer';
import { motion, AnimatePresence } from 'framer-motion';
import { fireConfetti } from '@/lib/confetti';

export default function MindfulNutritionPage() {
    const t = useTranslations('MindfulNutrition');
    const [step, setStep] = useState<'pre' | 'timer' | 'post' | 'complete'>('pre');
    const [preHunger, setPreHunger] = useState(5);
    const [postSatiety, setPostSatiety] = useState(5);
    const [wellnessPoints, setWellnessPoints] = useLocalStorage<number>('wellnessPoints', 0);
    const [lastCheckIn, setLastCheckIn] = useLocalStorage<any>('mindfulNutritionLog', {});

    const handleStartTimer = () => setStep('timer');

    const handleTimerComplete = () => {
        setStep('post');
    };

    const handleFinishSession = () => {
        // Save to log
        const today = new Date().toISOString().split('T')[0];
        const newLog = {
            ...lastCheckIn,
            [today]: {
                pre: preHunger,
                post: postSatiety,
                timestamp: new Date().getTime()
            }
        };
        setLastCheckIn(newLog);

        // Award points
        setWellnessPoints(wellnessPoints + 100);
        fireConfetti();
        setStep('complete');
    };

    return (
        <SidebarProvider>
            <SidebarInset>
                <div className="min-h-screen relative overflow-hidden">
                    <GlassParallax />

                    <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/80 backdrop-blur-xl">
                        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" asChild className="rounded-full">
                                    <Link href="/">
                                        <ArrowLeft className="h-5 w-5" />
                                    </Link>
                                </Button>
                                <div className="flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-primary" />
                                    <span className="text-xl font-black font-headline tracking-tighter text-foreground">
                                        Mindful Nutrition
                                    </span>
                                </div>
                            </div>
                            <LanguageSwitcher />
                        </div>
                    </header>

                    <main className="container mx-auto px-4 py-12 max-w-4xl">
                        <AnimatePresence mode="wait">
                            {step === 'pre' && (
                                <motion.div
                                    key="pre"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center space-y-4 mb-12">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-4">
                                            <Brain className="w-4 h-4" />
                                            Psychological Check-in
                                        </div>
                                        <h1 className="text-4xl md:text-5xl font-black font-headline text-foreground tracking-tight">
                                            {t('title')}
                                        </h1>
                                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                            {t('subtitle')}
                                        </p>
                                    </div>

                                    <Card className="glass-card border-none rounded-[3rem] overflow-hidden shadow-2xl">
                                        <CardContent className="p-12">
                                            <HungerScale
                                                value={preHunger}
                                                onChange={setPreHunger}
                                                label={t('hungerTitle')}
                                                description={t('hungerDesc')}
                                            />
                                            <div className="mt-12 flex justify-center">
                                                <Button
                                                    size="lg"
                                                    onClick={handleStartTimer}
                                                    className="rounded-[2rem] px-12 h-16 text-lg font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-transform"
                                                >
                                                    {t('startSession')}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {step === 'timer' && (
                                <motion.div
                                    key="timer"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="space-y-8 text-center"
                                >
                                    <Card className="glass-card border-none rounded-[3rem] p-12 shadow-2xl">
                                        <MindfulEatingTimer onComplete={handleTimerComplete} />
                                    </Card>
                                </motion.div>
                            )}

                            {step === 'post' && (
                                <motion.div
                                    key="post"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    className="space-y-8"
                                >
                                    <Card className="glass-card border-none rounded-[3rem] p-12 shadow-2xl">
                                        <HungerScale
                                            value={postSatiety}
                                            onChange={setPostSatiety}
                                            label="Satiety Check"
                                            description={t('satietyDesc')}
                                        />
                                        <div className="mt-12 flex justify-center">
                                            <Button
                                                size="lg"
                                                onClick={handleFinishSession}
                                                className="rounded-[2rem] px-12 h-16 text-lg font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-transform"
                                            >
                                                Complete Session
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            )}

                            {step === 'complete' && (
                                <motion.div
                                    key="complete"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center space-y-8"
                                >
                                    <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                                        <Sparkles className="w-16 h-16 text-primary" />
                                    </div>
                                    <h1 className="text-4xl font-black font-headline text-foreground">
                                        {t('sessionComplete')}
                                    </h1>
                                    <p className="text-xl text-muted-foreground">
                                        {t('pointsAwarded')}
                                    </p>

                                    <div className="pt-8">
                                        <Button asChild size="lg" className="rounded-2xl px-12 h-16 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20">
                                            <Link href="/">
                                                {t('backToHome')}
                                            </Link>
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
