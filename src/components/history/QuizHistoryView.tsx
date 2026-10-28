import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  RotateCcw,
  Eye,
  Trash2,
  Calendar,
  Sparkles,
  Award,
  AlertCircle,
  FileQuestion,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Quiz, QuizAttempt } from '../../types/quiz';

interface QuizHistoryViewProps {
  attempts: QuizAttempt[];
  savedQuizzes: Quiz[];
  onViewResults: (attempt: QuizAttempt) => void;
  onRetakeQuiz: (quizId: string) => void;
  onDeleteQuiz: (quizId: string) => void;
  onNavigateToGenerate: () => void;
}

export const QuizHistoryView: React.FC<QuizHistoryViewProps> = ({
  attempts,
  savedQuizzes,
  onViewResults,
  onRetakeQuiz,
  onDeleteQuiz,
  onNavigateToGenerate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [quizToDelete, setQuizToDelete] = useState<{ id: string; title: string } | null>(null);

  // Subjects list for filter dropdown
  const subjects = useMemo(() => {
    const list = Array.from(new Set(attempts.map(a => a.subject).filter(Boolean)));
    return ['All', ...list];
  }, [attempts]);

  // Filtered attempts
  const filteredAttempts = useMemo(() => {
    return attempts.filter(a => {
      const matchesSearch =
        a.quizTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === 'All' || a.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    });
  }, [attempts, searchQuery, selectedSubject]);

  const confirmDelete = () => {
    if (quizToDelete) {
      onDeleteQuiz(quizToDelete.id);
      setQuizToDelete(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-borderSubtle">
        <div>
          <h1 className="text-xl font-bold text-textMain tracking-tight">
            My Quizzes & Attempt History
          </h1>
          <p className="text-xs text-textSecondary">
            Review past scores, inspect mistaken questions, and retake saved quizzes anytime.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={onNavigateToGenerate}
          leftIcon={<Sparkles className="w-4 h-4" />}
        >
          New Quiz
        </Button>
      </div>

      {/* Search & Subject Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-textSecondary" />
          <input
            type="text"
            placeholder="Search by quiz title, subject, or keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface border border-borderSubtle text-sm text-textMain placeholder:text-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        {/* Subject Filter */}
        <div className="relative">
          <Filter className="w-4 h-4 absolute left-3.5 top-3 text-textSecondary" />
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="w-full pl-10 pr-8 py-2 rounded-xl bg-surface border border-borderSubtle text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
          >
            {subjects.map(s => (
              <option key={s} value={s} className="bg-card text-textMain">
                {s === 'All' ? 'All Subjects' : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quiz List */}
      {filteredAttempts.length > 0 ? (
        <div className="grid grid-cols-1 gap-3.5">
          {filteredAttempts.map(attempt => (
            <Card
              key={attempt.id}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-borderElevated transition-all"
            >
              {/* Left Column: Title & Metadata */}
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-textMain">{attempt.quizTitle}</h3>
                  <Badge variant="cyan" size="sm">{attempt.subject}</Badge>
                  <Badge variant="neutral" size="sm">{attempt.difficulty}</Badge>
                  {attempt.isSample && (
                    <Badge variant="cyan" size="sm">Demo Data</Badge>
                  )}
                  {attempt.isPracticeMode && (
                    <Badge variant="warning" size="sm">Practice Drill</Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-textSecondary">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(attempt.completedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <FileQuestion className="w-3.5 h-3.5" />
                    {attempt.totalQuestions} Questions
                  </span>
                </div>
              </div>

              {/* Middle Column: Score & Accuracy */}
              <div className="flex items-center gap-4 md:px-6 md:border-x md:border-borderSubtle">
                <div className="text-left md:text-center">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-textMain">{attempt.score}</span>
                    <span className="text-xs text-textSecondary">/{attempt.totalQuestions}</span>
                  </div>
                  <p className="text-[11px] text-textSecondary">Correct</p>
                </div>

                <div className="text-left md:text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-lg text-sm font-bold ${
                      attempt.accuracy >= 75
                        ? 'bg-success/15 text-success'
                        : attempt.accuracy >= 60
                        ? 'bg-warning/15 text-warning'
                        : 'bg-danger/15 text-danger'
                    }`}
                  >
                    {attempt.accuracy}%
                  </span>
                  <p className="text-[11px] text-textSecondary mt-0.5">Accuracy</p>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onViewResults(attempt)}
                  leftIcon={<Eye className="w-4 h-4 text-cyan" />}
                >
                  View Review
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRetakeQuiz(attempt.quizId)}
                  leftIcon={<RotateCcw className="w-4 h-4 text-primary" />}
                >
                  Retake
                </Button>
                <button
                  type="button"
                  onClick={() => setQuizToDelete({ id: attempt.quizId, title: attempt.quizTitle })}
                  className="p-2 rounded-lg text-textSecondary hover:text-danger hover:bg-danger/10 transition-colors"
                  title="Delete quiz attempt"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-textSecondary opacity-40 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-textMain">No Quizzes Found</h3>
            <p className="text-xs text-textSecondary max-w-sm mx-auto">
              {searchQuery || selectedSubject !== 'All'
                ? 'No past attempts match your search criteria. Clear filters to see your complete history.'
                : 'You have not completed any quizzes yet. Generate your first quiz to begin tracking results!'}
            </p>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={onNavigateToGenerate}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Create Your First Quiz
          </Button>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(quizToDelete)}
        onClose={() => setQuizToDelete(null)}
        title="Delete Quiz and Attempt Records?"
        footer={
          <>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setQuizToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={confirmDelete}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Delete Permanently
            </Button>
          </>
        }
      >
        <div className="space-y-2 text-xs text-textSecondary">
          <p>
            Are you sure you want to remove <span className="font-bold text-textMain">"{quizToDelete?.title}"</span>?
          </p>
          <p>
            This action will remove the saved questions and corresponding performance logs from local storage.
          </p>
        </div>
      </Modal>
    </div>
  );
};
