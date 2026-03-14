'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { UserProfile } from '@/lib/types';
import { getTodayKey, getLocalizedValue, cn } from '@/lib/utils';
import { getYogaSession, saveYogaSession, markPoseMastered } from '@/lib/storage';
import { generateYogaSession } from '@/ai/flows/generate-yoga-session';
import { GenerateYogaSessionOutput } from '@/ai/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Play, Clock, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from '@/navigation';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { YogaTimer } from '@/components/YogaTimer';

export default function YogaPage() {
    const t = useTranslations('YogaPage');
    const locale = useLocale();
    const { toast } = useToast();

    const [userProfile] = useLocalStorage<UserProfile | null>('userProfile', null);
    const [todaysSession, setTodaysSession] = React.useState<GenerateYogaSessionOutput | null>(null);
    const [isGenerating, setIsGenerating] = React.useState(false);

    React.useEffect(() => {
        const initStorage = async () => {
            const today = getTodayKey();
            // The cleanupOldPlans function was removed from the import, so this line should be removed or commented out.
            // For now, I will comment it out to avoid breaking the code if it's still needed elsewhere.
            // await cleanupOldPlans(today);
            const savedSession = await getYogaSession(today);
            if (savedSession) {
                setTodaysSession(savedSession);
            }
        };
        initStorage();
    }, []);

    const handleGenerateSession = async () => {
        if (!userProfile) {
            toast({
                variant: 'destructive',
                title: t('profileError'),
                description: t('profileErrorDesc'),
            });
            return;
        }

        setIsGenerating(true);
        try {
            const result = await generateYogaSession({
                name: userProfile.name,
                age: parseInt(userProfile.age),
                healthGoals: userProfile.healthGoals,
                activityLevel: userProfile.activityLevel,
                language: locale,
            });

            setTodaysSession(result);
            await saveYogaSession(getTodayKey(), result);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: t('errorTitle'),
                description: t('errorDesc'),
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <SidebarProvider>
            <SidebarInset>
                <div className="min-h-screen bg-background text-foreground">
                    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
                        <div className="container mx-auto flex h-16 items-center justify-between px-4">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href="/">
                                        <ArrowLeft className="h-5 w-5" />
                                    </Link>
                                </Button>
                                <span className="text-xl font-bold font-headline tracking-tight text-primary">DailyDine Yoga</span>
                            </div>
                            <LanguageSwitcher />
                        </div>
                    </header>

                    <main className="container mx-auto px-4 pt-20 pb-8 md:pt-24 md:pb-12">
                        {!todaysSession ? (
                            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
                                    <div className="relative bg-gradient-to-br from-emerald-400 to-emerald-600 w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl rotate-3">
                                        <Play className="w-10 h-10 text-white fill-white" />
                                    </div>
                                </div>

                                <div className="max-w-md space-y-2">
                                    <h1 className="text-3xl font-bold font-headline">{t('welcomeTitle')}</h1>
                                    <p className="text-muted-foreground">{t('welcomeDesc')}</p>
                                </div>

                                <Button
                                    size="lg"
                                    className="rounded-full px-8 text-lg h-12 shadow-lg hover:shadow-emerald-500/25 transition-all bg-emerald-600 hover:bg-emerald-700"
                                    onClick={handleGenerateSession}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            {t('generating')}
                                        </>
                                    ) : (
                                        t('generateButton')
                                    )}
                                </Button>
                            </div>
                        ) : (
                            <div className="max-w-3xl mx-auto space-y-8">
                                <div className="text-center space-y-4">
                                    <h1 className="text-4xl font-bold font-headline text-emerald-700 dark:text-emerald-400">
                                        {getLocalizedValue(todaysSession.title, locale)}
                                    </h1>
                                    <p className="text-xl text-muted-foreground">
                                        {getLocalizedValue(todaysSession.description, locale)}
                                    </p>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full font-medium">
                                        <Clock className="w-4 h-4" />
                                        {getLocalizedValue(todaysSession.duration, locale)}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Accordion type="single" collapsible className="w-full">
                                        {todaysSession.poses.map((pose, index) => (
                                            <AccordionItem key={index} value={`item-${index}`} className="border-emerald-100 dark:border-emerald-800">
                                                <AccordionTrigger className="hover:no-underline py-4 px-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors">
                                                    <div className="flex items-center gap-4 text-left">
                                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm">
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-lg">{getLocalizedValue(pose.name, locale)}</div>
                                                            <div className="text-sm text-muted-foreground font-medium">{getLocalizedValue(pose.duration, locale)}</div>
                                                        </div>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="px-14 pb-4 text-base space-y-4">
                                                    {pose.imageUrl && (
                                                        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-emerald-50 dark:bg-emerald-900/20">
                                                            <img
                                                                src={pose.imageUrl}
                                                                alt={getLocalizedValue(pose.name, locale)}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}

                                                    <YogaTimer
                                                        durationInSeconds={parseInt(getLocalizedValue(pose.duration, 'en').replace(/[^0-9]/g, '')) * 60 || 60}
                                                        onComplete={() => {
                                                            markPoseMastered(getLocalizedValue(pose.name, 'en'));
                                                            toast({
                                                                title: t('poseComplete'),
                                                                description: getLocalizedValue(pose.name, locale)
                                                            });
                                                        }}
                                                    />

                                                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl space-y-2">
                                                        <h4 className="font-semibold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            {t('benefits')}
                                                        </h4>
                                                        <p>{getLocalizedValue(pose.benefits, locale)}</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h4 className="font-semibold">{t('instructions')}</h4>
                                                        <p className="leading-relaxed">{getLocalizedValue(pose.instructions, locale)}</p>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>

                                <div className="flex justify-center pt-8">
                                    <Button
                                        variant="outline"
                                        onClick={handleGenerateSession}
                                        disabled={isGenerating}
                                        className="gap-2"
                                    >
                                        {isGenerating && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {t('regenerateButton')}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
