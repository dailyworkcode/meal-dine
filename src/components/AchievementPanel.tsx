'use client';

import * as React from 'react';
import { Trophy, Star, Target, Droplets, Wind, Moon, Brain, CheckCircle2, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getUnlockedAchievements, Achievement } from '@/lib/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { useXP } from '@/hooks/useXP';
import { getLevelProgress } from '@/lib/xp';
import { cn } from '@/lib/utils';

export const ACHIEVEMENTS = [
    { id: 'hydration_novice', title: 'Hydration Novice', description: 'Log your first water intake', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'breathing_master', title: 'Serenity Seeker', description: 'Complete a breathing session', icon: Wind, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 'sleep_sage', title: 'Sleep Sage', description: 'Log a night of restorative sleep', icon: Moon, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { id: 'visionary_eater', title: 'Visionary Eater', description: 'Analyze your first meal with AI', icon: Brain, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { id: 'grocery_guru', title: 'Grocery Guru', description: 'Optimize your shopping list', icon: Target, color: 'text-pink-500', bg: 'bg-pink-500/10' },
];

export function AchievementPanel() {
    const { xp, level } = useXP();
    const [unlocked, setUnlocked] = React.useState<Achievement[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const load = async () => {
            const data = await getUnlockedAchievements();
            setUnlocked(data);
            setIsLoading(false);
        };
        load();
    }, []);

    const isUnlocked = (id: string) => unlocked.some(a => a.id === id);
    const milestoneProgress = (unlocked.length / ACHIEVEMENTS.length) * 100;
    const levelProgress = getLevelProgress(xp);

    return (
        <Card className="glass-premium border-none rounded-[3rem] overflow-hidden shadow-2xl">
            <CardContent className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Leveling System Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-primary/20 rounded-[1.5rem] flex items-center justify-center text-primary font-black font-headline text-3xl shadow-lg shadow-primary/10">
                                    {level}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Current Level</p>
                                    <h4 className="text-xl font-black font-headline tracking-tight">Warrior Status</h4>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{xp} Total XP</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary/60">
                                <span>Next Level Progress</span>
                                <span>{levelProgress}%</span>
                            </div>
                            <Progress value={levelProgress} className="h-3 rounded-full bg-primary/10 shadow-inner" />
                        </div>
                    </div>

                    {/* Milestone Progress Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">Milestone Hub</p>
                                <h4 className="text-xl font-black font-headline tracking-tight">Achievements Unlocked</h4>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-amber-600/60">
                                <span>Completion</span>
                                <span>{Math.round(milestoneProgress)}%</span>
                            </div>
                            <Progress value={milestoneProgress} className="h-3 rounded-full bg-amber-500/10 shadow-inner" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ACHIEVEMENTS.map((ach) => {
                        const unlocked = isUnlocked(ach.id);
                        const Icon = ach.icon;

                        return (
                            <motion.div
                                key={ach.id}
                                whileHover={unlocked ? { y: -5, scale: 1.02 } : {}}
                                className={cn(
                                    "relative p-6 rounded-[2rem] border transition-all duration-500",
                                    unlocked
                                        ? "bg-white dark:bg-zinc-900 border-primary/10 shadow-xl opacity-100"
                                        : "bg-muted/30 border-dashed border-muted-foreground/20 opacity-40 grayscale"
                                )}
                            >
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center relative", ach.bg)}>
                                        <Icon className={cn("w-8 h-8", ach.color)} />
                                        {unlocked && (
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white border-4 border-background">
                                                <CheckCircle2 className="w-3 h-3" />
                                            </div>
                                        )}
                                        {!unlocked && (
                                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
                                                <Lock className="w-10 h-10" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-black font-headline uppercase tracking-widest text-xs mb-1">{ach.title}</h4>
                                        <p className="text-[10px] text-muted-foreground font-medium leading-tight">{ach.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

