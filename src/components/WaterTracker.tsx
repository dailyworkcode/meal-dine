'use client';

import * as React from 'react';
import { Droplets, Plus, Minus, Coffee, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTodayKey, cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { getHydration, saveHydration } from '@/lib/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { useAchievements } from '@/hooks/useAchievements';
import { useXP } from '@/hooks/useXP';
import confetti from 'canvas-confetti';

export function WaterTracker() {
    const t = useTranslations('HomePage');
    const { unlock } = useAchievements();
    const { awardXP, XP_ACTIONS } = useXP();
    const [currentIntake, setCurrentIntake] = React.useState(0);
    const [currentCaffeine, setCurrentCaffeine] = React.useState(0); // Caffeine still fits in local or can be added to DB later
    const [isLoading, setIsLoading] = React.useState(true);

    const today = getTodayKey();

    React.useEffect(() => {
        const loadHydration = async () => {
            const amount = await getHydration(today);
            setCurrentIntake(amount);
            setIsLoading(false);
        };
        loadHydration();
    }, [today]);

    // Base goal 10 glasses + 1 glass per cup of caffeine
    const baseGoal = 10;
    const dynamicGoal = baseGoal + currentCaffeine;

    const updateIntake = async (amount: number) => {
        const newIntake = Math.max(0, currentIntake + amount);
        setCurrentIntake(newIntake);
        await saveHydration(today, newIntake);
        if (newIntake > 0) {
            unlock('hydration_novice', 'Hydration Novice');
            if (amount > 0) {
                awardXP(XP_ACTIONS.LOG_WATER);
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#3b82f6', '#60a5fa', '#93c5fd']
                });
            }
        }
    };

    const progress = (currentIntake / dynamicGoal) * 100;

    return (
        <Card className="glass dark:glass-dark group hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] transition-all duration-700 overflow-hidden relative border-none rounded-[3rem]">
            {/* Wave Animation Background */}
            <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10">
                <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-blue-500/30"
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.min(100, progress)}%` }}
                    transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                >
                    <svg
                        className="absolute top-0 left-0 w-[200%] h-20 -translate-y-full"
                        viewBox="0 0 1000 100"
                        preserveAspectRatio="none"
                    >
                        <motion.path
                            d="M0,50 C150,150 350,0 500,50 C650,150 850,0 1000,50 L1000,100 L0,100 Z"
                            fill="currentColor"
                            animate={{ x: ['-50%', '0%'] }}
                            transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
                        />
                    </svg>
                </motion.div>
            </div>

            <CardHeader className="pb-2 relative z-10">
                <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 opacity-90">
                    <Waves className="w-5 h-5 animate-pulse" />
                    {t('hydrationFlow')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Water Section */}
                    <div className="space-y-4">
                        <div className="flex items-end justify-between">
                            <div className="flex flex-col">
                                <div className="flex items-baseline gap-2">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={currentIntake}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -20, opacity: 0 }}
                                            className="text-7xl font-black font-headline text-blue-600 dark:text-blue-400 tracking-tighter tabular-nums drop-shadow-md"
                                        >
                                            {currentIntake}
                                        </motion.span>
                                    </AnimatePresence>
                                    <span className="text-xl font-bold text-muted-foreground/60 mb-2">/ {dynamicGoal}</span>
                                </div>
                                <span className="text-xs font-black text-muted-foreground uppercase tracking-widest -mt-1">{t('glassesToday')}</span>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="rounded-2xl h-12 w-12 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all active:scale-95 shadow-inner"
                                    onClick={() => updateIntake(-1)}
                                >
                                    <Minus className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="default"
                                    size="icon"
                                    className="rounded-2xl h-12 w-12 bg-blue-500 hover:bg-blue-600 shadow-xl shadow-blue-500/40 transition-all active:scale-95"
                                    onClick={() => updateIntake(1)}
                                >
                                    <Plus className="h-5 w-5 text-white" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Caffeine Section */}
                    <div className="space-y-4 md:border-l border-primary/10 md:pl-8">
                        <div className="flex items-end justify-between">
                            <div className="flex flex-col">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-6xl font-black font-headline text-orange-600/80 dark:text-orange-400/80 tracking-tighter tabular-nums">{currentCaffeine}</span>
                                </div>
                                <span className="text-xs font-black text-muted-foreground uppercase tracking-widest -mt-1">{t('caffeine')}</span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="rounded-xl h-10 w-10 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all active:scale-90"
                                    onClick={() => setCurrentCaffeine(Math.max(0, currentCaffeine - 1))}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-xl h-10 w-10 border-orange-500/20 text-orange-600 hover:bg-orange-50 transition-all active:scale-90"
                                    onClick={() => setCurrentCaffeine(currentCaffeine + 1)}
                                >
                                    <Coffee className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <div className="relative h-6 w-full bg-blue-100/50 dark:bg-blue-900/10 rounded-full overflow-hidden border border-blue-200/20 shadow-inner">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, progress)}%` }}
                            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[10px] font-black text-blue-900 dark:text-blue-100 uppercase tracking-[0.3em] mix-blend-overlay">
                                {Math.round(progress)}% Optimized
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={cn(progress >= 100 ? "text-emerald-500" : "text-blue-600/60")}
                        >
                            {progress >= 100 ? (
                                <span className="flex items-center gap-1">
                                    <Droplets className="w-3 h-3" /> Fully Hydrated
                                </span>
                            ) : `${Math.max(0, dynamicGoal - currentIntake)} ${t('remaining')}`}
                        </motion.span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
