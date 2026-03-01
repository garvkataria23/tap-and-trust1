import React, { createContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export { ThemeContext };

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') as Theme | null;
    
    if (savedTheme === 'light') {
      setThemeState('light');
    } else {
      setThemeState('dark');
      localStorage.setItem('app-theme', 'dark');
    }
  }, []);

  // Update document element and save to localStorage
  useEffect(() => {
    const html = document.documentElement;
    
    // Remove all theme classes
    html.classList.remove('light-theme', 'dark-theme');
    
    // Apply new theme
    if (theme === 'light') {
      html.classList.add('light-theme');
      html.style.colorScheme = 'light';
    } else {
      html.classList.add('dark-theme');
      html.style.colorScheme = 'dark';
    }
    
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
