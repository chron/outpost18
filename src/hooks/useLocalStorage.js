import { useState } from 'react';

export default function useLocalStorage(key, defaultValue = null) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
      console.error(e);
      return defaultValue;
    }
  });

  const setValue = (value) => {
    setStoredValue(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue];
}
