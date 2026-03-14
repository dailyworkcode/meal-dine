'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useXP } from '@/hooks/useXP';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getHydration } from '@/lib/storage';
import { getTodayKey, cn } from '@/lib/utils';
import { Flower2, Leaf, CloudRain, Sun, Wind } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export function WellnessGarden() {
    const { xp } = useXP();
    const [hydration, setHydration] = React.useState(0);
    const [habits] = useLocalStorage<any>('dailyHabits', {});

    React.useEffect(() => {
        const load = async () => {
            const h = await getHydration(getTodayKey());
            setHydration(h);
        };
        load();
    }, []);

    // Calculate growth stages based on data
    const waterLevel = Math.min(Math.floor(hydration / 2), 5); // 0-5 stage
    const today = getTodayKey();
    const habitCount = Object.values(habits[today] || {}).filter(Boolean).length;
    const sunflowerStage = Math.min(habitCount, 5);

    return (
        <Card className="glass-premium border-none rounded-[3rem] overflow-hidden shadow-2xl bg-gradient-to-b from-sky-400/10 to-emerald-400/10">
            <CardHeader className="p-8 pb-0">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">The Living Sanctuary</p>
                        <h3 className="text-3xl font-black font-headline tracking-tighter">Your Wellness Garden</h3>
                    </div>
                    <div className="flex gap-2">
                        <Sun className="w-5 h-5 text-amber-500 animate-pulse-slow" />
                        <CloudRain className="w-5 h-5 text-blue-400" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-8 relative h-[300px] flex items-end justify-around gap-4">
                {/* Background Hill */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-emerald-500/10 rounded-t-[100%] scale-x-125" />

                {/* Water Willow */}
                <Plant
                    label="Life Willow"
                    stage={waterLevel}
                    maxStage={5}
                    color="text-blue-500"
                    icon={<Leaf className="w-4 h-4" />}
                />

                {/* Habit Sunflowers */}
                <Plant
                    label="Streak Sunflowers"
                    stage={sunflowerStage}
                    maxStage={5}
                    color="text-amber-500"
                    icon={<Flower2 className="w-6 h-6" />}
                />

                {/* Wisdom Lilies (XP based) */}
                <Plant
                    label="Wisdom Lilies"
                    stage={Math.min(Math.floor(xp / 1000), 5)}
                    maxStage={5}
                    color="text-purple-500"
                    icon={<Flower2 className="w-4 h-4" />}
                />

                <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                        animate={{ x: [0, 100, 0], y: [0, -10, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-10 left-10"
                    >
                        <Wind className="w-12 h-12 text-white/10" />
                    </motion.div>
                </div>
            </CardContent>
        </Card>
    );
}

function Plant({ label, stage, maxStage, color, icon }: { label: string, stage: number, maxStage: number, color: string, icon: React.ReactNode }) {
    return (
        <div className="relative group flex flex-col items-center">
            <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-background/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10">
                {label} (Lvl {stage})
            </div>

            <div className="flex flex-col items-center gap-0">
                {[...Array(stage)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ delay: i * 0.1, type: "spring" }}
                        className={cn(color, "relative")}
                        style={{ marginBottom: i === 0 ? 0 : -10 }}
                    >
                        {icon}
                        {i === stage - 1 && (
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute -top-1 -right-1"
                            >
                                <Sparkle />
                            </motion.div>
                        )}
                    </motion.div>
                ))}
                {stage === 0 && (
                    <div className="w-4 h-4 bg-emerald-700/20 rounded-full blur-[2px]" />
                )}
            </div>

            {/* Base */}
            <div className="w-12 h-2 bg-emerald-900/10 rounded-full mt-1" />
        </div>
    );
}

function Sparkle() {
    return (
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 0L3.7 2.3L6 3L3.7 3.7L3 6L2.3 3.7L0 3L2.3 2.3L3 0Z" fill="#FBBF24" />
        </svg>
    );
}
