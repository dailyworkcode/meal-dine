'use client';

import { useLocalStorage } from './useLocalStorage';
import { UserProfile } from '@/lib/types';
import { calculateLevel, XP_ACTIONS } from '@/lib/xp';
import { useCallback } from 'react';

export function useXP() {
    const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('userProfile', null);

    const awardXP = useCallback((amount: number) => {
        setUserProfile((prev) => {
            if (!prev) return prev;
            const currentXP = prev.xp || 0;
            const newXP = currentXP + amount;
            const newLevel = calculateLevel(newXP);
            const oldLevel = prev.level || 1;

            return {
                ...prev,
                xp: newXP,
                level: newLevel,
            };
        });
    }, [setUserProfile]);

    return {
        awardXP,
        xp: userProfile?.xp || 0,
        level: userProfile?.level || 1,
        XP_ACTIONS,
    };
}
