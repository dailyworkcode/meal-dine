'use client';

import { useState, useEffect, useCallback } from 'react';

// Type guard to check if window is defined (for server-side rendering)
const isClient = typeof window !== 'undefined';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const readValue = useCallback((): T => {
    if (!isClient) {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Custom event name for syncing within the same tab
  const CUSTOM_EVENT = `local-storage-${key}`;

  const setValue = (value: T | ((val: T) => T)) => {
    if (!isClient) {
      console.warn(
        `Tried setting localStorage key “${key}” even though environment is not a client`
      );
    }

    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));

      // Dispatch custom event for same-tab synchronization
      window.dispatchEvent(new CustomEvent(CUSTOM_EVENT, { detail: valueToStore }));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        setStoredValue(readValue());
      }
    };

    const handleCustomChange = (e: any) => {
      setStoredValue(e.detail);
    };

    if (isClient) {
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener(CUSTOM_EVENT, handleCustomChange);
    }

    return () => {
      if (isClient) {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener(CUSTOM_EVENT, handleCustomChange);
      }
    };
  }, [key, readValue, CUSTOM_EVENT]);

  return [storedValue, setValue];
}
