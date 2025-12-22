import { useState, useCallback, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(`weddingRegistry_${key}`);
      if (!item) return initialValue;
      
      const parsed = JSON.parse(item);
      
      // Check if data is expired (older than 7 days)
      if (parsed.timestamp) {
        const storedDate = new Date(parsed.timestamp);
        const expirationDate = new Date(storedDate.getTime() + (7 * 24 * 60 * 60 * 1000));
        if (new Date() > expirationDate) {
          window.localStorage.removeItem(`weddingRegistry_${key}`);
          return initialValue;
        }
      }
      
      return parsed.data || initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      const dataToStore = {
        data: valueToStore,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      
      window.localStorage.setItem(`weddingRegistry_${key}`, JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key, storedValue]);

  const clearValue = useCallback(() => {
    try {
      window.localStorage.removeItem(`weddingRegistry_${key}`);
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Error clearing from localStorage:', error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, clearValue];
}