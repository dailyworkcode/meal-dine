'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Play, Pause, RefreshCw, ChevronRight, Volume2, VolumeX, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAchievements } from '@/hooks/useAchievements';
import { saveMeditationSession } from '@/lib/storage';

type BreathPhase = 'Inhale' | 'Hold' | 'Exhale' | 'Rest';

interface BreathingPattern {
    name: string;
    inhale: number;
    hold1: number;
    exhale: number;
    hold2: number;
    color: string;
}

const PATTERNS: BreathingPattern[] = [
    { name: 'Box Breathing', inhale: 4, hold1: 4, exhale: 4, hold2: 4, color: 'bg-emerald-500' },
    { name: 'Relaxation (4-7-8)', inhale: 4, hold1: 7, exhale: 8, hold2: 0, color: 'bg-purple-500' },
    { name: 'Energizing', inhale: 6, hold1: 0, exhale: 2, hold2: 0, color: 'bg-orange-500' },
];

export function BreathingExercise() {
    const { unlock } = useAchievements();
    const [isActive, setIsActive] = React.useState(false);
    const [pattern, setPattern] = React.useState(PATTERNS[0]);
    const [phase, setPhase] = React.useState<BreathPhase>('Inhale');
    const [timeLeft, setTimeLeft] = React.useState(pattern.inhale);
    const [isMuted, setIsMuted] = React.useState(false);
    const [isImmersive, setIsImmersive] = React.useState(false);
    const [sessionStartTime, setSessionStartTime] = React.useState<number | null>(null);
    const audioContextRef = React.useRef<AudioContext | null>(null);
    const oscillatorRef = React.useRef<OscillatorNode | null>(null);
    const gainNodeRef = React.useRef<GainNode | null>(null);

    // Audio Initialization
    const initAudio = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            gainNodeRef.current = audioContextRef.current.createGain();
            gainNodeRef.current.connect(audioContextRef.current.destination);
            gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);
        }
    };

    const startZenTone = () => {
        if (!audioContextRef.current || !gainNodeRef.current || isMuted) return;
        oscillatorRef.current = audioContextRef.current.createOscillator();
        oscillatorRef.current.type = 'sine';
        oscillatorRef.current.frequency.setValueAtTime(432, audioContextRef.current.currentTime); // Zen 432Hz
        oscillatorRef.current.connect(gainNodeRef.current);
        oscillatorRef.current.start();
        gainNodeRef.current.gain.setTargetAtTime(0.1, audioContextRef.current.currentTime, 0.5);
    };

    const stopZenTone = () => {
        if (gainNodeRef.current && audioContextRef.current) {
            gainNodeRef.current.gain.setTargetAtTime(0, audioContextRef.current.currentTime, 0.2);
            setTimeout(() => {
                oscillatorRef.current?.stop();
                oscillatorRef.current?.disconnect();
            }, 200);
        }
    };

    React.useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isActive) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        unlock('breathing_master', 'Serenity Seeker');
                        // Switch phase
                        if (phase === 'Inhale') {
                            if (pattern.hold1 > 0) {
                                setPhase('Hold');
                                return pattern.hold1;
                            } else {
                                setPhase('Exhale');
                                return pattern.exhale;
                            }
                        } else if (phase === 'Hold') {
                            setPhase('Exhale');
                            return pattern.exhale;
                        } else if (phase === 'Exhale') {
                            if (pattern.hold2 > 0) {
                                setPhase('Rest');
                                return pattern.hold2;
                            } else {
                                setPhase('Inhale');
                                return pattern.inhale;
                            }
                        } else {
                            setPhase('Inhale');
                            return pattern.inhale;
                        }
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isActive, phase, pattern, unlock]);

    const toggleActive = () => {
        if (!isActive) {
            initAudio();
            startZenTone();
            setSessionStartTime(Date.now());
            setPhase('Inhale');
            setTimeLeft(pattern.inhale);
        } else {
            stopZenTone();
            if (sessionStartTime) {
                const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
                if (duration > 10) {
                    saveMeditationSession({
                        id: crypto.randomUUID(),
                        duration,
                        date: new Date().toISOString(),
                        pattern: pattern.name
                    });
                    if (duration >= 300) unlock('zen_master', 'Zen Master');
                }
            }
        }
        setIsActive(!isActive);
    };

    const reset = () => {
        stopZenTone();
        setIsActive(false);
        setPhase('Inhale');
        setTimeLeft(pattern.inhale);
    };

    return (
        <div className={cn(
            "transition-all duration-1000",
            isImmersive ? "fixed inset-0 z-[100] bg-background flex items-center justify-center p-8" : "relative"
        )}>
            <Card className={cn(
                "glass-premium border-none rounded-[3rem] overflow-hidden shadow-2xl bg-gradient-to-br from-background via-background/40 to-primary/5 transition-all duration-1000",
                isImmersive ? "w-full h-full border-none shadow-none bg-none" : ""
            )}>
                <CardContent className={cn("p-12 space-y-12", isImmersive ? "flex flex-col items-center justify-center h-full space-y-20" : "")}>
                    <div className="flex flex-col items-center justify-center space-y-8">
                        {/* Header Actions */}
                        {!isImmersive && (
                            <div className="absolute top-8 right-8 flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full"
                                    onClick={() => setIsMuted(!isMuted)}
                                >
                                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full"
                                    onClick={() => setIsImmersive(!isImmersive)}
                                >
                                    <Maximize2 className="w-5 h-5" />
                                </Button>
                            </div>
                        )}

                        {isImmersive && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-8 right-8 rounded-full text-muted-foreground hover:text-foreground"
                                onClick={() => setIsImmersive(false)}
                            >
                                <Minimize2 className="w-8 h-8" />
                            </Button>
                        )}

                        {/* Breathing Orb */}
                        <div className={cn(
                            "relative flex items-center justify-center transition-all duration-1000",
                            isImmersive ? "w-[400px] h-[400px] md:w-[600px] md:h-[600px]" : "w-64 h-64"
                        )}>
                            {/* Outer Pulse */}
                            <AnimatePresence>
                                {isActive && (
                                    <motion.div
                                        className={cn("absolute inset-0 rounded-full opacity-10", pattern.color)}
                                        animate={{
                                            scale: phase === 'Inhale' ? [1, 1.5] : phase === 'Exhale' ? [1.5, 1] : 1.5,
                                        }}
                                        transition={{ duration: timeLeft, ease: "easeInOut" }}
                                    />
                                )}
                            </AnimatePresence>

                            {/* Main Orb */}
                            <motion.div
                                className={cn(
                                    "relative z-10 rounded-full shadow-2xl flex flex-col items-center justify-center text-white transition-all duration-1000",
                                    pattern.color,
                                    isImmersive ? "w-80 h-80 md:w-96 md:h-96" : "w-48 h-48"
                                )}
                                animate={{
                                    scale: phase === 'Inhale' ? 1.2 : phase === 'Exhale' ? 0.8 : 1,
                                }}
                                transition={{ duration: isActive ? timeLeft : 2, ease: "easeInOut", repeat: isActive ? 0 : Infinity }}
                            >
                                <Wind className={cn("mb-2 transition-all", isImmersive ? "w-20 h-20" : "w-12 h-12")} />
                                <span className={cn("font-black font-headline uppercase tracking-widest", isImmersive ? "text-4xl" : "text-2xl")}>
                                    {isActive ? phase : 'Peace'}
                                </span>
                                {isActive && <span className={cn("font-black mt-2", isImmersive ? "text-6xl" : "text-4xl")}>{timeLeft}s</span>}
                            </motion.div>
                        </div>

                        {/* Immersive Phase Text */}
                        {isImmersive && isActive && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center space-y-4"
                            >
                                <p className="text-2xl font-medium text-muted-foreground italic">
                                    {phase === 'Inhale' && "Take a deep breath in..."}
                                    {phase === 'Hold' && "Hold that stillness..."}
                                    {phase === 'Exhale' && "Let it all go..."}
                                    {phase === 'Rest' && "Pause and reflect..."}
                                </p>
                            </motion.div>
                        )}

                        {/* Controls */}
                        <div className="flex items-center gap-6">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="w-16 h-16 rounded-full shadow-xl hover:scale-110 transition-transform"
                                onClick={reset}
                            >
                                <RefreshCw className="w-6 h-6" />
                            </Button>
                            <Button
                                size="lg"
                                className={cn("w-24 h-24 rounded-full shadow-2xl hover:scale-105 transition-all", isActive ? "bg-red-500 hover:bg-red-600" : "bg-primary")}
                                onClick={toggleActive}
                            >
                                {isActive ? <Pause className="w-10 h-10 fill-white" /> : <Play className="w-10 h-10 fill-white translate-x-1" />}
                            </Button>
                            <div className="w-16" />
                        </div>
                    </div>

                    {!isImmersive && (
                        <>
                            {/* Pattern Selection */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Select Meditation Flow</h3>
                                <div className="flex flex-wrap justify-center gap-4">
                                    {PATTERNS.map((p) => (
                                        <Button
                                            key={p.name}
                                            variant={pattern.name === p.name ? 'default' : 'outline'}
                                            className={cn(
                                                "rounded-2xl px-8 h-12 font-bold transition-all",
                                                pattern.name === p.name ? "shadow-lg scale-105" : "hover:bg-primary/5"
                                            )}
                                            onClick={() => {
                                                setPattern(p);
                                                reset();
                                            }}
                                        >
                                            {p.name}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Stats Preview */}
                            <div className="bg-primary/5 rounded-[2rem] p-8 border border-primary/10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-black font-headline uppercase tracking-widest text-xs">Zen Tip</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {pattern.name === 'Box Breathing' && "The Navy SEALs use this to stay calm in high-pressure situations."}
                                                {pattern.name === 'Relaxation (4-7-8)' && "Perfect for winding down before sleep or after a stressful meeting."}
                                                {pattern.name === 'Energizing' && "A quick way to boost oxygen flow and alertness without caffeine."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
