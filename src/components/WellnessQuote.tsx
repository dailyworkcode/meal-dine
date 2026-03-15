'use client';

import * as React from 'react';
import { Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

export function WellnessQuote() {
    const t = useTranslations('WellnessQuote');
    const [quote, setQuote] = React.useState("");

    React.useEffect(() => {
        const quotes = t.raw('quotes') as string[];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(randomQuote);
    }, [t]);

    return (
        <Card className="glass dark:glass-dark group hover:shadow-[0_20px_50px_rgba(var(--primary),0.05)] transition-all duration-700 overflow-hidden min-h-[180px] flex items-center border-none rounded-[2.5rem] relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <CardContent className="p-10 w-full relative">
                <div className="absolute top-6 left-6 text-primary/10 group-hover:text-primary/20 transition-all duration-700 group-hover:-translate-y-1 group-hover:-translate-x-1">
                    <Quote className="w-12 h-12 -scale-x-100" />
                </div>
                <div className="flex flex-col items-center gap-4">
                    <p className="text-2xl font-medium italic text-center relative z-10 font-headline leading-relaxed text-foreground/90 max-w-lg text-balance">
                        "{quote}"
                    </p>
                    <div className="h-1 w-12 bg-primary/20 rounded-full group-hover:w-24 transition-all duration-700" />
                </div>
                <div className="absolute bottom-6 right-6 text-primary/10 group-hover:text-primary/20 transition-all duration-700 group-hover:translate-y-1 group-hover:translate-x-1">
                    <Quote className="w-12 h-12" />
                </div>
            </CardContent>
        </Card>
    );
}
