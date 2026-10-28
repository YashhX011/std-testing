import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Send,
  AlertCircle,
  HelpCircle,
  Clock,
  BookOpen,
  CheckCircle2,
  XCircle,
  LayoutGrid,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { ProgressBar } from '../common/ProgressBar';
import { Quiz, QuizAttempt, UserAnswer } from '../../types/quiz';
import { buildQuizAttempt } from '../../services/analytics';
import { storageService } from '../../services/storage';

interface QuizSessionViewProps {
  quiz: Quiz;
  onQuizSubmitted: (attempt: QuizAttempt) => void;
  onExitQuiz: () => void;
}

export const QuizSessionView: React.FC<QuizSessionViewProps> = ({
  quiz,
  onQuizSubmitted,
  onExitQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const currentQuestion = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;

  // Answer handler - permits changing answer freely before submission
  const handleSelectOption = (optionIndex: number) => {
    if (hasSubmitted) return;
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        selectedOptionIndex: optionIndex,
        isMarkedForReview: prev[currentQuestion.id]?.isMarkedForReview || false,
      },
    }));
  };

  // Toggle mark-for-review
  const handleToggleReview = () => {
    setAnswers(prev => {
      const existing = prev[currentQuestion.id] || {
        questionId: currentQuestion.id,
        selectedOptionIndex: null,
        isMarkedForReview: false,
      };
      return {
        ...prev,
        [currentQuestion.id]: {
          ...existing,
          isMarkedForReview: !existing.isMarkedForReview,
        },
      };
    });
  };

  // Calculation for review dialog
  const answeredCount = Object.values(answers).filter(
    a => a.selectedOptionIndex !== null && a.selectedOptionIndex !== undefined
  ).length;
  const unansweredCount = totalQuestions - answeredCount;
  const flaggedCount = Object.values(answers).filter(a => a.isMarkedForReview).length;

  const currentAnswer = answers[currentQuestion.id];
  const selectedOptionIndex = currentAnswer?.selectedOptionIndex ?? null;
  const isMarked = currentAnswer?.isMarkedForReview ?? false;

  const progressPercentage = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  // Final submission
  const handleConfirmSubmit = () => {
    if (hasSubmitted) return; // prevent duplicate submission
    setHasSubmitted(true);
    setIsSubmitModalOpen(false);

    // Build finalized attempt record
    const attempt = buildQuizAttempt(quiz, answers);
    // Persist to storage
    storageService.saveAttempt(attempt);
    // Also save quiz for retaking
    storageService.saveQuiz(quiz);

    onQuizSubmitted(attempt);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Session Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-borderSubtle">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={onExitQuiz}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Exit Quiz
          </Button>
          <div className="h-4 w-px bg-borderSubtle hidden sm:block" />
          <div className="hidden sm:block">
            <h3 className="text-sm font-semibold text-textMain truncate max-w-xs">{quiz.title}</h3>
            <span className="text-[11px] text-textSecondary">{quiz.subject} &bull; {quiz.difficulty}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Flag for review button */}
          <button
            type="button"
            onClick={handleToggleReview}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isMarked
                ? 'bg-warning/20 border-warning text-warning shadow-glow-sm'
                : 'bg-surface border-borderSubtle text-textSecondary hover:text-textMain'
            }`}
            title="Mark this question to review before final submission"
          >
            <Flag className={`w-3.5 h-3.5 ${isMarked ? 'fill-warning' : ''}`} />
            <span>{isMarked ? 'Marked' : 'Mark for Review'}</span>
          </button>

          {/* Quick Submit CTA */}
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsSubmitModalOpen(true)}
            rightIcon={<Send className="w-3.5 h-3.5" />}
          >
            Finish Quiz
          </Button>
        </div>
      </div>

      {/* Progress & Question Counter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-textSecondary font-semibold">
          <span className="flex items-center gap-1.5">
            <span className="text-primary font-bold">Question {currentIndex + 1}</span> of {totalQuestions}
          </span>
          <span>{answeredCount} answered &bull; {unansweredCount} remaining</span>
        </div>
        <ProgressBar progress={progressPercentage} color="primary" size="md" />
      </div>

      {/* Question Card */}
      <Card className="space-y-6 p-6 sm:p-8 border-borderElevated">
        {/* Topic Tag & Review Badge */}
        <div className="flex items-center justify-between">
          <Badge variant="cyan" size="sm">
            Topic: {currentQuestion.topic || quiz.subject}
          </Badge>
          {isMarked && (
            <Badge variant="warning" size="sm" icon={<Flag className="w-3 h-3 fill-warning" />}>
              Marked for review
            </Badge>
          )}
        </div>

        {/* Question Prompt */}
        <div className="space-y-2">
          <h2 className="text-lg sm:text-xl font-bold text-textMain leading-relaxed">
            {currentQuestion.question}
          </h2>
        </div>

        {/* 4 Selectable Options */}
        <div className="space-y-3 pt-2">
          {currentQuestion.options.map((optionText, optIndex) => {
            const isSelected = selectedOptionIndex === optIndex;
            const optionLetter = String.fromCharCode(65 + optIndex); // A, B, C, D

            return (
              <div
                key={optIndex}
                onClick={() => handleSelectOption(optIndex)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 group select-none ${
                  isSelected
                    ? 'bg-primary/15 border-primary shadow-glow-sm text-textMain'
                    : 'bg-surface/70 hover:bg-surface border-borderSubtle hover:border-borderElevated text-textSecondary hover:text-textMain'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border transition-all ${
                    isSelected
                      ? 'bg-primary text-white border-primary shadow-glow-sm'
                      : 'bg-card text-textSecondary border-borderSubtle group-hover:border-slate-500'
                  }`}
                >
                  {optionLetter}
                </div>
                <div className="pt-0.5 text-sm sm:text-base leading-snug flex-1 font-medium">
                  {optionText}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Navigation Buttons Row */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="secondary"
          size="md"
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          leftIcon={<ChevronLeft className="w-4 h-4" />}
        >
          Previous
        </Button>

        {/* Question Jump Palette (Pill list) */}
        <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto py-1 px-2">
          {quiz.questions.map((q, idx) => {
            const isAns = answers[q.id]?.selectedOptionIndex !== null && answers[q.id]?.selectedOptionIndex !== undefined;
            const isFlag = answers[q.id]?.isMarkedForReview;
            const isCur = idx === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all relative flex items-center justify-center ${
                  isCur
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary text-white'
                    : isAns
                    ? 'bg-surface border border-primary/50 text-cyan'
                    : 'bg-surface/50 border border-borderSubtle text-textSecondary hover:bg-surface'
                }`}
                title={`Question ${idx + 1}`}
              >
                {idx + 1}
                {isFlag && (
                  <span className="w-1.5 h-1.5 rounded-full bg-warning absolute -top-0.5 -right-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {currentIndex < totalQuestions - 1 ? (
          <Button
            variant="primary"
            size="md"
            onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsSubmitModalOpen(true)}
            rightIcon={<Send className="w-4 h-4" />}
          >
            Submit Quiz
          </Button>
        )}
      </div>

      {/* Submit Confirmation Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Ready to Submit Quiz?"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsSubmitModalOpen(false)}
            >
              Continue Answering
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmSubmit}
              rightIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Confirm Submission
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-textSecondary">
            Review your completion status before finalizing your attempt:
          </p>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-surface border border-borderSubtle">
              <span className="text-xl font-bold text-textMain">{answeredCount}</span>
              <p className="text-[11px] text-textSecondary">Answered</p>
            </div>
            <div className={`p-3 rounded-xl border ${unansweredCount > 0 ? 'bg-danger/10 border-danger/30 text-danger' : 'bg-surface border-borderSubtle text-textSecondary'}`}>
              <span className="text-xl font-bold">{unansweredCount}</span>
              <p className="text-[11px]">Unanswered</p>
            </div>
            <div className="p-3 rounded-xl bg-surface border border-borderSubtle">
              <span className="text-xl font-bold text-warning">{flaggedCount}</span>
              <p className="text-[11px] text-textSecondary">Marked</p>
            </div>
          </div>

          {unansweredCount > 0 && (
            <div className="p-3 rounded-xl bg-danger/10 border border-danger/30 text-xs text-danger flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>You have {unansweredCount} unanswered questions. Unanswered questions will receive 0 points.</span>
            </div>
          )}

          {flaggedCount > 0 && (
            <div className="p-3 rounded-xl bg-warning/10 border border-warning/30 text-xs text-warning flex items-center gap-2">
              <Flag className="w-4 h-4 shrink-0 fill-warning" />
              <span>You still have {flaggedCount} questions marked for review.</span>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
