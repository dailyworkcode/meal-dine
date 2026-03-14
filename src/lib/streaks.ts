/**
 * Calculates the current daily habit streak.
 * A day is considered "streaked" if at least 3 habits were completed.
 */
export function calculateHabitStreak(habits: { [key: string]: { [habit: string]: boolean } }): number {
    if (!habits) return 0;

    let streak = 0;
    const date = new Date();

    // Start from today
    while (true) {
        const dateKey = date.toISOString().split('T')[0];
        const dayHabits = habits[dateKey] || {};
        const completedCount = Object.values(dayHabits).filter(Boolean).length;

        // If 3 or more habits are completed, it's a success
        if (completedCount >= 3) {
            streak++;
            date.setDate(date.getDate() - 1);
        } else {
            const todayKey = new Date().toISOString().split('T')[0];
            // If today is not yet complete, don't break the streak, just check yesterday
            if (dateKey === todayKey) {
                date.setDate(date.getDate() - 1);
                continue;
            }
            break;
        }
    }

    return streak;
}

/**
 * Calculates hydration streak based on IndexedDB logs would be async.
 * For now, let's provide a way to check if a date range is continuous.
 */
