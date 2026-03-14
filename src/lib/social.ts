export interface Friend {
    id: string;
    name: string;
    level: number;
    xp: number;
    streak: number;
    avatar: string;
    isOnline: boolean;
}

export const MOCK_FRIENDS: Friend[] = [
    {
        id: 'f1',
        name: 'Elena "The Sage"',
        level: 12,
        xp: 14400,
        streak: 15,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
        isOnline: true
    },
    {
        id: 'f2',
        name: 'Marcus Bolt',
        level: 8,
        xp: 6400,
        streak: 5,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
        isOnline: false
    },
    {
        id: 'f3',
        name: 'Serenity Sky',
        level: 15,
        xp: 22500,
        streak: 22,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Serenity',
        isOnline: true
    },
    {
        id: 'f4',
        name: 'Kai Zen',
        level: 5,
        xp: 2500,
        streak: 3,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kai',
        isOnline: true
    }
];

export function getNeighboringRank(userXP: number): Friend[] {
    // Combine user with mock data and sort
    const all = [...MOCK_FRIENDS].sort((a, b) => b.xp - a.xp);
    return all.slice(0, 5);
}
