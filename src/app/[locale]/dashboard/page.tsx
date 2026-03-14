'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getMasteredPoses } from '@/lib/storage';
import { Link } from '@/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    ArrowLeft,
    LayoutDashboard,
    TrendingUp,
    Target,
    Flame,
    Calendar,
    Brain,
    Activity,
    Trophy,
    Dumbbell
} from 'lucide-react';
import { GlassParallax } from '@/components/GlassParallax';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
    const t = useTranslations('Dashboard');
    const locale = useLocale();
    const [wellnessHistory] = useLocalStorage<Record<string, number>>('wellnessHistory', {});
    const [mindfulLog] = useLocalStorage<Record<string, any>>('mindfulNutritionLog', {});
    const [dailyHabits] = useLocalStorage<Record<string, Record<string, boolean>>>('dailyHabits', {});
    const [masteredPoses, setMasteredPoses] = React.useState<string[]>([]);

    React.useEffect(() => {
        getMasteredPoses().then(setMasteredPoses);
    }, []);

    const dates = React.useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });
    }, []);

    const pointsData = React.useMemo(() => {
        return dates.map(date => ({
            date: new Date(date).toLocaleDateString(locale, { weekday: 'short' }),
            points: (wellnessHistory[date] || 0) * 5, // Approximate mapping for visual
        }));
    }, [dates, wellnessHistory, locale]);

    const hungerData = React.useMemo(() => {
        return dates.map(date => {
            const log = mindfulLog[date];
            return {
                date: new Date(date).toLocaleDateString(locale, { weekday: 'short' }),
                pre: log?.pre || 0,
                post: log?.post || 0,
            };
        }).filter(d => d.pre > 0 || d.post > 0);
    }, [dates, mindfulLog, locale]);

    const habitData = React.useMemo(() => {
        const habits = ['meal', 'yoga', 'breath', 'profile'];
        return habits.map(habit => {
            const count = Object.values(dailyHabits).filter(d => d[habit]).length;
            const total = Object.keys(dailyHabits).length || 1;
            return {
                subject: habit.charAt(0).toUpperCase() + habit.slice(1),
                A: Math.round((count / total) * 100),
                fullMark: 100,
            };
        });
    }, [dailyHabits]);

    const stats = React.useMemo(() => {
        const totalPoints = Object.values(wellnessHistory).reduce((a, b) => a + b, 0) * 5;
        const totalDays = Object.keys(wellnessHistory).length;
        const avgScore = totalDays > 0 ? Math.round(Object.values(wellnessHistory).reduce((a, b) => a + b, 0) / totalDays) : 0;
        const activeHabits = habitData.filter(h => h.A > 50).length;

        return [
            { label: t('totalPoints'), value: totalPoints, icon: Trophy, color: 'text-yellow-500' },
            { label: t('avgScore'), value: `${avgScore}%`, icon: Activity, color: 'text-primary' },
            { label: t('activeHabits'), value: activeHabits, icon: Target, color: 'text-blue-500' },
            { label: "Poses Mastered", value: masteredPoses.length, icon: Dumbbell, color: 'text-orange-500' },
            { label: t('daysTracked'), value: totalDays, icon: Calendar, color: 'text-emerald-500' },
        ];
    }, [wellnessHistory, habitData, masteredPoses, t]);

    return (
        <SidebarProvider>
            <SidebarInset>
                <div className="min-h-screen relative overflow-hidden bg-background">
                    <GlassParallax />

                    <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/80 backdrop-blur-xl">
                        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" asChild className="rounded-full">
                                    <Link href="/">
                                        <ArrowLeft className="h-5 w-5" />
                                    </Link>
                                </Button>
                                <div className="flex items-center gap-2">
                                    <LayoutDashboard className="w-5 h-5 text-primary" />
                                    <span className="text-xl font-black font-headline tracking-tighter text-foreground">
                                        {t('title')}
                                    </span>
                                </div>
                            </div>
                            <LanguageSwitcher />
                        </div>
                    </header>

                    <main className="container mx-auto px-4 py-12 max-w-7xl space-y-12">
                        {/* Header Section */}
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl md:text-5xl font-black font-headline text-foreground tracking-tight">
                                Your Wellness Pulse
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                {t('subtitle')}
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, i) => (
                                <Card key={i} className="glass-card border-none rounded-[2rem] overflow-hidden shadow-xl hover:scale-105 transition-transform">
                                    <CardContent className="p-6 flex items-center gap-4">
                                        <div className={cn("p-4 rounded-2xl bg-background shadow-inner", stat.color)}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                                            <p className="text-2xl font-black font-headline text-foreground">{stat.value}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Points Flow */}
                            <Card className="glass-card border-none rounded-[3rem] overflow-hidden shadow-2xl lg:col-span-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl font-black font-headline">
                                        <TrendingUp className="w-5 h-5 text-primary" />
                                        {t('pointsOverTime')}
                                    </CardTitle>
                                    <CardDescription>Visualizing your daily wellness score progression.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={pointsData}>
                                            <defs>
                                                <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--primary)/0.05)" />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                                            <YAxis hide />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="points"
                                                stroke="hsl(var(--primary))"
                                                strokeWidth={4}
                                                fillOpacity={1}
                                                fill="url(#colorPoints)"
                                                animationDuration={2000}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Hunger vs Satiety */}
                            <Card className="glass-card border-none rounded-[3rem] overflow-hidden shadow-2xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl font-black font-headline">
                                        <Brain className="w-5 h-5 text-purple-500" />
                                        {t('hungerTrends')}
                                    </CardTitle>
                                    <CardDescription>Somatic awareness check-ins throughout the week.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[350px]">
                                    {hungerData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={hungerData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--primary)/0.05)" />
                                                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                                                <YAxis domain={[0, 10]} hide />
                                                <Tooltip cursor={{ fill: 'hsl(var(--primary)/0.05)' }} />
                                                <Legend iconType="circle" />
                                                <Bar dataKey="pre" name={t('preMealHunger')} fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                                <Bar dataKey="post" name={t('postMealSatiety')} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
                                            <Brain className="w-12 h-12 opacity-20" />
                                            <p>No nutrition logs found for this week.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Habit Consistency */}
                            <Card className="glass-card border-none rounded-[3rem] overflow-hidden shadow-2xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl font-black font-headline">
                                        <Flame className="w-5 h-5 text-orange-500" />
                                        {t('habitSuccess')}
                                    </CardTitle>
                                    <CardDescription>Your mastery across different wellness habits.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={habitData}>
                                            <PolarGrid stroke="hsl(var(--primary)/0.1)" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fontWeight: 'bold' }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
                                            <Radar
                                                name="Consistency"
                                                dataKey="A"
                                                stroke="hsl(var(--primary))"
                                                fill="hsl(var(--primary))"
                                                fillOpacity={0.5}
                                                animationDuration={2500}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
