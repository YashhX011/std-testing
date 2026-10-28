import React from 'react';
import { Sparkles, Flame, User, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';
import { NavItemKey } from './Sidebar';

interface HeaderProps {
  currentTab: NavItemKey;
  onNavigateToGenerate: () => void;
  studentName: string;
  streakCount: number;
  isSampleData: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigateToGenerate,
  studentName,
  streakCount,
  isSampleData,
}) => {
  const titles: Record<NavItemKey, { title: string; subtitle: string }> = {
    overview: {
      title: 'Overview Dashboard',
      subtitle: 'Track your quiz performance, topic mastery, and study momentum',
    },
    generate: {
      title: 'Notes-to-Quiz Generator',
      subtitle: 'Transform raw study notes into grounded, syllabus-aligned MCQs',
    },
    quizzes: {
      title: 'My Quizzes & History',
      subtitle: 'Review past attempts, re-evaluate mistakes, and retake quizzes',
    },
    'weak-topics': {
      title: 'Weak Topics & Targeted Practice',
      subtitle: 'Focus on concepts under 60% mastery with instant-feedback drills',
    },
    analytics: {
      title: 'Progress & Performance Analytics',
      subtitle: 'Detailed accuracy trends, subject breakdowns, and learning growth',
    },
    settings: {
      title: 'Settings & Data Management',
      subtitle: 'Manage local data persistence, test profile, and system thresholds',
    },
  };

  const { title, subtitle } = titles[currentTab] || {
    title: 'StudyPilot AI',
    subtitle: 'Learn smarter. Score higher.',
  };

  return (
    <header className="h-18 bg-sidebar/80 backdrop-blur-md border-b border-borderSubtle px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      {/* Page Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-lg font-bold text-textMain tracking-tight">{title}</h2>
          {isSampleData ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan/10 text-cyan border border-cyan/25">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
              Demo Data Mode
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-success/10 text-success border border-success/25">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              Active Student Data
            </span>
          )}
        </div>
        <p className="text-xs text-textSecondary hidden sm:block">{subtitle}</p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Streak indicator */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-borderSubtle text-xs font-semibold text-warning"
          title="Daily study streak calculated honestly from real quiz activity"
        >
          <Flame className="w-4 h-4 fill-warning/20 text-warning" />
          <span>{streakCount} {streakCount === 1 ? 'Day' : 'Days'}</span>
        </div>

        {/* Generate CTA shortcut */}
        {currentTab !== 'generate' && (
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Sparkles className="w-4 h-4" />}
            onClick={onNavigateToGenerate}
            className="hidden lg:inline-flex"
          >
            Generate Quiz
          </Button>
        )}

        {/* User Profile Pill (No Login Required) */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-borderSubtle">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary/30 to-cyan/30 border border-primary/40 flex items-center justify-center text-primary">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-textMain flex items-center gap-1">
              {studentName}
              <ShieldCheck className="w-3 h-3 text-cyan" />
            </div>
            <div className="text-[10px] text-textSecondary">Honors Student</div>
          </div>
        </div>
      </div>
    </header>
  );
};
