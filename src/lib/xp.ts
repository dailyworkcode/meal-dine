export const XP_ACTIONS = {
    LOG_WATER: 10,
    COMPLETE_HABIT: 25,
    ZEN_JOURNAL: 50,
    YOGA_SESSION: 100,
    BREATHING_EXERCISE: 30,
    MEAL_PLAN_GENERATE: 20,
    FOOD_SCAN: 40,
    SOCIAL_SHARE: 50,
};

/**
 * Calculates level based on total XP.
 * Formula: Level = floor(sqrt(xp / 100)) + 1
 */
export function calculateLevel(xp: number): number {
    if (!xp || xp < 0) return 1;
    return Math.floor(Math.sqrt(xp / 100)) + 1;
}

/**
 * Calculates total XP required to reach a specific level.
 * Formula: XP = (level - 1)^2 * 100
 */
export function xpForLevel(level: number): number {
    return Math.pow(level - 1, 2) * 100;
}

/**
 * Calculates progress percentage toward the next level.
 */
export function getLevelProgress(xp: number): number {
    const currentLevel = calculateLevel(xp);
    const xpStartOfLevel = xpForLevel(currentLevel);
    const xpEndOfLevel = xpForLevel(currentLevel + 1);

    const totalXpForThisLevel = xpEndOfLevel - xpStartOfLevel;
    const earnedXpInThisLevel = xp - xpStartOfLevel;

    return Math.min(Math.round((earnedXpInThisLevel / totalXpForThisLevel) * 100), 100);
}
