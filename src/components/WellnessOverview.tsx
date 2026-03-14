'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Activity, Trophy, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getTodayKey } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { HealthCertificate } from './HealthCertificate';
import { AchievementGallery } from './AchievementGallery';
import { WellnessCharts } from './WellnessCharts';
import { ZenArchive } from './ZenArchive';
import { fireConfetti } from '@/lib/confetti';
import { calculateHabitStreak } from '@/lib/streaks';
import { useXP } from '@/hooks/useXP';
import { Link } from '@/navigation';
import { Button } from './ui/button';
import { TrendingUp, Share2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function WellnessOverview() {
    const t = useTranslations('Wellness');
    const [habits] = useLocalStorage<{ [key: string]: { [habit: string]: boolean } }>('dailyHabits', {});
    const [waterIntake] = useLocalStorage<{ [key: string]: number }>('waterIntake', {});
    const { xp, level } = useXP();
    const [userProfile] = useLocalStorage<any>('userProfile', {});
    const [certificatesShown, setCertificatesShown] = useLocalStorage<{ [key: string]: boolean }>('certificatesShown', {});
    const [wellnessHistory, setWellnessHistory] = useLocalStorage<{ [key: string]: number }>('wellnessHistory', {});

    const today = getTodayKey();
    const [showCertificate, setShowCertificate] = React.useState(false);

    const todayHabits = habits[today] || {};
    const habitCount = Object.values(todayHabits).filter(Boolean).length;
    const waterCount = Math.min(10, waterIntake[today] || 0);

    // Calculate total progress (0-100)
    // 4 habits + 1 water goal = 5 total pips
    const totalPips = 5;
    const completedPips = habitCount + (waterCount >= 10 ? 1 : 0);
    const score = Math.round((completedPips / totalPips) * 100);
    const points = xp; // Use total XP instead of daily points for more impact
    const streak = calculateHabitStreak(habits);
    const { awardXP, XP_ACTIONS } = useXP();

    const handleShare = async () => {
        const shareData = {
            title: 'DailyDine Plus Status',
            text: `Check out my Wellness Score: ${score}! I'm on a ${streak}-day streak.`,
            url: window.location.origin
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                awardXP(XP_ACTIONS.SOCIAL_SHARE);
                toast({ title: "Shared Successfully!", description: "Bonus XP awarded!" });
            } else {
                navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                toast({ title: "Link Copied!", description: "Share it with friends manually." });
            }
        } catch (e) {
            console.error("Share failed", e);
        }
    };

    React.useEffect(() => {
        if (score === 100 && !certificatesShown[today]) {
            setShowCertificate(true);
            fireConfetti();
            setCertificatesShown({ ...certificatesShown, [today]: true });
        }
    }, [score, today, certificatesShown, setCertificatesShown]);

    // Save daily score to history
    React.useEffect(() => {
        if (score !== wellnessHistory[today]) {
            setWellnessHistory({
                ...wellnessHistory,
                [today]: score
            });
        }
    }, [score, today, wellnessHistory, setWellnessHistory]);

    return (
        <div className="w-full max-w-5xl mx-auto mb-12 px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Score Card */}
                <Card className="md:col-span-2 glass dark:glass-dark rounded-[2.5rem] overflow-hidden border-none shadow-xl">
                    <CardContent className="p-8 flex items-center justify-between gap-8">
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-black uppercase tracking-[0.2em] text-primary/60">{t('wellnessScore')}</span>
                            <h2 className="text-4xl font-headline font-bold text-foreground">Leveling Up Your Health</h2>
                            <div className="flex gap-2 items-center">
                                <p className="text-muted-foreground text-sm max-w-xs">{t('habitsSubtitle')}</p>
                                <Button
                                    onClick={handleShare}
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-full hover:bg-primary/10 text-primary gap-1 font-bold text-[10px]"
                                >
                                    <Share2 className="w-3 h-3" />
                                    SHARE
                                </Button>
                            </div>
                        </div>

                        <div className="relative h-32 w-32 flex items-center justify-center">
                            <svg className="h-full w-full rotate-[-90deg]">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="58"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    className="text-primary/10"
                                />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="58"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    strokeDasharray={364.4}
                                    strokeDashoffset={364.4 - (364.4 * score) / 100}
                                    strokeLinecap="round"
                                    className="text-primary transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black font-headline text-foreground">{score}</span>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Score</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Points Card */}
                <Card className="glass dark:glass-dark rounded-[2.5rem] overflow-hidden border-none shadow-xl bg-gradient-to-br from-primary/10 to-transparent">
                    <CardContent className="p-8 flex flex-col items-center justify-center text-center gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-2 shadow-inner">
                            <Trophy className="w-8 h-8" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-5xl font-black font-headline text-primary tabular-nums">{points}</span>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{t('wellnessPoints')} (Total XP)</span>
                        </div>
                        {streak > 0 && (
                            <div className="flex items-center gap-1 px-3 py-1 bg-orange-500/10 rounded-full border border-orange-500/20">
                                <Activity className="w-3 h-3 text-orange-500" />
                                <span className="text-[10px] font-bold text-orange-600 uppercase">{streak} DAY STREAK</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full">
                            <Star className="w-3 h-3 text-primary fill-primary" />
                            <span className="text-[10px] font-bold text-primary">LEVEL {level}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-2">
                    <WellnessCharts />
                </div>
                <div className="lg:col-span-1">
                    <ZenArchive />
                    <div className="mt-6">
                        <Button asChild variant="outline" className="w-full rounded-2xl border-primary/20 bg-background/50 h-12 font-bold group">
                            <Link href="/dashboard" className="flex items-center justify-center gap-2">
                                {t('viewChronicle')}
                                <TrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <AchievementGallery />
            </div>

            <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
                <DialogContent className="max-w-2xl rounded-[3rem] p-0 overflow-hidden border-none glass-card shadow-2xl">
                    <HealthCertificate
                        score={score}
                        points={points}
                        userName={userProfile?.name}
                        onClose={() => setShowCertificate(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
