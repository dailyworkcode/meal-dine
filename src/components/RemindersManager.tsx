'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { type UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function RemindersManager() {
    const t = useTranslations('Reminders');
    const { toast } = useToast();
    const [userProfile] = useLocalStorage<UserProfile | null>('userProfile', null);
    const [remindersEnabled, setRemindersEnabled] = useLocalStorage('remindersEnabled', false);

    React.useEffect(() => {
        if (!remindersEnabled && userProfile) {
            requestPermission();
        }
    }, [userProfile]);

    const requestPermission = async () => {
        if (!('Notification' in window)) return;

        if (Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                setRemindersEnabled(true);
                showWelcomeNotification();
            }
        } else if (Notification.permission === 'granted') {
            setRemindersEnabled(true);
        }
    };

    const showWelcomeNotification = () => {
        new Notification("PulseAI Reminders Active", {
            body: "We'll nudge you throughout the day to stay mindful and hydrated. ✨",
            icon: "/favicon.ico"
        });
    };

    React.useEffect(() => {
        if (!remindersEnabled) return;

        // Schedule periodic checks
        const interval = setInterval(() => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            // Hydration reminder (Every 2 hours between 9 AM and 9 PM)
            if (hours >= 9 && hours <= 21 && minutes === 0 && hours % 2 === 0) {
                sendNotification(t('hydrationTitle'), t('hydrationBody'));
            }

            // Yoga reminder (Around 5 PM)
            if (hours === 17 && minutes === 0) {
                sendNotification(t('yogaTitle'), t('yogaBody'));
            }

            // Mindful Dinner reminder (Around 7:30 PM)
            if (hours === 19 && minutes === 30) {
                sendNotification(t('mealTitle'), t('mealBody'));
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [remindersEnabled, t]);

    const sendNotification = (title: string, body: string) => {
        if (Notification.permission === 'granted') {
            new Notification(title, { body, icon: "/favicon.ico" });
        }
    };

    return null; // Background component
}
