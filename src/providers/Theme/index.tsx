'use client';

import React, { createContext, use, useCallback, useEffect, useState } from 'react';

import type { Theme, ThemeContextType } from './types';

import canUseDOM from '@/utilities/canUseDOM';
import { defaultTheme, themeLocalStorageKey } from './shared';
import { themeIsValid } from './types';

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: undefined,
};

const ThemeContext = createContext(initialContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme | undefined>(
    canUseDOM ? (document.documentElement.getAttribute('data-theme') as Theme) : undefined,
  );

  const setTheme = useCallback((themeToSet: Theme | null) => {
    if (themeToSet === null) {
      window.localStorage.removeItem(themeLocalStorageKey);
      // Always default to light theme instead of system preference
      document.documentElement.setAttribute('data-theme', 'light');
      setThemeState('light');
    } else {
      setThemeState(themeToSet);
      window.localStorage.setItem(themeLocalStorageKey, themeToSet);
      document.documentElement.setAttribute('data-theme', themeToSet);
    }
  }, []);

  useEffect(() => {
    let themeToSet: Theme = defaultTheme;
    const preference = window.localStorage.getItem(themeLocalStorageKey);

    if (themeIsValid(preference)) {
      themeToSet = preference;
    } else {
      // Always default to light theme instead of system preference
      themeToSet = 'light';
    }

    document.documentElement.setAttribute('data-theme', themeToSet);
    setThemeState(themeToSet);
  }, []);

  return <ThemeContext value={{ setTheme, theme }}>{children}</ThemeContext>;
};

export const useTheme = (): ThemeContextType => use(ThemeContext);
