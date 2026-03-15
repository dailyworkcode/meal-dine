'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Share2, Trophy, Flame, Zap, Bell, Check, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useXP } from '@/hooks/useXP';
import { MOCK_FRIENDS, Friend } from '@/lib/social';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { toast } from '@/hooks/use-toast';
import { Shield, Sparkles as SparklesIcon, Globe } from 'lucide-react';

export function SocialHub() {
    const t = useTranslations('SocialHub');
    const { xp, level, awardXP, XP_ACTIONS } = useXP();
    const [friends, setFriends] = React.useState<Friend[]>(MOCK_FRIENDS);
    const [isSharing, setIsSharing] = React.useState(false);

    const handleShare = async () => {
        setIsSharing(true);
        const shareData = {
            title: t('shareTitle'),
            text: t('shareText', { level }),
            url: window.location.origin,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                awardXP(XP_ACTIONS.SOCIAL_SHARE);
                toast({
                    title: t('statusShared'),
                    description: t('statusSharedDesc'),
                });
            } else {
                await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                toast({
                    title: t('copied'),
                    description: t('copiedDesc'),
                });
            }
        } catch (err) {
            console.error('Share failed:', err);
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <Card className="glass-premium border-none rounded-[3rem] overflow-hidden shadow-2xl h-full">
            <CardHeader className="p-8 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">{t('arena')}</p>
                            <h3 className="text-3xl font-black font-headline tracking-tighter">{t('title')}</h3>
                        </div>
                    </div>
                    <Button
                        onClick={handleShare}
                        disabled={isSharing}
                        className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-6 gap-2 shadow-lg shadow-indigo-200"
                    >
                        <Share2 className={cn("w-4 h-4", isSharing && "animate-spin")} />
                        {t('shareProgress')}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-8 pt-0">
                <div className="space-y-6 mt-4">
                    {/* Mini Leaderboard */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 px-2">
                            <span>{t('topWarriors')}</span>
                            <span>{t('level')}</span>
                        </div>
                        <div className="grid gap-3">
                            {/* User Self-Rank */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center justify-between p-4 bg-primary/5 rounded-[1.5rem] border border-primary/20 ring-2 ring-primary/10"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-black">
                                        {t('you')}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{t('status')}</p>
                                        <div className="flex items-center gap-2 opacity-60">
                                            <Zap className="w-3 h-3 text-amber-500" />
                                            <span className="text-[10px] font-black">{xp} XP</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-primary/20 px-3 py-1 rounded-full">
                                    <Star className="w-3 h-3 text-primary fill-primary" />
                                    <span className="text-xs font-black text-primary">{level}</span>
                                </div>
                            </motion.div>

                            {/* Friend Ranks */}
                            {friends.sort((a, b) => b.xp - a.xp).map((friend, idx) => (
                                <div
                                    key={friend.id}
                                    className="flex items-center justify-between p-4 bg-secondary/5 rounded-[1.5rem] hover:bg-secondary/10 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img src={friend.avatar} alt="" className="w-10 h-10 rounded-full bg-secondary/20" />
                                            {friend.isOnline && (
                                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{friend.name}</p>
                                            {friend.streak > 0 && (
                                                <div className="flex items-center gap-1 text-orange-600">
                                                    <Flame className="w-3 h-3 fill-orange-600" />
                                                    <span className="text-[10px] font-black">{t('streak', { streak: friend.streak })}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-secondary/20 px-3 py-1 rounded-full opacity-60">
                                        <Star className="w-3 h-3 text-foreground fill-foreground" />
                                        <span className="text-xs font-black">{friend.level}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button variant="ghost" className="w-full rounded-[1.5rem] h-14 border-dashed border-2 border-muted-foreground/10 hover:bg-indigo-500/5 hover:text-indigo-600 hover:border-indigo-500/20 gap-2 font-black uppercase text-xs tracking-widest transition-all">
                        <UserPlus className="w-4 h-4" />
                        {t('findCombatants')}
                    </Button>

                    {/* Community Clans */}
                    <div className="pt-6 border-t border-primary/5 space-y-4">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-emerald-500" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">{t('activeClan', { clan: 'Zen Seekers' })}</p>
                        </div>
                        <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-[2rem] border border-emerald-500/10">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold">{t('clanGoal', { goal: '10k XP' })}</span>
                                <span className="text-[10px] font-black text-emerald-600">{t('progress', { current: '7,400', target: '10,000' })}</span>
                            </div>
                            <div className="h-2 w-full bg-emerald-500/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '74%' }}
                                    className="h-full bg-emerald-500"
                                />
                            </div>
                            <p className="text-[9px] text-muted-foreground mt-3 font-medium italic">{t('clanMotto')}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function Star(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    )
}
