'use client';

import React, { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, TrendingUp } from 'lucide-react';

export function WellnessCharts() {
    const t = useTranslations('Wellness');
    const [history] = useLocalStorage<any>('wellnessHistory', {});

    const chartData = useMemo(() => {
        // Get last 7 days including today
        const dates = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });

        return dates.map(date => ({
            date: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
            score: history[date] || 0,
        }));
    }, [history]);

    const averageScore = Math.round(
        chartData.reduce((acc, curr) => acc + curr.score, 0) / chartData.length
    );

    return (
        <Card className="glass-card rounded-[2.5rem] overflow-hidden border-none shadow-2xl h-full">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm font-black uppercase tracking-[0.2em] text-foreground/70">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        {t('vitalityPulse')}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        {averageScore}% {t('avergeStatus')}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--primary)/0.1)" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontWeight: 'bold', fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis
                            hide
                            domain={[0, 100]}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderRadius: '1rem',
                                border: 'none',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="score"
                            stroke="hsl(var(--primary))"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorScore)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
