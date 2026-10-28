import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  Target,
  BarChart3,
  Settings,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Flame,
  Zap,
} from 'lucide-react';
import { Badge } from '../common/Badge';

export type NavItemKey =
  | 'overview'
  | 'generate'
  | 'quizzes'
  | 'weak-topics'
  | 'analytics'
  | 'settings';

interface SidebarProps {
  currentTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  weakTopicsCount: number;
  totalQuizzesCount: number;
  streakCount: number;
  isSampleData: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  weakTopicsCount,
  totalQuizzesCount,
  streakCount,
  isSampleData,
}) => {
  const navItems: { key: NavItemKey; label: string; icon: React.ReactNode; badge?: React.ReactNode }[] = [
    {
      key: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      key: 'generate',
      label: 'Generate Quiz',
      icon: <Sparkles className="w-5 h-5 text-cyan" />,
      badge: <Badge variant="cyan" size="sm">AI</Badge>,
    },
    {
      key: 'quizzes',
      label: 'My Quizzes',
      icon: <BookOpen className="w-5 h-5" />,
      badge: totalQuizzesCount > 0 ? (
        <span className="text-xs px-2 py-0.5 rounded-full bg-surface text-textSecondary border border-borderSubtle">
          {totalQuizzesCount}
        </span>
      ) : undefined,
    },
    {
      key: 'weak-topics',
      label: 'Weak Topics',
      icon: <Target className="w-5 h-5 text-warning" />,
      badge: weakTopicsCount > 0 ? (
        <Badge variant="warning" size="sm">{weakTopicsCount}</Badge>
      ) : undefined,
    },
    {
      key: 'analytics',
      label: 'Progress Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-sidebar border-r border-borderSubtle transition-all duration-300 relative select-none shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-18 flex items-center px-5 py-4 border-b border-borderSubtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-cyan flex items-center justify-center text-white shadow-glow-sm shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-base tracking-tight text-textMain flex items-center gap-1.5">
                StudyPilot <span className="text-cyan text-xs font-semibold px-1.5 py-0.5 rounded bg-cyan/15 border border-cyan/30">AI</span>
              </h1>
              <p className="text-[11px] text-textSecondary font-medium truncate">
                Learn smarter. Score higher.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = currentTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelectTab(item.key)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-primary/15 text-white border border-primary/30 shadow-glow-sm'
                  : 'text-textSecondary hover:text-textMain hover:bg-surface/70'
              } ${isCollapsed ? 'justify-center px-0' : 'justify-between'}`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-primary' : 'text-textSecondary'}>
                  {item.icon}
                </span>
                {!isCollapsed && <span>{item.label}</span>}
              </div>
              {!isCollapsed && item.badge && <div>{item.badge}</div>}
            </button>
          );
        })}
      </nav>

      {/* Mini Streak / Demo pill at bottom */}
      {!isCollapsed ? (
        <div className="p-3 mx-3 mb-4 rounded-xl bg-surface/60 border border-borderSubtle">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-textSecondary flex items-center gap-1 font-medium">
              <Flame className="w-3.5 h-3.5 text-warning" /> Study Streak
            </span>
            <span className="font-bold text-textMain">{streakCount} {streakCount === 1 ? 'day' : 'days'}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-borderSubtle/60">
            <span className="text-textSecondary">Mode</span>
            <span className="flex items-center gap-1 text-cyan font-medium">
              <Zap className="w-3 h-3" /> {isSampleData ? 'Demo Dataset' : 'Saved Student'}
            </span>
          </div>
        </div>
      ) : null}

      {/* Collapse Toggle Button */}
      <div className="p-3 border-t border-borderSubtle flex items-center justify-end">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg text-textSecondary hover:text-textMain hover:bg-surface transition-colors w-full flex items-center justify-center gap-2 text-xs"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
