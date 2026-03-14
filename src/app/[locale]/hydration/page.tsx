'use client';

import * as React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Link } from '@/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Droplets, Info, Sparkles } from 'lucide-react';
import { GlassParallax } from '@/components/GlassParallax';
import { WaterTracker } from '@/components/WaterTracker';
import { motion } from 'framer-motion';

export default function HydrationPage() {
    const t = useTranslations('HomePage');
    const locale = useLocale();

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
                                    <Droplets className="w-5 h-5 text-blue-500" />
                                    <span className="text-xl font-black font-headline tracking-tighter text-foreground">
                                        Hydration Hub
                                    </span>
                                </div>
                            </div>
                            <LanguageSwitcher />
                        </div>
                    </header>

                    <main className="container mx-auto px-4 py-12 max-w-4xl space-y-12">
                        {/* Hero Section */}
                        <div className="text-center space-y-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 text-xs font-black uppercase tracking-widest mb-4"
                            >
                                <Sparkles className="w-4 h-4" />
                                Optimal Fluid Balance
                            </motion.div>
                            <h1 className="text-5xl md:text-6xl font-black font-headline text-foreground tracking-tight">
                                Stay Fluid, Stay Focused
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Track your daily water intake and see how caffeine affects your hydration goals.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <WaterTracker />
                            </motion.div>

                            {/* Hydration Tips */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass-card p-8 rounded-[2.5rem] border-none shadow-xl space-y-4">
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600">
                                        <Info className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-black font-headline">Why it matters?</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Proper hydration improves cognitive function, boosts energy levels, and helps maintain healthy skin. Your body is about 60% water!
                                    </p>
                                </div>
                                <div className="glass-card p-8 rounded-[2.5rem] border-none shadow-xl space-y-4 text-blue-900 dark:text-blue-100 bg-blue-500/5">
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-600">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-black font-headline text-foreground">Pro Tip</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed text-foreground">
                                        Drink a glass of water first thing in the morning to kickstart your metabolism and rehydrate after sleep.
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
