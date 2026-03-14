'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { History, Award, Calendar, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export function ZenArchive() {
    const t = useTranslations('Wellness');
    const [certificatesShown] = useLocalStorage<any>('certificatesShown', {});
    const [wellnessHistory] = useLocalStorage<any>('wellnessHistory', {});

    const historyItems = Object.keys(wellnessHistory).sort((a, b) => b.localeCompare(a)).slice(0, 5);

    return (
        <Card className="glass-card rounded-[2.5rem] overflow-hidden border-none shadow-2xl h-full">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-foreground/70">
                    <History className="w-4 h-4 text-primary" />
                    {t('zenArchive')}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-4">
                    {historyItems.length > 0 ? (
                        historyItems.map((date, index) => {
                            const hasCertificate = !!certificatesShown[date];
                            const score = wellnessHistory[date];

                            return (
                                <motion.div
                                    key={date}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10 group cursor-pointer hover:bg-primary/10 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-primary border border-primary/10">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-foreground">{new Date(date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{score}% {t('goalAttained')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {hasCertificate && (
                                            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                                                <Award className="w-4 h-4" />
                                            </div>
                                        )}
                                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12">
                            <History className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{t('historyTitle')}</p>
                        </div>
                    )}
                </div>

                {historyItems.length > 0 && (
                    <Button variant="ghost" className="w-full mt-6 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5">
                        {t('viewChronicle')}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
