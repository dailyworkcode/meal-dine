'use client';

import * as React from 'react';
import { Sun, Sunrise, Moon, Clock } from 'lucide-react';
import { useChronoTheme, ThemePreference } from './ChronoThemeProvider';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const THEMES: { id: ThemePreference; icon: any; label: string }[] = [
    { id: 'daylight', icon: Sun, label: 'Day' },
    { id: 'afternoon', icon: Sunrise, label: 'Afternoon' },
    { id: 'midnight', icon: Moon, label: 'Night' },
    { id: 'auto', icon: Clock, label: 'Auto' },
];

export function ThemeSwitcher() {
    const { preference, setPreference } = useChronoTheme();

    return (
        <TooltipProvider>
            <div className="flex items-center gap-1 p-1 bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-full border border-white/20 dark:border-white/10 shadow-lg">
                {THEMES.map((t) => {
                    const Icon = t.icon;
                    const isActive = preference === t.id;

                    return (
                        <Tooltip key={t.id}>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => setPreference(t.id)}
                                    className={cn(
                                        "relative p-1.5 md:p-2 rounded-full transition-all duration-500 hover:scale-110 active:scale-95",
                                        isActive
                                            ? "text-primary bg-white/40 dark:bg-white/10 shadow-inner"
                                            : "text-muted-foreground/60 hover:text-foreground hover:bg-white/10 dark:hover:bg-white/5"
                                    )}
                                >
                                    <Icon className="w-4 h-4 md:w-5 md:h-5 relative z-10" />
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTheme"
                                            className="absolute inset-0 bg-primary/10 rounded-full"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="rounded-xl border-none glass font-bold text-[10px] uppercase tracking-widest text-primary">
                                {t.label}
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </div>
        </TooltipProvider>
    );
}
