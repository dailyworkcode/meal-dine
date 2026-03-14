'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, MessageCircle, Activity, Brain, Zap, ArrowRight, Pill } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { calculateHabitStreak } from '@/lib/streaks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getProductLink } from '@/lib/affiliate'; // Added getProductLink import

export function PulseAI() {
    const [isOpen, setIsOpen] = useState(false);
    const [insight, setInsight] = useState('');
    const [type, setType] = useState<'info' | 'warning' | 'success'>('info');

    const [habits] = useLocalStorage<any>('dailyHabits', {});
    const [waterIntake] = useLocalStorage<any>('waterIntake', {});
    const [userProfile] = useLocalStorage<any>('userProfile', {});
    const [zenJournal] = useLocalStorage<any[]>('zenJournal', []);

    const generateInsight = () => {
        const hour = new Date().getHours();
        const today = new Date().toISOString().split('T')[0];
        const todayHabits = habits[today] || {};
        const completedCount = Object.values(todayHabits).filter(Boolean).length;
        const streak = calculateHabitStreak(habits);
        const lastEntry = zenJournal[0];

        if (streak >= 3) {
            setInsight(`Unstoppable! You're on a ${streak}-day streak. Consistency is your superpower, ${userProfile?.name || 'Warrior'}.`);
            setType('success');
        } else if (lastEntry && lastEntry.mood === 'anxious') {
            setInsight("I noticed you're feeling a bit anxious. Let's try a 2-minute 'Zen Practice' session to ground yourself.");
            setType('warning');
        } else if (lastEntry && lastEntry.mood === 'tired') {
            setInsight("Feeling tired? A quick stretching session (Yoga) can boost your energy naturally. You might also consider Vitamin D3 for chronic fatigue.");
            setType('info');
        } else if (userProfile?.level && userProfile.level > 1 && Math.random() > 0.7) {
            setInsight(`Incredible growth, ${userProfile.name}! Level ${userProfile.level} suits you. Every healthy choice is carving out a new destiny.`);
            setType('success');
        } else if (hour < 10 && completedCount === 0) {
            setInsight("Morning, " + (userProfile?.name || "there") + "! A quick deep breath now will set a calm tone for your entire day.");
            setType('info');
        } else if (completedCount >= 3) {
            setInsight("Phenomenal work! You've crushed 3+ habits. Your momentum is building a stronger, healthier version of you.");
            setType('success');
        } else if (hour > 14 && (waterIntake[today] || 0) < 4) {
            setInsight("Hydration Alert: You're slightly behind your water goal. A glass now will banish that mid-afternoon slump.");
            setType('warning');
        } else {
            setInsight("Zen Thought: Health is not a destination, it's a daily practice of showing up for yourself.");
            setType('info');
        }
    };

    useEffect(() => {
        generateInsight();
        const interval = setInterval(generateInsight, 300000); // Regenerate every 5 mins
        return () => clearInterval(interval);
    }, [habits, waterIntake, userProfile, zenJournal]); // Added zenJournal to dependencies

    return (
        <div className="fixed bottom-28 right-8 z-[100] flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
                        className="w-80"
                    >
                        <Card className="glass-card p-6 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />

                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-primary">Pulse AI</span>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-sm font-medium leading-relaxed text-foreground/90">
                                {insight}
                            </p>

                            {insight.includes('Vitamin D') && (
                                <motion.button
                                    whileHover={{ x: 5 }}
                                    onClick={() => {
                                        if (insight.includes('Vitamin D3')) {
                                            window.open(getProductLink('vitamin d3 k2'), '_blank');
                                        } else {
                                            // Standard action
                                        }
                                    }}
                                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors mt-2"
                                >
                                    <Pill className="w-4 h-4" /> View Supplement
                                </motion.button>
                            )}

                            <div className="mt-6 pt-4 border-t border-primary/10 flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center border-2 border-background">
                                        <Activity className="w-3 h-3 text-blue-500" />
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center border-2 border-background">
                                        <Brain className="w-3 h-3 text-purple-500" />
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Real-time Analysis</span>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center relative group"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                {isOpen ? <X className="w-8 h-8 relative z-10" /> : <MessageCircle className="w-8 h-8 relative z-10" />}

                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                )}
            </motion.button>
        </div>
    );
}
