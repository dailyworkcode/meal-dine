'use client';

import * as React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Leaf, Sparkles, Loader2, Send, History, Quote, Wind, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useXP } from '@/hooks/useXP';
import { cn, getLocalizedValue } from '@/lib/utils';
import { generateZenReflection } from '@/ai/flows/generate-zen-reflection';
import { type JournalEntry } from '@/lib/types';
import { type ZenReflection } from '@/ai/schemas';
import { Magnetic } from './Magnetic';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const MOODS = [
    { id: 'calm', icon: '🧘', label: { en: 'Calm', hi: 'शांत' } },
    { id: 'anxious', icon: '🌪️', label: { en: 'Anxious', hi: 'उत्सुक' } },
    { id: 'tired', icon: '😴', label: { en: 'Tired', hi: 'थका हुआ' } },
    { id: 'happy', icon: '☀️', label: { en: 'Happy', hi: 'खुश' } },
    { id: 'sad', icon: '🌧️', label: { en: 'Sad', hi: 'दुखी' } },
];

export function ZenJournal() {
    const t = useTranslations('ZenJournal');
    const locale = useLocale();
    const { toast } = useToast();
    const { awardXP, XP_ACTIONS } = useXP();
    const [entries, setEntries] = useLocalStorage<JournalEntry[]>('zenJournal', []);
    const [mood, setMood] = React.useState('');
    const [reflection, setReflection] = React.useState('');
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleSubmit = async () => {
        if (!mood || !reflection) return;
        setIsGenerating(true);
        try {
            const result: ZenReflection = await generateZenReflection({
                mood,
                reflection,
                language: locale,
            });

            const newEntry: JournalEntry = {
                mood,
                reflection,
                aiResponse: {
                    en: `${result.reflection.en}\n\n**${result.somaticTip.en}**\n\n*${result.affirmation.en}*`,
                    hi: `${result.reflection.hi}\n\n**${result.somaticTip.hi}**\n\n*${result.affirmation.hi}*`,
                },
                timestamp: new Date().toISOString(),
            };

            setEntries([newEntry, ...entries]);
            awardXP(XP_ACTIONS.ZEN_JOURNAL);
            setMood('');
            setReflection('');
            toast({
                title: "Reflection Deepened",
                description: "Your Zen entry has been preserved.",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Connection Lost",
                description: "The Zen master is currently unavailable.",
                variant: "destructive",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Card className="glass-premium border-none rounded-[4rem] overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 p-12 text-emerald-500/10 pointer-events-none">
                <Leaf className="w-80 h-80 -rotate-12 animate-float" />
            </div>

            <CardHeader className="p-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-600">
                        <Leaf className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-3xl font-black font-headline text-foreground">{t('title')}</CardTitle>
                </div>
                <CardDescription className="text-muted-foreground font-medium text-lg">
                    {t('subtitle')}
                </CardDescription>
            </CardHeader>

            <CardContent className="p-8 space-y-8">
                <div className="space-y-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600/60 text-center">{t('moodLabel')}</p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {MOODS.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setMood(m.id)}
                                className={cn(
                                    "group flex flex-col items-center gap-3 p-6 rounded-[2.5rem] transition-all duration-500",
                                    mood === m.id
                                        ? "bg-emerald-500 text-white shadow-2xl shadow-emerald-500/30 scale-110 -translate-y-2"
                                        : "bg-background/40 hover:bg-emerald-50 border border-emerald-500/10 hover:border-emerald-500/30"
                                )}
                            >
                                <span className="text-4xl group-hover:scale-125 transition-transform duration-500">{m.icon}</span>
                                <span className={cn(
                                    "text-[10px] font-black uppercase tracking-widest",
                                    mood === m.id ? "text-white" : "text-emerald-700/60"
                                )}>
                                    {getLocalizedValue(m.label as any, locale)}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative group/text">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-[2.5rem] blur opacity-25 group-hover/text:opacity-50 transition duration-1000" />
                    <Textarea
                        placeholder={t('reflectionPlaceholder')}
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                        className="relative min-h-[180px] rounded-[2.5rem] p-8 bg-background/60 backdrop-blur-sm border-none focus:ring-2 focus:ring-emerald-500/30 transition-all text-xl font-medium resize-none shadow-inner"
                    />
                </div>

                <div className="flex justify-end">
                    <Magnetic strength={0.2}>
                        <Button
                            size="lg"
                            disabled={!mood || !reflection || isGenerating}
                            onClick={handleSubmit}
                            className="rounded-[1.5rem] px-10 h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20"
                        >
                            {isGenerating ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <Send className="mr-2 h-5 w-5" />
                            )}
                            {isGenerating ? t('reflecting') : t('submit')}
                        </Button>
                    </Magnetic>
                </div>

                <div className="space-y-6 pt-8 border-t border-primary/5">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                        <History className="w-4 h-4" />
                        {t('history')}
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                        <AnimatePresence>
                            {entries.length === 0 ? (
                                <p className="text-center py-10 text-muted-foreground font-medium italic">{t('empty')}</p>
                            ) : (
                                entries.map((entry, idx) => (
                                    <motion.div
                                        key={entry.timestamp}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="p-8 rounded-[3rem] bg-background/40 border border-emerald-500/10 space-y-6 hover:shadow-lg transition-shadow"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-2xl">
                                                    {MOODS.find(m => m.id === entry.mood)?.icon}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                                        {new Date(entry.timestamp).toLocaleDateString(locale, { weekday: 'long' })}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-muted-foreground/60 leading-none">
                                                        {new Date(entry.timestamp).toLocaleDateString(locale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-lg font-bold text-foreground leading-relaxed italic opacity-80 decoration-emerald-500/30 underline decoration-2 underline-offset-4">
                                            "{entry.reflection}"
                                        </p>
                                        <div className="p-6 rounded-[2rem] bg-emerald-500/5 text-sm text-foreground/70 leading-relaxed border-l-4 border-emerald-500 shadow-inner">
                                            <div className="flex items-center gap-2 mb-2 text-emerald-600/60 font-black uppercase tracking-widest text-[8px]">
                                                <Sparkles className="w-3 h-3" />
                                                PulseAI Insight
                                            </div>
                                            {getLocalizedValue(entry.aiResponse, locale)}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
