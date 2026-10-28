import React, { useState } from 'react';
import {
  User,
  Shield,
  Trash2,
  RotateCcw,
  Palette,
  CheckCircle2,
  Sliders,
  Sparkles,
  Info,
  Lock,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { UserProfile } from '../../types/quiz';
import { storageService } from '../../services/storage';
import {
  WEAK_TOPIC_ACCURACY_THRESHOLD,
  WEAK_TOPIC_MIN_ATTEMPTS,
  STRONG_TOPIC_ACCURACY_THRESHOLD,
} from '../../constants/rules';

interface SettingsViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onHistoryCleared: () => void;
  onDemoReset: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userProfile,
  onUpdateProfile,
  onHistoryCleared,
  onDemoReset,
}) => {
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [targetInput, setTargetInput] = useState(userProfile.gradeOrTarget);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name: nameInput, gradeOrTarget: targetInput });
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleConfirmClear = () => {
    storageService.clearHistory();
    setIsClearModalOpen(false);
    onHistoryCleared();
  };

  const handleConfirmReset = () => {
    storageService.resetToDemo();
    setIsResetModalOpen(false);
    onDemoReset();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-card border border-borderSubtle space-y-1">
        <h1 className="text-xl font-bold text-textMain tracking-tight">
          Settings & Local Data Configuration
        </h1>
        <p className="text-xs text-textSecondary">
          Manage your demonstration profile, examine diagnostic threshold parameters, and control browser-stored learning telemetry.
        </p>
      </div>

      {/* Profile Settings */}
      <form onSubmit={handleSaveProfile}>
        <Card className="space-y-5">
          <div className="flex items-center justify-between border-b border-borderSubtle pb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-textMain">Demo Student Profile</h2>
            </div>
            {isSavedNotice && (
              <span className="text-xs text-success flex items-center gap-1 font-semibold animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved successfully
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="student-name" className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
                Display Name
              </label>
              <input
                id="student-name"
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-borderSubtle text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="student-target" className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
                Exam / Course Target
              </label>
              <input
                id="student-target"
                type="text"
                value={targetInput}
                onChange={e => setTargetInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-borderSubtle text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm" variant="primary">
              Update Student Info
            </Button>
          </div>
        </Card>
      </form>

      {/* System Diagnostic Rules */}
      <Card className="space-y-4">
        <div className="flex items-center gap-2 border-b border-borderSubtle pb-3">
          <Sliders className="w-4 h-4 text-cyan" />
          <div>
            <h2 className="text-sm font-semibold text-textMain">Diagnostic Engine Thresholds</h2>
            <p className="text-xs text-textSecondary">Configured in rules.ts for consistent analytics evaluation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-surface/60 border border-borderSubtle space-y-1">
            <span className="text-textSecondary font-medium">Weak Topic Threshold</span>
            <p className="text-base font-extrabold text-warning">
              &lt; {Math.round(WEAK_TOPIC_ACCURACY_THRESHOLD * 100)}% Accuracy
            </p>
            <p className="text-[11px] text-textSecondary">Topics below this trigger smart practice recommendations</p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface/60 border border-borderSubtle space-y-1">
            <span className="text-textSecondary font-medium">Minimum Evidence Count</span>
            <p className="text-base font-extrabold text-cyan">
              &ge; {WEAK_TOPIC_MIN_ATTEMPTS} Questions
            </p>
            <p className="text-[11px] text-textSecondary">Requires at least 3 attempts before diagnosing "Weak" status</p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface/60 border border-borderSubtle space-y-1">
            <span className="text-textSecondary font-medium">Strong Topic Threshold</span>
            <p className="text-base font-extrabold text-success">
              &ge; {Math.round(STRONG_TOPIC_ACCURACY_THRESHOLD * 100)}% Accuracy
            </p>
            <p className="text-[11px] text-textSecondary">Marks concept as mastered with high test readiness</p>
          </div>
        </div>
      </Card>

      {/* Theme Specifications */}
      <Card className="space-y-4">
        <div className="flex items-center gap-2 border-b border-borderSubtle pb-3">
          <Palette className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-textMain">Visual Design & Theme Tokens</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-background border border-borderSubtle flex items-center gap-2.5">
            <div className="w-4 h-4 rounded bg-[#0B0F19] border border-white/20" />
            <div>
              <p className="font-mono font-bold text-textMain">#0B0F19</p>
              <span className="text-[10px] text-textSecondary">Background</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-surface border border-borderSubtle flex items-center gap-2.5">
            <div className="w-4 h-4 rounded bg-[#121A2A] border border-white/20" />
            <div>
              <p className="font-mono font-bold text-textMain">#121A2A</p>
              <span className="text-[10px] text-textSecondary">Cards</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-surface border border-borderSubtle flex items-center gap-2.5">
            <div className="w-4 h-4 rounded bg-[#3B82F6]" />
            <div>
              <p className="font-mono font-bold text-textMain">#3B82F6</p>
              <span className="text-[10px] text-textSecondary">Primary Blue</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-surface border border-borderSubtle flex items-center gap-2.5">
            <div className="w-4 h-4 rounded bg-[#22D3EE]" />
            <div>
              <p className="font-mono font-bold text-textMain">#22D3EE</p>
              <span className="text-[10px] text-textSecondary">Cyan Accent</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Privacy Notice */}
      <Card className="p-5 border-cyan/20 bg-cyan/5 space-y-2">
        <div className="flex items-center gap-2 text-cyan font-semibold text-xs">
          <Shield className="w-4 h-4" />
          <span>Local Browser Privacy Guarantee</span>
        </div>
        <p className="text-xs text-textSecondary leading-relaxed">
          In local demonstration mode, all pasted notes, generated questions, and quiz performance metrics are persisted exclusively inside your browser's <code className="text-cyan font-mono">localStorage</code>. No proprietary study notes or student responses are transmitted to any remote database.
        </p>
      </Card>

      {/* Data Management Actions */}
      <Card className="space-y-4">
        <div className="border-b border-borderSubtle pb-3">
          <h2 className="text-sm font-semibold text-textMain">Storage & Data Management</h2>
          <p className="text-xs text-textSecondary">Clear your history or reset the demo dataset for presentation</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-textMain">Reset Initial Demo Dataset</p>
            <p className="text-[11px] text-textSecondary">
              Reloads the default Biology, CS, and Economics sample tests.
            </p>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsResetModalOpen(true)}
            leftIcon={<RotateCcw className="w-4 h-4 text-cyan" />}
          >
            Reset Demo Data
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-borderSubtle">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-danger">Clear All History & Saved Quizzes</p>
            <p className="text-[11px] text-textSecondary">
              Permanently purges all quiz attempts, streak count, and generated tests from this browser.
            </p>
          </div>
          <Button
            size="sm"
            variant="danger"
            onClick={() => setIsClearModalOpen(true)}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Clear History
          </Button>
        </div>
      </Card>

      {/* Clear History Confirmation Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Clear All Learning History?"
        footer={
          <>
            <Button size="sm" variant="secondary" onClick={() => setIsClearModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="danger" onClick={handleConfirmClear} leftIcon={<Trash2 className="w-4 h-4" />}>
              Confirm Clear
            </Button>
          </>
        }
      >
        <p className="text-xs text-textSecondary">
          Are you sure you want to clear your learning history? This will delete all completed quiz attempts, reset your study streak to zero, and clear saved quizzes from your browser storage.
        </p>
      </Modal>

      {/* Reset Demo Data Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset to Initial Demo Dataset?"
        footer={
          <>
            <Button size="sm" variant="secondary" onClick={() => setIsResetModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" onClick={handleConfirmReset} leftIcon={<RotateCcw className="w-4 h-4" />}>
              Confirm Reset
            </Button>
          </>
        }
      >
        <p className="text-xs text-textSecondary">
          This will restore the sample demonstration dataset with pre-evaluated tests in Biology, Operating Systems, and Monetary Policy so you can demo dashboard charts and weak topic detection.
        </p>
      </Modal>
    </div>
  );
};
