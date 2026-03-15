'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Award, Share2, CheckCircle2, Star, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface HealthCertificateProps {
    score: number;
    points: number;
    userName: string;
    onClose: () => void;
}

export function HealthCertificate({ score, points, userName, onClose }: HealthCertificateProps) {
    const t = useTranslations('Wellness');
    const today = new Date().toLocaleDateString();

    return (
        <div className="relative overflow-hidden p-10 flex flex-col items-center">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-50px] opacity-20"
            >
                <Star className="w-64 h-64 text-primary blur-3xl" />
            </motion.div>

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative z-10 flex flex-col items-center text-center w-full"
            >
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-primary-foreground mb-6 shadow-2xl shadow-primary/40 ring-4 ring-primary/20">
                    <Trophy className="w-12 h-12" />
                </div>

                <h2 className="text-4xl font-black font-headline text-foreground mb-2">
                    {t('certificateTitle')}
                </h2>
                <p className="text-lg font-medium text-muted-foreground uppercase tracking-widest mb-10">
                    {t('certificateSubtitle')}
                </p>

                <Card className="w-full bg-white/50 dark:bg-black/50 backdrop-blur-md border-2 border-primary/20 rounded-[2rem] p-8 mb-10 shadow-inner">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase tracking-tighter text-muted-foreground">{t('certifiedTo')}</p>
                            <p className="text-xl font-bold text-foreground">{userName || t('wellnessExplorer')}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase tracking-tighter text-muted-foreground">{t('certificateDate')}</p>
                            <p className="text-xl font-bold text-foreground">{today}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase tracking-tighter text-muted-foreground">{t('certificateScore')}</p>
                            <div className="flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                <p className="text-2xl font-black text-primary">{score}%</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase tracking-tighter text-muted-foreground">{t('certificateTotalPoints')}</p>
                            <p className="text-2xl font-black text-primary">{points} WP</p>
                        </div>
                    </div>
                </Card>

                <div className="flex gap-4 w-full">
                    <Button
                        onClick={() => { }}
                        className="flex-1 h-14 rounded-2xl bg-secondary text-secondary-foreground font-bold hover:bg-secondary/80"
                    >
                        <Share2 className="w-5 h-5 mr-2" />
                        {t('certificateShare')}
                    </Button>
                    <Button
                        onClick={onClose}
                        className="flex-1 h-14 rounded-2xl font-bold shadow-xl shadow-primary/20"
                    >
                        {t('done')}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
