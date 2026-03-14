'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, Circle, Sparkles, Wind, Utensils, Zap, UserCheck, Check, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useXP } from '@/hooks/useXP';
import { getTodayKey, cn } from '@/lib/utils';
import { calculateHabitStreak } from '@/lib/streaks';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { BreathingTimer } from './BreathingTimer';
import { HabitInteractionModal } from './HabitInteractionModal';
import { fireSingleConfetti } from '@/lib/confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { useChronoTheme } from './ChronoThemeProvider';

const HABITS = [
    { id: 'meal', icon: Utensils, labelKey: 'habitMeal', type: 'reflection' },
    { id: 'yoga', icon: Zap, labelKey: 'habitYoga', type: 'reflection' },
    { id: 'breath', icon: Wind, labelKey: 'habitBreath', type: 'timer' },
    { id: 'profile', icon: UserCheck, labelKey: 'habitProfile', type: 'toggle' },
];

export function HabitTracker() {
    const t = useTranslations('Wellness');
    const [habits, setHabits] = useLocalStorage<{ [key: string]: { [habit: string]: boolean } }>('dailyHabits', {});
    const [activeHabit, setActiveHabit] = React.useState<string | null>(null);
    const today = getTodayKey();

    const { theme } = useChronoTheme();
    const { awardXP, XP_ACTIONS } = useXP();
    const todayHabits = habits[today] || {};
    const completedCount = Object.values(todayHabits).filter(Boolean).length;
    const progress = (completedCount / HABITS.length) * 100;
    const streak = calculateHabitStreak(habits);

    const completeHabit = (id: string) => {
        setHabits({
            ...habits,
            [today]: {
                ...todayHabits,
                [id]: true
            }
        });
        fireSingleConfetti();
        awardXP(XP_ACTIONS.COMPLETE_HABIT);
        setActiveHabit(null);
    };

    const handleHabitClick = (habit: typeof HABITS[0]) => {
        if (todayHabits[habit.id]) return;

        if (habit.type === 'toggle') {
            completeHabit(habit.id);
        } else {
            setActiveHabit(habit.id);
        }
    };

    const activeHabitData = HABITS.find(h => h.id === activeHabit);

    return (
        <>
            <Card className="glass-premium rounded-[3rem] overflow-hidden border-none shadow-2xl h-full relative group">
                <div className="absolute top-0 right-0 p-8 text-primary/5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                    <Sparkles className="w-48 h-48" />
                </div>

                <CardHeader className="p-8 pb-4 relative z-10">
                    <div className="flex items-center justify-between mb-2">
                        <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">
                                <Sparkles className="w-3 h-3 text-primary" />
                                {t('habitsTitle')}
                            </CardTitle>
                            <h3 className="text-3xl font-black font-headline text-foreground tracking-tighter">{t('habitsTitleMain')}</h3>
                        </div>
                        <div className="flex gap-4 items-center">
                            {streak > 0 && (
                                <div className="text-right flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-2xl border border-orange-500/20 animate-bounce-slow">
                                    <div>
                                        <p className="text-2xl font-black font-headline text-orange-600 leading-none">{streak}</p>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-orange-600/60">Day Streak</p>
                                    </div>
                                    <Flame className="w-8 h-8 text-orange-500 fill-orange-500" />
                                </div>
                            )}
                            <div className="text-right">
                                <p className="text-4xl font-black font-headline text-primary leading-none">{completedCount}/{HABITS.length}</p>
                                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">Completed</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary/40">
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-primary/10" />
                    </div>
                </CardHeader>

                <CardContent className="p-8 space-y-4 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {HABITS.map((habit, idx) => {
                            const Icon = habit.icon;
                            const isCompleted = !!todayHabits[habit.id];

                            return (
                                <motion.button
                                    key={habit.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => handleHabitClick(habit)}
                                    className={cn(
                                        "relative flex flex-col gap-4 p-6 rounded-[2.5rem] transition-all duration-500 text-left overflow-hidden",
                                        isCompleted
                                            ? "bg-primary text-white shadow-2xl shadow-primary/20"
                                            : "bg-background/40 hover:bg-background border border-primary/5 hover:border-primary/20 hover:shadow-xl hover:-translate-y-1"
                                    )}
                                >
                                    {isCompleted && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-4 right-4"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        </motion.div>
                                    )}

                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                                        isCompleted ? "bg-white/20" : "bg-background shadow-inner text-primary"
                                    )}>
                                        <Icon className="w-6 h-6" />
                                    </div>

                                    <div className="space-y-1">
                                        <p className={cn(
                                            "text-xs font-black uppercase tracking-widest",
                                            isCompleted ? "text-white/60" : "text-muted-foreground/60"
                                        )}>
                                            {habit.type}
                                        </p>
                                        <p className={cn(
                                            "font-black font-headline text-lg leading-none tracking-tight",
                                            isCompleted ? "text-white" : "text-foreground"
                                        )}>
                                            {t(habit.labelKey)}
                                        </p>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!activeHabit} onOpenChange={(open) => !open && setActiveHabit(null)}>
                <DialogContent className="sm:max-w-md rounded-[2.5rem] p-0 overflow-hidden border-none glass-card">
                    {activeHabitData?.type === 'timer' && (
                        <BreathingTimer
                            onComplete={() => completeHabit(activeHabit!)}
                            onClose={() => setActiveHabit(null)}
                        />
                    )}
                    {activeHabitData?.type === 'reflection' && (
                        <HabitInteractionModal
                            title={t(activeHabitData.labelKey)}
                            onComplete={() => completeHabit(activeHabit!)}
                            onClose={() => setActiveHabit(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
