'use client';

import { AchievementPanel } from '@/components/AchievementPanel';
import { useChronoTheme } from '@/components/ChronoThemeProvider';
import { GlassParallax } from '@/components/GlassParallax';
import { HabitTracker } from '@/components/HabitTracker';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Magnetic } from '@/components/Magnetic';
import { PulseAI } from '@/components/PulseAI';
import { RemindersManager } from '@/components/RemindersManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { UserProfileForm } from '@/components/UserProfileForm';
import { WaterTracker } from '@/components/WaterTracker';
import { WellnessOverview } from '@/components/WellnessOverview';
import { WellnessQuote } from '@/components/WellnessQuote';
import { WellnessRitualCard } from '@/components/WellnessRitualCard';
import { ZenJournal } from '@/components/ZenJournal';
import { SocialHub } from '@/components/SocialHub';
import { InstallPWA } from '@/components/InstallPWA';
import { WellnessGarden } from '@/components/WellnessGarden';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { UserProfile } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Link } from '@/navigation';
import {
    Activity,
    ArrowRight,
    Brain,
    Droplets,
    LayoutDashboard,
    Moon,
    Sparkles,
    UserCircle,
    Utensils,
    Wind,
    Zap
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import * as React from 'react';

interface ModuleCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    image: string;
    href?: string;
    upcoming?: boolean;
    badgeText?: string;
    actionLabel?: string;
}

function ModuleCard({ title, description, icon, image, href, upcoming, badgeText, actionLabel }: ModuleCardProps) {
    const t = useTranslations('LandingPage');
    return (
        <Card className={cn(
            "group relative overflow-hidden transition-all duration-700 border-none glass-premium rounded-[3rem]",
            upcoming ? "opacity-70 scale-95" : "hover:-translate-y-4 hover:shadow-[0_80px_120px_-30px_rgba(0,0,0,0.15)] hover:scale-[1.02]"
        )}>
            <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80" />

                <div className="absolute top-6 left-6 z-20">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] glass shadow-2xl text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:rotate-12">
                        {icon}
                    </div>
                </div>

                {upcoming && (
                    <div className="absolute top-6 right-6 z-20">
                        <div className="rounded-full bg-primary/10 backdrop-blur-md px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary border border-primary/20">
                            {badgeText}
                        </div>
                    </div>
                )}
            </div>

            <CardContent className="relative z-10 pt-8 pb-10 px-8 space-y-6">
                <div className="space-y-3">
                    <h3 className="text-3xl font-black font-headline tracking-tighter leading-none">{title}</h3>
                    <p className="text-sm font-medium leading-relaxed text-muted-foreground/80 line-clamp-2">
                        {description}
                    </p>
                </div>

                {!upcoming && href ? (
                    <Magnetic strength={0.1}>
                        <Button asChild variant="ghost" className="w-full group/btn rounded-2xl h-14 text-md font-bold transition-all border border-primary/10 hover:bg-primary hover:text-white hover:border-transparent">
                            <Link href={href as any} className="flex items-center justify-center gap-3">
                                {actionLabel}
                                <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-2 transition-transform duration-300" />
                            </Link>
                        </Button>
                    </Magnetic>
                ) : (
                    <Button variant="outline" className="w-full rounded-2xl h-14 cursor-not-allowed font-bold border-dashed opacity-50" disabled>
                        {t('notifyAction')}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

export default function LandingPage() {
    const t = useTranslations('LandingPage');
    const tDialog = useTranslations('UserProfileDialog');
    const { timeLabel } = useChronoTheme();
    const { toast } = useToast();

    const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('userProfile', null);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const [isSavingProfile, setIsSavingProfile] = React.useState(false);
    const [hasCheckedProfile, setHasCheckedProfile] = React.useState(false);

    React.useEffect(() => {
        if (userProfile === null && hasCheckedProfile) {
            setIsProfileOpen(true);
        }
    }, [userProfile, hasCheckedProfile]);

    React.useEffect(() => {
        setHasCheckedProfile(true);
    }, []);

    const handleSaveProfile = (data: UserProfile) => {
        setIsSavingProfile(true);
        setUserProfile(data);
        setIsSavingProfile(false);
        setIsProfileOpen(false);
        toast({
            title: 'Profile Saved!',
            description: 'Your profile has been updated.',
        });
    };

    return (
        <SidebarProvider>
            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[2.5rem]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-headline font-bold">
                            {userProfile ? tDialog('editTitle') : tDialog('welcomeTitle')}
                        </DialogTitle>
                        <DialogDescription>
                            {userProfile ? tDialog('editDescription') : tDialog('welcomeDescription')}
                        </DialogDescription>
                    </DialogHeader>
                    <UserProfileForm
                        userProfile={userProfile}
                        onSave={handleSaveProfile}
                        onCancel={() => userProfile && setIsProfileOpen(false)}
                        isSaving={isSavingProfile}
                    />
                </DialogContent>
            </Dialog>

            <SidebarInset className="relative overflow-hidden">
                <GlassParallax />

                {/* Dynamic Background Blobs */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="bg-blob bg-primary/30 top-[-10%] left-[-10%] w-[50vw] h-[50vw]" />
                    <div className="bg-blob bg-purple-500/20 top-[40%] right-[-10%] w-[40vw] h-[40vw] animation-delay-2000" />
                    <div className="bg-blob bg-emerald-500/20 bottom-[-10%] left-[20%] w-[60vw] h-[60vw] animation-delay-4000" />
                </div>

                <div className="min-h-screen bg-transparent relative z-10 selection:bg-primary/30 selection:text-primary-foreground">
                    {/* Header / Nav */}
                    <RemindersManager />
                    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur-xl">
                        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                            <div className="flex items-center gap-2 group cursor-pointer">
                                <div className="w-12 h-12 relative bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform overflow-hidden">
                                    <Image
                                        src="/assets/logo.png"
                                        alt="DailyDine Plus Logo"
                                        fill
                                        className="object-cover p-2"
                                    />
                                </div>
                                <div className="flex flex-col -space-y-1">
                                    <span className="text-2xl font-black font-headline tracking-tighter text-foreground">DailyDine Plus</span>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary animate-pulse">{timeLabel}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <ThemeSwitcher />
                                <LanguageSwitcher />
                                <Magnetic>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full h-12 w-12 hover:bg-primary/5"
                                        onClick={() => setIsProfileOpen(true)}
                                    >
                                        <UserCircle className="h-8 w-8 text-foreground/70" />
                                    </Button>
                                </Magnetic>
                                <Magnetic>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        asChild
                                        className="rounded-full h-12 w-12 hover:bg-primary/5"
                                    >
                                        <Link href="/dashboard">
                                            <LayoutDashboard className="h-6 w-6 text-foreground/70" />
                                        </Link>
                                    </Button>
                                </Magnetic>
                            </div>
                        </div>
                    </header>

                    <main className="container mx-auto px-4 py-8 md:py-16 space-y-24">
                        {/* Hero Section */}
                        <section className="relative overflow-hidden rounded-[4rem] bg-gradient-to-br from-primary/5 via-transparent to-primary/5 border border-primary/10 p-1 shadow-2xl">
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8 md:p-20">
                                <div className="space-y-10 text-center lg:text-left">
                                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 animate-float shadow-sm">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                        <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">{t('heroBadge')}</span>
                                    </div>
                                    <h1 className="text-6xl md:text-8xl font-black font-headline text-foreground leading-[0.9] tracking-tighter">
                                        {t('heroTitle').split(' ').map((word, i) => (
                                            <span key={i} className={i === 1 ? "text-primary block" : "block"}>{word}</span>
                                        ))}
                                    </h1>
                                    <p className="text-xl text-muted-foreground font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
                                        {t('heroSubtitle')}
                                    </p>
                                    <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start pt-4">
                                        <Magnetic strength={0.2}>
                                            <Button size="lg" className="rounded-[1.5rem] px-12 h-16 text-lg font-bold shadow-2xl shadow-primary/20 hover:scale-[1.05] transition-all">
                                                {t('heroPrimaryAction')}
                                            </Button>
                                        </Magnetic>
                                        <Magnetic strength={0.1}>
                                            <Button variant="ghost" size="lg" className="rounded-[1.5rem] px-12 h-16 text-lg font-bold hover:bg-primary/5">
                                                {t('heroSecondaryAction')}
                                            </Button>
                                        </Magnetic>
                                    </div>
                                </div>

                                {/* Interactive Hero Asset */}
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all duration-1000" />
                                    <div className="relative aspect-square md:aspect-video lg:aspect-square rounded-[3rem] overflow-hidden border border-white/20 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                                        <Image
                                            src="/assets/hero-calm-health.png"
                                            alt="Wellness"
                                            fill
                                            priority
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        {/* Floating Stat Card */}
                                        <div className="absolute bottom-10 left-10 right-10 glass p-8 rounded-[2.5rem] animate-float shadow-2xl">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary animate-pulse-slow">
                                                        <Activity className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/70">{t('heartRateLabel')}</p>
                                                        <p className="text-3xl font-black font-headline text-foreground tabular-nums">72 BPM</p>
                                                    </div>
                                                </div>
                                                <div className="h-12 w-32 bg-primary/10 rounded-2xl overflow-hidden relative">
                                                    <div className="absolute inset-0 flex items-end justify-between px-2 py-1">
                                                        {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                                            <div key={i} className="w-2.5 bg-primary/40 rounded-t-md animate-pulse-slow" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <WellnessOverview />

                        {/* The Living Garden */}
                        <div className="pt-12">
                            <WellnessGarden />
                        </div>

                        {/* Main Content Grid */}
                        <div className="text-center space-y-6 pt-12">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                                <Zap className="w-3.5 h-3.5 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Core Modules</span>
                            </div>
                            <h2 className="text-6xl font-black font-headline tracking-tighter text-foreground leading-none">{t('modulesTitle')}</h2>
                            <p className="text-muted-foreground font-medium max-w-2xl mx-auto text-lg">{t('modulesSubtitle')}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            <div className="lg:col-span-2">
                                <WellnessRitualCard />
                            </div>
                            <ModuleCard
                                title={t('mindfulNutritionTitle')}
                                description={t('mindfulNutritionDesc')}
                                icon={<Brain className="w-6 h-6" />}
                                image="/assets/nutrition-module.png"
                                href="/mindful-nutrition"
                                actionLabel={t('viewModule')}
                            />
                            <ModuleCard
                                title={t('mealsTitle')}
                                description={t('mealsDesc')}
                                icon={<Utensils className="w-6 h-6" />}
                                image="/assets/meals-module.png"
                                href="/meals"
                                actionLabel={t('viewModule')}
                            />
                            <ModuleCard
                                title={t('yogaTitle')}
                                description={t('yogaDesc')}
                                icon={<Zap className="w-6 h-6" />}
                                image="/assets/yoga-module.png"
                                href="/yoga"
                                actionLabel={t('viewModule')}
                            />
                            <ModuleCard
                                title="Hydration Hub"
                                description="Track your fluid intake and optimize your hydration levels with wave-animated insights."
                                icon={<Droplets className="w-6 h-6" />}
                                image="/assets/hydration-module.png"
                                href="/hydration"
                                actionLabel="Optimize Fluids"
                            />
                            <ModuleCard
                                title="Zen Practice"
                                description="Improve focus and reduce stress with interactive guided breathing exercises."
                                icon={<Wind className="w-6 h-6" />}
                                image="/assets/serenity-module.png"
                                href="/serenity"
                                actionLabel="Start Zen"
                            />
                            <ModuleCard
                                title="AI Food Vision"
                                description="Take a photo of your meal to get instant nutritional breakdown and macro estimates."
                                icon={<Brain className="w-6 h-6" />}
                                image="/assets/vision-module.png"
                                href="/vision"
                                actionLabel="Scan Meal"
                            />
                            <ModuleCard
                                title="Sleep & Recovery"
                                description="Track your circadian rhythm and optimize recovery with AI-driven sleep insights."
                                icon={<Moon className="w-6 h-6" />}
                                image="/assets/sleep-module.png"
                                href="/sleep"
                                actionLabel="Analyze Sleep"
                            />
                        </div>

                        {/* Growth & Social Section */}
                        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <AchievementPanel />
                            <SocialHub />
                        </div>

                        {/* Daily Engagement Hub */}
                        <div className="space-y-16">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                                <div className="lg:col-span-2">
                                    <HabitTracker />
                                </div>
                                <div className="lg:col-span-1">
                                    <WaterTracker />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                                <div className="lg:col-span-2">
                                    <ZenJournal />
                                </div>
                                <div className="lg:col-span-1">
                                    <WellnessQuote />
                                </div>
                            </div>
                        </div>
                        <InstallPWA />
                    </main>

                    {/* Premium Footer */}
                    <footer className="border-t border-primary/10 pt-32 pb-16 mt-32 bg-primary/5">
                        <div className="container mx-auto px-4 text-center space-y-10">
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-10 h-10 relative bg-primary/20 rounded-xl flex items-center justify-center text-primary overflow-hidden">
                                    <Image
                                        src="/assets/logo.png"
                                        alt="DailyDine Plus Logo"
                                        fill
                                        className="object-cover p-1.5"
                                    />
                                </div>
                                <span className="text-2xl font-black font-headline tracking-tighter">DailyDine Plus</span>
                            </div>
                            <p className="text-muted-foreground text-sm font-medium tracking-wide">© 2026 DailyDine Plus. Crafted for Mindful Living.</p>
                            <div className="flex justify-center gap-8 text-xs font-black uppercase tracking-widest text-muted-foreground/50">
                                <span className="cursor-pointer hover:text-primary transition-colors">Privacy</span>
                                <span className="cursor-pointer hover:text-primary transition-colors">Terms</span>
                                <span className="cursor-pointer hover:text-primary transition-colors">Support</span>
                            </div>
                        </div>
                    </footer>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
