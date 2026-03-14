'use client';

import * as React from 'react';
import { Download, Smartphone, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useXP } from '@/hooks/useXP';
import { toast } from '@/hooks/use-toast';

export function InstallPWA() {
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
                title: "Welcome to the Family!",
                description: "App installed successfully. Enjoy 100 bonus XP!",
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

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] w-[calc(100%-2rem)] max-w-md"
            >
                <div className="glass-premium p-6 rounded-[2.5rem] shadow-2xl border border-primary/20 flex items-center justify-between gap-6 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                            <Smartphone className="w-7 h-7" />
                        </div>
                        <div>
                            <h4 className="text-lg font-black font-headline tracking-tight text-foreground">Take DailyDine Plus Home</h4>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Install for the full experience</p>
                        </div>
                    </div>

                    <Button
                        onClick={handleInstall}
                        className="rounded-2xl bg-primary hover:bg-primary/90 text-white font-black h-14 px-8 shadow-xl shadow-primary/20 relative z-10 hover:scale-105 active:scale-95 transition-all gap-2"
                    >
                        <Download className="w-5 h-5" />
                        INSTALL
                    </Button>

                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/5 rounded-full blur-2xl" />
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
