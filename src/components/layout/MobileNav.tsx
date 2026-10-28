import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  Target,
  BarChart3,
  Settings,
} from 'lucide-react';
import { NavItemKey } from './Sidebar';

interface MobileNavProps {
  currentTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  weakTopicsCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onSelectTab,
  weakTopicsCount,
}) => {
  const items: { key: NavItemKey; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { key: 'generate', label: 'Generate', icon: <Sparkles className="w-5 h-5 text-cyan" /> },
    { key: 'quizzes', label: 'Quizzes', icon: <BookOpen className="w-5 h-5" /> },
    { key: 'weak-topics', label: 'Weak', icon: <Target className="w-5 h-5 text-warning" />, badge: weakTopicsCount },
    { key: 'analytics', label: 'Stats', icon: <BarChart3 className="w-5 h-5" /> },
    { key: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-sidebar/95 backdrop-blur-lg border-t border-borderSubtle px-2 py-1.5 flex items-center justify-around">
      {items.map(item => {
        const isActive = currentTab === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onSelectTab(item.key)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-all relative ${
              isActive ? 'text-primary' : 'text-textSecondary hover:text-textMain'
            }`}
          >
            <div className="relative">
              {item.icon}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-2 bg-warning text-black text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="mt-1">{item.label}</span>
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-primary mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
