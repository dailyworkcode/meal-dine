'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MessageSquare, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface HabitInteractionModalProps {
    title: string;
    onComplete: (reflection: string) => void;
    onClose: () => void;
}

export function HabitInteractionModal({ title, onComplete, onClose }: HabitInteractionModalProps) {
    const t = useTranslations('Wellness');
    const [reflection, setReflection] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        if (reflection.trim().length < 5) return;
        setIsSubmitting(true);
        setTimeout(() => {
            onComplete(reflection);
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col space-y-8 p-10">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black font-headline text-foreground">
                        {title}
                    </h3>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-lg font-bold text-foreground/80 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        {t('reflectionPrompt')}
                    </label>
                    <Textarea
                        placeholder={t('reflectionPlaceholder')}
                        className="min-h-[150px] rounded-[1.5rem] border-primary/20 focus:border-primary/50 text-lg p-6 bg-primary/5 leading-relaxed transition-all resize-none"
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground text-right font-medium">
                        {reflection.length}/5 minimum characters
                    </p>
                </div>

                <Button
                    onClick={handleSubmit}
                    disabled={reflection.trim().length < 5 || isSubmitting}
                    className="w-full h-16 rounded-[1.5rem] text-lg font-bold shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 animate-spin" />
                            Claiming Rewards...
                        </div>
                    ) : (
                        t('reflectionSubmit')
                    )}
                </Button>
            </div>
        </div>
    );
}
