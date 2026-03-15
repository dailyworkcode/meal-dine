'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Link } from '@/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Moon, Sparkles, Zap, BatteryLow, BatteryFull } from 'lucide-react';
import { GlassParallax } from '@/components/GlassParallax';
import { SleepTracker } from '@/components/SleepTracker';
import { SleepAudioPlayer } from '@/components/SleepAudioPlayer';
import { motion } from 'framer-motion';

export default function SleepPage() {
    const t = useTranslations('LandingPage');

    return (
        <SidebarProvider>
            <SidebarInset>
                <div className="min-h-screen relative overflow-hidden bg-[#020617]">
                    <GlassParallax />

                    {/* Stars Background */}
                    <div className="fixed inset-0 z-0 pointer-events-none">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-white rounded-full"
                                initial={{ opacity: Math.random() }}
                                animate={{ opacity: [0.2, 0.8, 0.2] }}
                                transition={{ duration: 3 + Math.random() * 4, repeat: Infinity }}
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                }}
                            />
                        ))}
                    </div>

                    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
                        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" asChild className="rounded-full text-white hover:bg-white/5">
                                    <Link href="/">
                                        <ArrowLeft className="h-5 w-5" />
                                    </Link>
                                </Button>
                                <div className="flex items-center gap-2">
                                    <Moon className="w-5 h-5 text-blue-400" />
                                    <span className="text-xl font-black font-headline tracking-tighter text-white">
                                        Sleep & Recovery
                                    </span>
                                </div>
                            </div>
                            <LanguageSwitcher />
                        </div>
                    </header>

                    <main className="container mx-auto px-4 py-12 max-w-4xl space-y-16 relative z-10">
                        {/* Hero Section */}
                        <div className="text-center space-y-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-4"
                            >
                                <Sparkles className="w-4 h-4" />
                                Circadian Optimization
                            </motion.div>
                            <h1 className="text-5xl md:text-6xl font-black font-headline text-white tracking-tight leading-none">
                                Recharge Your Body, <br />
                                Renew Your Mind
                            </h1>
                            <p className="text-blue-200/60 text-lg max-w-2xl mx-auto">
                                Log your sleep patterns and get AI-driven insights into your body's recovery cycle.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <SleepTracker />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <SleepAudioPlayer />
                            </motion.div>

                            {/* Recovery Insights */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#0f172a]/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 shadow-xl space-y-4">
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
                                        <BatteryFull className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-black font-headline text-white">Why Recovery Matters?</h3>
                                    <p className="text-sm text-blue-200/60 leading-relaxed">
                                        Sleep is when your body repairs tissues, synthesizes proteins, and consolidates memories. A high recovery score means your central nervous system is ready for intense work or exercise.
                                    </p>
                                </div>
                                <div className="bg-[#0f172a]/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 shadow-xl space-y-4">
                                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-black font-headline text-white">The Golden Ratio</h3>
                                    <p className="text-sm text-blue-200/60 leading-relaxed">
                                        Consistency is more important than duration. Waking up within the same 30-minute window every day helps stabilize your circadian rhythm.
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
