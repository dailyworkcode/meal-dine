'use client';

import * as React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Sparkles, Loader2, Brain, Zap, Target, Apple, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getTodayKey, cn, getLocalizedValue } from '@/lib/utils';
import { generateWellnessRitual } from '@/ai/flows/generate-wellness-ritual';
import { type WellnessRitual, type UserProfile } from '@/lib/types';
import { Magnetic } from './Magnetic';
import { useToast } from '@/hooks/use-toast';

export function WellnessRitualCard() {
    const t = useTranslations('DailyRitual');
    const locale = useLocale();
    const { toast } = useToast();
    const [userProfile] = useLocalStorage<UserProfile | null>('userProfile', null);
    const [rituals, setRituals] = useLocalStorage<Record<string, WellnessRitual>>('wellnessRituals', {});
    const [isGenerating, setIsGenerating] = React.useState(false);

    const today = getTodayKey();
    const todayRitual = rituals[today];

    const handleGenerate = async () => {
        if (!userProfile) return;
        setIsGenerating(true);
        try {
            const result = await generateWellnessRitual({
                name: userProfile.name,
                age: parseInt(userProfile.age),
                dietType: userProfile.dietType,
                location: `${userProfile.region}, ${userProfile.country}`,
                healthGoals: userProfile.healthGoals,
                activityLevel: userProfile.activityLevel,
                language: locale,
            });

            setRituals({
                ...rituals,
                [today]: result as WellnessRitual
            });

            toast({
                title: "Ritual Generated",
                description: "Your PulseAI daily plan is ready.",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Generation Failed",
                description: "Could not connect to PulseAI. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    if (!todayRitual) {
        return (
            <Card className="glass-card border-none rounded-[3rem] overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center p-12 space-y-8 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
                <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 shadow-xl">
                    <Sparkles className="w-12 h-12" />
                </div>
                <div className="space-y-4 max-w-md relative z-10">
                    <h3 className="text-3xl font-black font-headline text-foreground">{t('title')}</h3>
                    <p className="text-muted-foreground font-medium">{t('subtitle')}</p>
                </div>
                <Magnetic strength={0.2}>
                    <Button
                        size="lg"
                        onClick={handleGenerate}
                        disabled={isGenerating || !userProfile}
                        className="rounded-2xl px-12 h-16 text-lg font-bold shadow-2xl shadow-primary/20"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                {t('generating')}
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-3 h-6 w-6" />
                                {t('generate')}
                            </>
                        )}
                    </Button>
                </Magnetic>
            </Card>
        );
    }

    const items = [
        { id: 'focus', icon: Target, label: t('dayFocus'), value: getLocalizedValue(todayRitual.dayFocus, locale), color: 'text-blue-500' },
        { id: 'meal', icon: Apple, label: t('mealHighlight'), value: getLocalizedValue(todayRitual.mealHighlight, locale), color: 'text-emerald-500' },
        { id: 'yoga', icon: Zap, label: t('yogaFocus'), value: getLocalizedValue(todayRitual.yogaFocus, locale), color: 'text-orange-500' },
        { id: 'tip', icon: Brain, label: t('mindfulTip'), value: getLocalizedValue(todayRitual.mindfulTip, locale), color: 'text-purple-500' },
    ];

    return (
        <Card className="glass-card border-none rounded-[3rem] overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 p-8 text-primary/5 pointer-events-none">
                <Sparkles className="w-48 h-48 rotate-12" />
            </div>

            <CardHeader className="p-8 pb-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-3xl font-black font-headline text-foreground">
                            {t('ritualFor', { name: userProfile?.name || 'You' })}
                        </CardTitle>
                        <CardDescription className="text-primary font-bold uppercase tracking-widest text-[10px]">
                            {new Date().toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' })}
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleGenerate()} className="rounded-full h-10 w-10 text-muted-foreground hover:text-primary">
                        <Loader2 className={cn("w-5 h-5", isGenerating && "animate-spin")} />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-8 pt-4 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4 p-6 rounded-[2rem] bg-background/40 hover:bg-background transition-colors border border-primary/5">
                            <div className={cn("flex-shrink-0 w-12 h-12 rounded-2xl bg-background flex items-center justify-center shadow-inner", item.color)}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{item.label}</p>
                                <p className="text-sm font-bold text-foreground leading-relaxed">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-8 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-start gap-4">
                    <Info className="w-6 h-6 text-primary mt-1" />
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">{t('benefit')}</p>
                        <p className="text-lg font-bold text-primary leading-tight">
                            {getLocalizedValue(todayRitual.benefit, locale)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
