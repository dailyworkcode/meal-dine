'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Link } from '@/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wind, Sparkles, Heart, Brain } from 'lucide-react';
import { GlassParallax } from '@/components/GlassParallax';
import { BreathingExercise } from '@/components/BreathingExercise';
import { motion } from 'framer-motion';

export default function SerenityPage() {
    const t = useTranslations('LandingPage');

    return (
        <SidebarProvider>
            <SidebarInset>
                <div className="min-h-screen relative overflow-hidden bg-background">
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
                                    <Wind className="w-5 h-5 text-primary" />
                                    <span className="text-xl font-black font-headline tracking-tighter text-foreground">
                                        Zen Practice
                                    </span>
                                </div>
                            </div>
                            <LanguageSwitcher />
                        </div>
                    </header>

                    <main className="container mx-auto px-4 py-12 max-w-4xl space-y-16">
                        {/* Hero Section */}
                        <div className="text-center space-y-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-4"
                            >
                                <Sparkles className="w-4 h-4" />
                                Conscious Respiration
                            </motion.div>
                            <h1 className="text-5xl md:text-6xl font-black font-headline text-foreground tracking-tight leading-none">
                                Find Your Center, <br />
                                One Breath at a Time
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Use these guided breathing patterns to reduce stress, improve focus, or energize your day.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <BreathingExercise />
                            </motion.div>

                            {/* Benefits Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="glass-card p-8 rounded-[2.5rem] border-none shadow-xl space-y-4">
                                    <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-600">
                                        <Brain className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-black font-headline">Reduce Stress</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Slow, deep breaths signal your brain to lower cortisol and activate the parasympathetic nervous system.
                                    </p>
                                </div>
                                <div className="glass-card p-8 rounded-[2.5rem] border-none shadow-xl space-y-4">
                                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600">
                                        <Heart className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-black font-headline">Lower Heart Rate</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Rhythmic breathing helps stabilize your heart rate variability (HRV), a key indicator of cardiovascular health.
                                    </p>
                                </div>
                                <div className="glass-card p-8 rounded-[2.5rem] border-none shadow-xl space-y-4">
                                    <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-600">
                                        <Wind className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-black font-headline">Increase Focus</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Conscious breathing improves oxygen flow to the prefrontal cortex, enhancing mental clarity and attention.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
