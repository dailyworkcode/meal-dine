'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Medal, Trophy, Star, Droplets, Zap, Wind, Target } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn, getTodayKey } from '@/lib/utils';

interface Badge {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    isUnlocked: boolean;
}

export function AchievementGallery() {
    const [habits] = useLocalStorage<any>('dailyHabits', {});
    const [waterIntake] = useLocalStorage<any>('waterIntake', {});
    const today = getTodayKey();

    const badges: Badge[] = useMemo(() => {
        const todayHabits = habits[today] || {};
        const completedHabitsCount = Object.values(todayHabits).filter(Boolean).length;
        const currentWater = waterIntake[today] || 0;

        return [
            {
                id: 'perfect-day',
                title: 'Perfect Pulse',
                description: 'Complete all daily habits',
                icon: Target,
                color: 'bg-emerald-500',
                isUnlocked: completedHabitsCount === 4
            },
            {
                id: 'hydration-hero',
                title: 'Hydration Hero',
                description: 'Reach daily water goal',
                icon: Droplets,
                color: 'bg-blue-500',
                isUnlocked: currentWater >= 8
            },
            {
                id: 'zen-student',
                title: 'Zen Student',
                description: 'Complete a breathing session',
                icon: Wind,
                color: 'bg-purple-500',
                isUnlocked: !!todayHabits['breath']
            },
            {
                id: 'energy-surge',
                title: 'Energy Surge',
                description: 'Complete a yoga session',
                icon: Zap,
                color: 'bg-amber-500',
                isUnlocked: !!todayHabits['yoga']
            }
        ];
    }, [habits, waterIntake, today]);

    return (
        <Card className="glass-card rounded-[2.5rem] overflow-hidden border-none shadow-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-foreground/70">
                    <Trophy className="w-4 h-4 text-primary" />
                    Ascension Gallery
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {badges.map((badge, index) => {
                        const Icon = badge.icon;
                        return (
                            <motion.div
                                key={badge.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative flex flex-col items-center text-center space-y-3"
                            >
                                <div className={cn(
                                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 relative overflow-hidden",
                                    badge.isUnlocked
                                        ? cn(badge.color, "text-white shadow-xl shadow-primary/20 scale-110")
                                        : "bg-muted/50 text-muted-foreground grayscale opacity-40"
                                )}>
                                    {badge.isUnlocked && (
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute inset-0 bg-white"
                                        />
                                    )}
                                    <Icon className={cn("w-8 h-8 relative z-10", badge.isUnlocked && "animate-float")} />
                                </div>
                                <div>
                                    <p className={cn(
                                        "text-xs font-black uppercase tracking-tighter mb-1",
                                        badge.isUnlocked ? "text-foreground" : "text-muted-foreground"
                                    )}>
                                        {badge.title}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground/60 leading-tight">
                                        {badge.description}
                                    </p>
                                </div>
                                {badge.isUnlocked && (
                                    <div className="absolute -top-1 -right-1 bg-primary text-[8px] font-black text-primary-foreground px-1.5 py-0.5 rounded-full shadow-lg">
                                        +50
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
