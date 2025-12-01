'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, FolderOpen, BarChart3, Settings, Plus, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
    onNewProject?: () => void;
    activeTab?: string;
    onTabChange?: (tab: 'dashboard' | 'projects' | 'analytics' | 'settings') => void;
}

export function Sidebar({ onNewProject, activeTab = 'dashboard', onTabChange }: SidebarProps) {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Initialize theme on mount
    useEffect(() => {
        setMounted(true);

        // Check for saved theme preference or default to system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

        setIsDark(shouldBeDark);
        if (shouldBeDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);

        if (newTheme) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const menuItems = [
        { id: 'dashboard' as const, label: 'Dashboard', icon: Home },
        { id: 'projects' as const, label: 'Projects', icon: FolderOpen },
        { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
        { id: 'settings' as const, label: 'Settings', icon: Settings },
    ];

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col animate-pulse">
                <div className="p-6 border-b border-sidebar-border">
                    <div className="h-8 bg-muted rounded w-32 mb-2" />
                    <div className="h-4 bg-muted rounded w-24" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col animate-slideIn">
            {/* Header */}
            <div className="p-6 border-b border-sidebar-border">
                <h1 className="text-2xl font-serif font-bold text-sidebar-foreground">
                    AI Research
                </h1>
                <p className="text-sm text-sidebar-foreground/60 mt-1">Paper Generator</p>
            </div>

            {/* New Project Button */}
            <div className="p-4">
                <Button
                    className="w-full justify-start gap-2 transition-smooth hover:scale-[1.02]"
                    onClick={onNewProject}
                >
                    <Plus className="w-4 h-4" />
                    New Project
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-2">
                {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange?.(item.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-smooth mb-1 animate-slideIn",
                                activeTab === item.id
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:translate-x-1"
                            )}
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <Icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* Theme Toggle */}
            <div className="p-4 border-t border-sidebar-border">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleTheme}
                    className="w-full justify-start gap-2 transition-smooth hover:scale-[1.02]"
                >
                    {isDark ? (
                        <>
                            <Sun className="w-4 h-4 animate-scaleIn" />
                            Light Mode
                        </>
                    ) : (
                        <>
                            <Moon className="w-4 h-4 animate-scaleIn" />
                            Dark Mode
                        </>
                    )}
                </Button>

                {/* Theme Indicator */}
                <div className="mt-2 text-xs text-center text-muted-foreground">
                    {isDark ? '🌙 Scientific Dark' : '☀️ Scientific Light'}
                </div>
            </div>
        </div>
    );
}
