'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccessibility } from './ClientShell';
import { Sun, Moon, Eye, Type, BrainCircuit, MessageSquare, Compass, ShieldAlert, Calendar } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, highContrast, fontSize, toggleTheme, toggleHighContrast, setFontSize } = useAccessibility();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: BrainCircuit },
    { name: 'Onboarding', path: '/onboarding', icon: Calendar },
    { name: 'AI Companion', path: '/companion', icon: MessageSquare },
    { name: 'Future Self', path: '/simulator', icon: Compass },
    { name: 'Weekly Replay', path: '/replay', icon: Calendar },
  ];

  return (
    <header 
      className="sticky top-0 z-50 w-full glass-panel border-b border-card-border" 
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground focus:ring-2 focus:ring-primary rounded-md px-2 py-1 outline-none"
            aria-label="MindPilot AI Home"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md shadow-primary/20">
              <BrainCircuit size={18} />
            </div>
            <span className="bg-gradient-to-r from-foreground to-text-muted bg-clip-text text-transparent font-extrabold">
              MindPilot <span className="text-primary">AI</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav 
          className="hidden md:flex items-center gap-1" 
          role="navigation"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:ring-2 focus:ring-primary outline-none ${
                  isActive 
                    ? 'bg-primary/10 text-primary border-b-2 border-primary' 
                    : 'text-text-muted hover:text-foreground hover:bg-white/5'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={16} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Accessibility Toolbar + Action buttons */}
        <div className="flex items-center gap-3">
          {/* Accessibility Widget Panel */}
          <div 
            className="flex items-center gap-1.5 bg-white/5 p-1 rounded-lg border border-card-border"
            role="toolbar" 
            aria-label="Accessibility settings"
          >
            {/* Contrast toggle */}
            <button
              onClick={toggleHighContrast}
              className={`p-1.5 rounded-md text-text-muted hover:text-foreground transition-all hover:bg-white/5 focus:ring-2 focus:ring-primary outline-none ${
                highContrast ? 'text-primary bg-primary/20' : ''
              }`}
              title="Toggle High Contrast Mode"
              aria-label="Toggle High Contrast Mode"
              aria-pressed={highContrast}
            >
              <Eye size={16} />
            </button>

            {/* Font Size toggles */}
            <button
              onClick={() => setFontSize('normal')}
              className={`p-1 text-xs font-bold rounded px-1.5 focus:ring-2 focus:ring-primary outline-none ${
                fontSize === 'normal' ? 'text-primary bg-primary/20' : 'text-text-muted hover:text-foreground'
              }`}
              title="Set standard font size"
              aria-label="Set standard font size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`p-1 text-xs font-bold rounded px-1.5 focus:ring-2 focus:ring-primary outline-none ${
                fontSize === 'large' ? 'text-primary bg-primary/20' : 'text-text-muted hover:text-foreground'
              }`}
              title="Set large font size"
              aria-label="Set large font size"
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`p-1 text-xs font-bold rounded px-1.5 focus:ring-2 focus:ring-primary outline-none ${
                fontSize === 'xlarge' ? 'text-primary bg-primary/20' : 'text-text-muted hover:text-foreground'
              }`}
              title="Set extra large font size"
              aria-label="Set extra large font size"
            >
              A++
            </button>

            {/* Divider */}
            <span className="w-[1px] h-4 bg-card-border" />

            {/* Light/Dark Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md text-text-muted hover:text-foreground transition-all hover:bg-white/5 focus:ring-2 focus:ring-primary outline-none"
              title="Toggle Light/Dark Theme"
              aria-label="Toggle Light/Dark Theme"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>

          {/* SOS CALM ROOM Trigger */}
          <Link
            href="/calm-room"
            className="flex items-center gap-1.5 bg-error/10 border border-error/20 hover:bg-error/20 text-error px-3 py-1.5 rounded-lg text-sm font-semibold transition-all focus:ring-2 focus:ring-error outline-none"
            aria-label="SOS Calm Room"
          >
            <ShieldAlert size={16} className="animate-pulse" />
            <span className="hidden sm:inline">SOS Calm</span>
          </Link>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-card-border py-2 px-4 bg-background/50 backdrop-blur-md">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-xs font-medium focus:ring-2 focus:ring-primary outline-none ${
                isActive ? 'text-primary' : 'text-text-muted hover:text-foreground'
              }`}
              aria-label={item.name}
            >
              <Icon size={18} />
              <span>{item.name.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
