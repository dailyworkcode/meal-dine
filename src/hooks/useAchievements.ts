'use client';

import * as React from 'react';
import { unlockAchievement, getUnlockedAchievements, Achievement } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export function useAchievements() {
    const { toast } = useToast();
    const [unlockedIds, setUnlockedIds] = React.useState<Set<string>>(new Set());

    React.useEffect(() => {
        const load = async () => {
            const data = await getUnlockedAchievements();
            setUnlockedIds(new Set(data.map(a => a.id)));
        };
        load();
    }, []);

    const unlock = async (id: string, title: string) => {
        if (unlockedIds.has(id)) return;

        await unlockAchievement(id);
        setUnlockedIds(prev => new Set([...Array.from(prev), id]));

        toast({
            title: "Achievement Unlocked! 🏆",
            description: `You've earned: ${title}`,
            variant: "default",
        });
    };

    return { unlock, isUnlocked: (id: string) => unlockedIds.has(id) };
}
