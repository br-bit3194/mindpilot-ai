'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Navbar from './Navbar';

type Theme = 'dark' | 'light';
type FontSize = 'normal' | 'large' | 'xlarge';

interface AccessibilityContextProps {
  theme: Theme;
  highContrast: boolean;
  fontSize: FontSize;
  toggleTheme: () => void;
  toggleHighContrast: () => void;
  setFontSize: (size: FontSize) => void;
}

const AccessibilityContext = createContext<AccessibilityContextProps | undefined>(undefined);

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSizeState] = useState<FontSize>('normal');
  const [mounted, setMounted] = useState(false);

  // Load accessibility settings from LocalStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('mindpilot-theme') as Theme;
    const savedHC = localStorage.getItem('mindpilot-hc') === 'true';
    const savedFS = localStorage.getItem('mindpilot-fs') as FontSize;

    if (savedTheme) setTheme(savedTheme);
    setHighContrast(savedHC);
    if (savedFS) setFontSizeState(savedFS);
    
    setMounted(true);
  }, []);

  // Save settings when they change
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('mindpilot-theme', theme);
    localStorage.setItem('mindpilot-hc', String(highContrast));
    localStorage.setItem('mindpilot-fs', fontSize);
  }, [theme, highContrast, fontSize, mounted]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const setFontSize = (size: FontSize) => setFontSizeState(size);

  // Compose class names for layout wrapper
  const themeClass = highContrast ? 'high-contrast-mode' : theme === 'light' ? 'light-mode' : '';
  const fontClass = fontSize === 'large' ? 'font-size-large' : fontSize === 'xlarge' ? 'font-size-xlarge' : '';

  // Return a shell that wraps children
  return (
    <AccessibilityContext.Provider
      value={{
        theme,
        highContrast,
        fontSize,
        toggleTheme,
        toggleHighContrast,
        setFontSize,
      }}
    >
      <div 
        id="app-root-shell"
        className={`min-h-screen flex flex-col transition-colors duration-300 ${themeClass} ${fontClass}`}
        aria-label="MindPilot AI Application Shell"
      >
        <Navbar />
        <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 focus:outline-none" tabIndex={-1}>
          {mounted ? children : (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
        </main>
      </div>
    </AccessibilityContext.Provider>
  );
}
