import { openDB, IDBPDatabase } from 'idb';
import type { MealPlanWithRecipes } from './types';
import type { GenerateYogaSessionOutput } from '@/ai/schemas';

const DB_NAME = 'DailyDineDB';
const STORE_NAME_MEALS = 'mealPlans';
const STORE_NAME_YOGA = 'yogaSessions';
const STORE_NAME_POSES = 'masteredPoses';
const STORE_NAME_HYDRATION = 'hydrationLogs';
const STORE_NAME_SLEEP = 'sleep';
const STORE_NAME_ACHIEVEMENTS = 'achievements';
const STORE_NAME_MEDITATION = 'meditation';
const DB_VERSION = 7;

let dbPromise: Promise<IDBPDatabase> | null = null;

if (typeof window !== 'undefined') {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion, newVersion, transaction) {
            if (!db.objectStoreNames.contains(STORE_NAME_MEALS)) {
                db.createObjectStore(STORE_NAME_MEALS);
            }
            if (!db.objectStoreNames.contains(STORE_NAME_YOGA)) {
                db.createObjectStore(STORE_NAME_YOGA);
            }
            if (!db.objectStoreNames.contains(STORE_NAME_POSES)) {
                db.createObjectStore(STORE_NAME_POSES);
            }
            if (!db.objectStoreNames.contains(STORE_NAME_HYDRATION)) {
                db.createObjectStore(STORE_NAME_HYDRATION);
            }
            // Add new store for sleep data
            if (!db.objectStoreNames.contains(STORE_NAME_SLEEP)) {
                db.createObjectStore(STORE_NAME_SLEEP);
            }
            if (!db.objectStoreNames.contains(STORE_NAME_ACHIEVEMENTS)) {
                db.createObjectStore(STORE_NAME_ACHIEVEMENTS);
            }
            if (!db.objectStoreNames.contains(STORE_NAME_MEDITATION)) {
                db.createObjectStore(STORE_NAME_MEDITATION);
            }
        },
    });
}

/**
 * Saves a meal plan to IndexedDB.
 * @param dateKey The date string (e.g., 2026-02-17)
 * @param plan The meal plan object
 */
export async function saveMealPlan(dateKey: string, plan: MealPlanWithRecipes): Promise<void> {
    if (!dbPromise) return;
    const db = await dbPromise;
    await db.put(STORE_NAME_MEALS, plan, dateKey);
}

/**
 * Retrieves a meal plan from IndexedDB.
 * @param dateKey The date string
 * @returns The meal plan or undefined
 */
export async function getMealPlan(dateKey: string): Promise<MealPlanWithRecipes | undefined> {
    if (!dbPromise) return undefined;
    const db = await dbPromise;
    return db.get(STORE_NAME_MEALS, dateKey);
}

export async function saveYogaSession(dateKey: string, session: GenerateYogaSessionOutput): Promise<void> {
    if (!dbPromise) return;
    const db = await dbPromise;
    await db.put(STORE_NAME_YOGA, session, dateKey);
}

export async function getYogaSession(dateKey: string): Promise<GenerateYogaSessionOutput | undefined> {
    if (!dbPromise) return undefined;
    const db = await dbPromise;
    return db.get(STORE_NAME_YOGA, dateKey);
}

/**
 * Cleans up old meal plans, keeping only the most recent ones.
 * @param currentKey The key to keep
 */
export async function cleanupOldPlans(currentKey: string): Promise<void> {
    if (!dbPromise) return;
    const db = await dbPromise;

    // Cleanup meals
    {
        const tx = db.transaction(STORE_NAME_MEALS, 'readwrite');
        const store = tx.objectStore(STORE_NAME_MEALS);
        const keys = await store.getAllKeys();
        for (const key of keys) {
            if (key !== currentKey) {
                await store.delete(key);
            }
        }
        await tx.done;
    }

    // Cleanup yoga
    {
        const tx = db.transaction(STORE_NAME_YOGA, 'readwrite');
        const store = tx.objectStore(STORE_NAME_YOGA);
        const keys = await store.getAllKeys();
        for (const key of keys) {
            if (key !== currentKey) {
                await store.delete(key);
            }
        }
        await tx.done;
    }
}

export async function markPoseMastered(poseName: string): Promise<void> {
    if (!dbPromise) return;
    const db = await dbPromise;
    await db.put(STORE_NAME_POSES, true, poseName);
}

export async function getMasteredPoses(): Promise<string[]> {
    if (!dbPromise) return [];
    const db = await dbPromise;
    return db.getAllKeys(STORE_NAME_POSES) as Promise<string[]>;
}

export async function saveHydration(dateKey: string, amount: number): Promise<void> {
    if (!dbPromise) return;
    const db = await dbPromise;
    await db.put(STORE_NAME_HYDRATION, amount, dateKey);
}

export async function getHydration(dateKey: string): Promise<number> {
    if (!dbPromise) return 0;
    const db = await dbPromise;
    return (await db.get(STORE_NAME_HYDRATION, dateKey)) || 0;
}

export interface SleepData {
    duration: number; // in hours
    quality: number; // 1-10
    recoveryScore: number; // 1-100
    notes: string;
}

export async function saveSleep(dateKey: string, data: SleepData): Promise<void> {
    if (!dbPromise) return;
    const db = await dbPromise;
    await db.put(STORE_NAME_SLEEP, data, dateKey);
}

export async function getSleep(dateKey: string): Promise<SleepData | null> {
    if (!dbPromise) return null;
    const db = await dbPromise;
    return (await db.get(STORE_NAME_SLEEP, dateKey)) || null;
}

export interface Achievement {
    id: string;
    unlockedAt: string;
    progress?: number;
}

export async function unlockAchievement(id: string): Promise<void> {
    if (!dbPromise) return;
    const db = await dbPromise;
    const achievement: Achievement = {
        id,
        unlockedAt: new Date().toISOString(),
    };
    await db.put(STORE_NAME_ACHIEVEMENTS, achievement, id);
}

export async function getUnlockedAchievements(): Promise<Achievement[]> {
    if (!dbPromise) return [];
    const db = await dbPromise;
    return db.getAll(STORE_NAME_ACHIEVEMENTS);
}

export interface MeditationSession {
    id: string;
    duration: number; // in seconds
    date: string;
    pattern: string;
}

export async function saveMeditationSession(session: MeditationSession): Promise<void> {
    if (!dbPromise) return;
    const db = await dbPromise;
    await db.put(STORE_NAME_MEDITATION, session, session.id);
}

export async function getMeditationHistory(): Promise<MeditationSession[]> {
    if (!dbPromise) return [];
    const db = await dbPromise;
    return db.getAll(STORE_NAME_MEDITATION);
}
