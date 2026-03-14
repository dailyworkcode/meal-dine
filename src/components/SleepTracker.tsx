'use client';

import * as React from 'react';
import { Moon, Star, Info, TrendingUp, History, Save, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { saveSleep, getSleep, SleepData } from '@/lib/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useAchievements } from '@/hooks/useAchievements';

export function SleepTracker() {
    const { unlock } = useAchievements();
    const today = new Date().toISOString().split('T')[0];
    const { toast } = useToast();
    const [duration, setDuration] = React.useState(7);
    const [quality, setQuality] = React.useState(7);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
        const loadSleep = async () => {
            const data = await getSleep(today);
            if (data) {
                setDuration(data.duration);
                setQuality(data.quality);
            }
            setIsLoading(false);
        };
        loadSleep();
    }, [today]);

    const calculateRecovery = () => {
        // Simple heuristic for recovery score
        const base = (duration / 8) * 50;
        const qual = (quality / 10) * 50;
        return Math.min(100, Math.round(base + qual));
    };

    const handleSave = async () => {
        setIsSaving(true);
        const recoveryScore = calculateRecovery();
        const data: SleepData = {
            duration,
            quality,
            recoveryScore,
            notes: '',
        };
        await saveSleep(today, data);
        setIsSaving(false);
        unlock('sleep_sage', 'Sleep Sage');
        toast({
            title: "Sleep Logged!",
            description: `Recovery Score: ${recoveryScore}%`,
        });
    };

    return (
        <Card className="glass-premium border-none rounded-[3rem] overflow-hidden shadow-2xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white">
            <CardContent className="p-10 space-y-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-blue-400">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Rest & Recovery</span>
                        </div>
                        <h3 className="text-3xl font-black font-headline tracking-tighter">Sleep Analytics</h3>
                    </div>
                    <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/20">
                        <Moon className="w-8 h-8 text-blue-400" />
                    </div>
                </div>

                {/* Moon Animation Area */}
                <div className="relative h-48 flex items-center justify-center">
                    <motion.div
                        className="absolute w-40 h-40 bg-blue-500/10 rounded-full blur-[60px]"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />
                    <motion.div
                        className="relative z-10"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <div className="relative">
                            <Moon className="w-32 h-32 text-blue-100 drop-shadow-[0_0_20px_rgba(191,219,254,0.5)]" />
                            <motion.div
                                className="absolute -top-4 -right-4"
                                animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                            >
                                <Sparkles className="w-8 h-8 text-blue-300/60" />
                            </motion.div>
                            <motion.div
                                className="absolute -top-8 right-8"
                                animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                            >
                                <Sparkles className="w-6 h-6 text-blue-300/40" />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-bold text-blue-200/60 uppercase tracking-widest">Duration</span>
                            <span className="text-2xl font-black font-headline text-blue-100">{duration}h</span>
                        </div>
                        <Slider
                            value={[duration]}
                            onValueChange={(v) => setDuration(v[0])}
                            max={12}
                            step={0.5}
                            className="[&_[role=slider]]:bg-blue-400 [&_[role=slider]]:border-blue-400 [&_.relative]:bg-blue-900/50"
                        />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-bold text-blue-200/60 uppercase tracking-widest">Quality</span>
                            <span className="text-2xl font-black font-headline text-blue-100">{quality}/10</span>
                        </div>
                        <Slider
                            value={[quality]}
                            onValueChange={(v) => setQuality(v[0])}
                            max={10}
                            step={1}
                            className="[&_[role=slider]]:bg-blue-400 [&_[role=slider]]:border-blue-400 [&_.relative]:bg-blue-900/50"
                        />
                    </div>
                </div>

                {/* Recovery Score */}
                <div className="bg-white/5 rounded-[2rem] p-8 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Recovery Score</p>
                            <p className="text-2xl font-black font-headline text-white">{calculateRecovery()}%</p>
                        </div>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-12 font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                    >
                        {isSaving ? <Save className="w-5 h-5 animate-pulse" /> : 'Log Sleep'}
                    </Button>
                </div>

                {/* Tips */}
                <div className="flex items-start gap-4 text-blue-200/70">
                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-xs leading-relaxed font-medium italic">
                        "Your recovery score is an estimate based on sleep deepness and duration. Consistent 7.5h+ sleep improves cognitive longevity."
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
