'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SUGGESTED_GEAR, getProductLink } from '@/lib/affiliate';
import { CheckCircle2, Pause, Play, RotateCcw, ShoppingBag, Sparkles } from 'lucide-react';
import * as React from 'react';

interface YogaTimerProps {
    durationInSeconds: number;
    onComplete?: () => void;
}

export function YogaTimer({ durationInSeconds, onComplete }: YogaTimerProps) {
    const [timeLeft, setTimeLeft] = React.useState(durationInSeconds);
    const [isActive, setIsActive] = React.useState(false);
    const [isCompleted, setIsCompleted] = React.useState(false);

    React.useEffect(() => {
        setTimeLeft(durationInSeconds);
        setIsActive(false);
        setIsCompleted(false);
    }, [durationInSeconds]);

    React.useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            setIsCompleted(true);
            onComplete?.();
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, onComplete]);

    const toggleActive = () => setIsActive(!isActive);

    const reset = () => {
        setTimeLeft(durationInSeconds);
        setIsActive(false);
        setIsCompleted(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((durationInSeconds - timeLeft) / durationInSeconds) * 100;

    return (
        <div className="flex flex-col items-center space-y-4 p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
            <div className="text-5xl font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {formatTime(timeLeft)}
            </div>

            <Progress value={progress} className="h-3 w-full bg-emerald-100 dark:bg-emerald-900/30" indicatorClassName="bg-emerald-500" />

            <div className="flex gap-4">
                {isCompleted ? (
                    <div className="flex items-center gap-2 text-emerald-600 font-bold animate-in zoom-in duration-300">
                        <CheckCircle2 className="w-6 h-6" />
                        Pose Complete!
                    </div>
                ) : (
                    <>
                        <Button
                            size="lg"
                            className={`rounded-full shadow-lg ${isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                            onClick={toggleActive}
                        >
                            {isActive ? (
                                <>
                                    <Pause className="mr-2 h-5 w-5 fill-current" />
                                    Pause
                                </>
                            ) : (
                                <>
                                    <Play className="mr-2 h-5 w-5 fill-current" />
                                    Start Pose
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full h-12 w-12 border-emerald-200 hover:bg-emerald-50"
                            onClick={reset}
                        >
                            <RotateCcw className="h-5 w-5" />
                        </Button>
                    </>
                )}
            </div>

            {/* Premium Affiliate Integration: Yoga Gear */}
            <div className="w-full pt-8 border-t border-emerald-500/10">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/60">Gear Up for Zen</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {SUGGESTED_GEAR.yoga.slice(0, 3).map((item) => (
                        <Button
                            key={item.name}
                            variant="ghost"
                            size="sm"
                            className="h-auto py-3 px-4 rounded-xl flex flex-col items-start gap-1 bg-white/50 hover:bg-emerald-100 hover:scale-105 transition-all group"
                            onClick={() => window.open(getProductLink(item.search), '_blank')}
                        >
                            <span className="text-[9px] font-bold text-emerald-800 leading-tight group-hover:text-emerald-900">{item.name}</span>
                            <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-emerald-600/40 group-hover:text-emerald-600">
                                <ShoppingBag className="w-2 h-2" />
                                Gear Up
                            </div>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
