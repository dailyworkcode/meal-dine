'use client';

import * as React from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useXP } from '@/hooks/useXP';
import { toast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';

export function InstallPWA() {
    const t = useTranslations('InstallPWA');
    const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
    const [isInstalled, setIsInstalled] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    const { awardXP, XP_ACTIONS } = useXP();

    React.useEffect(() => {
        setMounted(true);

        const handlePrompt = (e: any) => {
            console.log('beforeinstallprompt event detected in component');
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
        };

        const handleCustomPrompt = (e: any) => {
            console.log('pwa-prompt-available custom event detected');
            handlePrompt(e.detail);
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setIsVisible(false);
            setDeferredPrompt(null);
            awardXP(100);
            toast({
                title: t('title'),
                description: t('desc'),
            });
        };

        // Check if event was already captured by layout script
        if ((window as any).deferredPrompt) {
            console.log('Found early captured prompt');
            handlePrompt((window as any).deferredPrompt);
        }

        window.addEventListener('beforeinstallprompt', handlePrompt);
        window.addEventListener('pwa-prompt-available', handleCustomPrompt as any);
        window.addEventListener('appinstalled', handleAppInstalled);

        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handlePrompt);
            window.removeEventListener('pwa-prompt-available', handleCustomPrompt as any);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, [awardXP]);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsVisible(false);
            (window as any).deferredPrompt = null;
        }
    };

    if (!mounted || isInstalled || !isVisible) return null;

    const handleDismiss = () => {
        setIsVisible(false);
        setDeferredPrompt(null);
        (window as any).deferredPrompt = null;
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, x: "-50%", scale: 0.95 }}
                animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                exit={{ opacity: 0, y: 50, x: "-50%", scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="fixed bottom-6 md:bottom-8 left-1/2 z-[999] w-[calc(100%-2rem)] max-w-sm"
            >
                <div className="glass-premium p-2 pr-3 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] border border-primary/20 flex items-center justify-between gap-3 overflow-hidden relative group bg-background/80 backdrop-blur-3xl">
                    <div className="flex items-center gap-3 w-full relative z-10">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-primary/80 flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
                            <Smartphone className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div className="flex flex-col overflow-hidden min-w-0 flex-1">
                            <p className="text-sm font-black font-headline truncate tracking-tight leading-tight">{t('title')}</p>
                            <p className="text-[10px] font-bold text-muted-foreground truncate uppercase tracking-widest">{t('desc')}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 pl-2">
                            <Button 
                                onClick={handleInstall}
                                size="sm" 
                                className="h-9 px-4 rounded-full font-bold shadow-md hover:scale-105 active:scale-95 transition-all bg-primary text-primary-foreground text-xs"
                            >
                                <Download className="w-3.5 h-3.5 mr-1.5" />
                                {t('install')}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleDismiss}
                                className="h-8 w-8 rounded-full opacity-60 hover:opacity-100 hover:bg-foreground/5 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
