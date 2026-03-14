'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'sunrise' | 'daylight' | 'afternoon' | 'twilight' | 'midnight';
export type ThemePreference = 'auto' | 'daylight' | 'afternoon' | 'midnight';

interface ChronoThemeContextType {
    theme: Theme;
    timeLabel: string;
    preference: ThemePreference;
    setPreference: (pref: ThemePreference) => void;
}

const ChronoThemeContext = createContext<ChronoThemeContextType | undefined>(undefined);

export function ChronoThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('daylight');
    const [timeLabel, setTimeLabel] = useState('');
    const [preference, setPreferenceState] = useState<ThemePreference>('auto');

    // Load preference from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('chrono-theme-preference') as ThemePreference;
        if (saved && ['auto', 'daylight', 'afternoon', 'midnight'].includes(saved)) {
            setPreferenceState(saved);
        }
    }, []);

    const setPreference = (pref: ThemePreference) => {
        setPreferenceState(pref);
        localStorage.setItem('chrono-theme-preference', pref);
    };

    useEffect(() => {
        const updateTheme = () => {
            const root = window.document.documentElement;
            let currentTheme: Theme = 'daylight';
            let label = '';

            if (preference === 'auto') {
                const hour = new Date().getHours();
                if (hour >= 6 && hour < 10) {
                    currentTheme = 'sunrise';
                    label = 'Golden Sunrise';
                } else if (hour >= 10 && hour < 14) {
                    currentTheme = 'daylight';
                    label = 'Vibrant Daylight';
                } else if (hour >= 14 && hour < 17) {
                    currentTheme = 'afternoon';
                    label = 'Warm Afternoon';
                } else if (hour >= 17 && hour < 21) {
                    currentTheme = 'twilight';
                    label = 'Serene Twilight';
                } else {
                    currentTheme = 'midnight';
                    label = 'Electric Midnight';
                }
            } else {
                currentTheme = preference as Theme;
                label = preference === 'daylight' ? 'Vibrant Daylight' :
                    preference === 'afternoon' ? 'Warm Afternoon' : 'Electric Midnight';
            }

            setTheme(currentTheme);
            setTimeLabel(label);

            // Apply to document root
            root.classList.remove('theme-sunrise', 'theme-daylight', 'theme-afternoon', 'theme-twilight', 'theme-midnight');
            root.classList.add(`theme-${currentTheme}`);

            // Sync with dark mode for twilight/midnight
            if (currentTheme === 'twilight' || currentTheme === 'midnight' || currentTheme === 'afternoon') {
                // Afternoon is warm but maybe not "dark" in the traditional sense, 
                // but let's see how it looks. Usually dark mode is for night.
                if (currentTheme !== 'afternoon') {
                    root.classList.add('dark');
                } else {
                    root.classList.remove('dark');
                }
            } else {
                root.classList.remove('dark');
            }
        };

        updateTheme();
        const interval = setInterval(updateTheme, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [preference]);

    return (
        <ChronoThemeContext.Provider value={{ theme, timeLabel, preference, setPreference }}>
            {children}
        </ChronoThemeContext.Provider>
    );
}

export const useChronoTheme = () => {
    const context = useContext(ChronoThemeContext);
    if (!context) {
        throw new Error('useChronoTheme must be used within a ChronoThemeProvider');
    }
    return context;
};
