'use client';

import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface HungerScaleProps {
    value: number;
    onChange: (value: number) => void;
    label: string;
    description: string;
}

export function HungerScale({ value, onChange, label, description }: HungerScaleProps) {
    const t = useTranslations('MindfulNutrition');

    const getEmoji = (val: number) => {
        if (val <= 2) return '😫';
        if (val <= 4) return '😋';
        if (val <= 6) return '😐';
        if (val <= 8) return '😌';
        return '😵‍💫';
    };

    const getStatus = (val: number) => {
        if (val <= 2) return t('scale1');
        if (val <= 6) return t('scale5');
        return t('scale10');
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h3 className="text-xl font-bold font-headline text-foreground">{label}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            <div className="relative pt-12 pb-8 px-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={value}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute -top-4 left-1/2 -translate-x-1/2 text-6xl"
                    >
                        {getEmoji(value)}
                    </motion.div>
                </AnimatePresence>

                <Slider.Root
                    className="relative flex items-center select-none touch-none w-full h-10"
                    value={[value]}
                    max={10}
                    min={1}
                    step={1}
                    onValueChange={([val]) => onChange(val)}
                >
                    <Slider.Track className="bg-primary/10 relative grow rounded-full h-3 overflow-hidden border border-primary/5">
                        <Slider.Range className="absolute bg-gradient-to-r from-primary/40 to-primary h-full" />
                    </Slider.Track>
                    <Slider.Thumb
                        className="block w-8 h-8 bg-background border-4 border-primary rounded-full shadow-xl hover:scale-110 focus:outline-none transition-transform cursor-grab active:cursor-grabbing"
                        aria-label="Hunger Level"
                    />
                </Slider.Root>

                <div className="flex justify-between mt-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 px-2">
                    <span>1 • {t('scale1')}</span>
                    <span>5 • {t('scale5')}</span>
                    <span>10 • {t('scale10')}</span>
                </div>
            </div>

            <div className="text-center">
                <span className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
                    {value} / 10 • {getStatus(value)}
                </span>
            </div>
        </div>
    );
}
