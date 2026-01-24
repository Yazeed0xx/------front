import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => Promise<void>;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { colorScheme: systemColorScheme, setColorScheme } = useColorScheme();
  const [theme, setThemeState] = useState<Theme>((systemColorScheme as Theme) ?? 'light');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          // Use saved preference
          setThemeState(savedTheme);
          setColorScheme(savedTheme);
        } else {
          // Use system preference if no saved theme
          const systemTheme = (systemColorScheme as Theme) ?? 'light';
          setThemeState(systemTheme);
          setColorScheme(systemTheme);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
        // Fallback to system preference
        const systemTheme = (systemColorScheme as Theme) ?? 'light';
        setThemeState(systemTheme);
        setColorScheme(systemTheme);
      } finally {
        setIsInitialized(true);
      }
    };

    loadTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setThemeState(newTheme);
      setColorScheme(newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    isDark: theme === 'dark',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}