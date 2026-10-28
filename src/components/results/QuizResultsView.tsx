import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Target,
  FileText,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Quiz, QuizAttempt } from '../../types/quiz';

interface QuizResultsViewProps {
  quiz: Quiz;
  attempt: QuizAttempt;
  onRetake: () => void;
  onPracticeWeakTopics: (topicName?: string) => void;
  onGoToDashboard: () => void;
}

export const QuizResultsView: React.FC<QuizResultsViewProps> = ({
  quiz,
  attempt,
  onRetake,
  onPracticeWeakTopics,
  onGoToDashboard,
}) => {
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  const toggleExpand = (qId: string) => {
    setExpandedQuestions(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Tier calculation
  const getTier = (acc: number) => {
    if (acc >= 90) return { title: 'Mastery Tier', color: 'text-cyan', badge: 'success', desc: 'Outstanding retention! You demonstrate complete mastery of these study notes.' };
    if (acc >= 75) return { title: 'Proficient Tier', color: 'text-primary', badge: 'primary', desc: 'Strong conceptual grasp! Review minor gaps to reach top percentiles.' };
    if (acc >= 60) return { title: 'Developing Tier', color: 'text-warning', badge: 'warning', desc: 'Solid foundation, but several key concepts require targeted reinforcement.' };
    return { title: 'Needs Practice', color: 'text-danger', badge: 'danger', desc: 'Syllabus comprehension is below target. Drill your weak topics to lock in core facts.' };
  };

  const tier = getTier(attempt.accuracy);

  // Group performance by topic for this specific quiz
  const topicStats: Record<string, { total: number; correct: number }> = {};
  quiz.questions.forEach(q => {
    const topic = q.topic || quiz.subject;
    if (!topicStats[topic]) topicStats[topic] = { total: 0, correct: 0 };
    topicStats[topic].total += 1;
    const userAns = attempt.answers[q.id];
    if (userAns?.selectedOptionIndex === q.correctOptionIndex) {
      topicStats[topic].correct += 1;
    }
  });

  const topicBreakdown = Object.entries(topicStats).map(([topic, data]) => ({
    topic,
    total: data.total,
    correct: data.correct,
    accuracy: Math.round((data.correct / data.total) * 100),
    isWeak: (data.correct / data.total) < 0.60,
  }));

  const weakTopicsInQuiz = topicBreakdown.filter(t => t.isWeak);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Hero Score Showcase Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-surface to-card border border-borderElevated relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Badge variant="cyan" size="sm" icon={<Award className="w-3 h-3" />}>
                Attempt Results
              </Badge>
              <span className="text-xs text-textSecondary">{quiz.title}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-textMain tracking-tight">
              {attempt.accuracy}% <span className={`text-xl sm:text-2xl font-bold ${tier.color}`}>({tier.title})</span>
            </h1>
            <p className="text-xs sm:text-sm text-textSecondary max-w-md">
              {tier.desc}
            </p>
          </div>

          {/* Quick Circular / Metric Display */}
          <div className="flex items-center gap-4 bg-surface/80 p-4 rounded-xl border border-borderSubtle">
            <div className="text-center px-2">
              <span className="text-2xl font-black text-success">{attempt.correctCount}</span>
              <p className="text-[11px] text-textSecondary font-semibold">Correct</p>
            </div>
            <div className="h-8 w-px bg-borderSubtle" />
            <div className="text-center px-2">
              <span className="text-2xl font-black text-danger">{attempt.incorrectCount}</span>
              <p className="text-[11px] text-textSecondary font-semibold">Incorrect</p>
            </div>
            <div className="h-8 w-px bg-borderSubtle" />
            <div className="text-center px-2">
              <span className="text-2xl font-black text-textSecondary">{attempt.unansweredCount}</span>
              <p className="text-[11px] text-textSecondary font-semibold">Skipped</p>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-borderSubtle relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={onRetake}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Retake Quiz
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onGoToDashboard}
            >
              Return to Dashboard
            </Button>
          </div>

          {weakTopicsInQuiz.length > 0 && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => onPracticeWeakTopics(weakTopicsInQuiz[0].topic)}
              leftIcon={<Target className="w-4 h-4" />}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Practise Weak Topics ({weakTopicsInQuiz.length})
            </Button>
          )}
        </div>

        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Topic Performance Diagnostics */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-borderSubtle pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan/15 text-cyan">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-textMain">Topic Diagnostic Breakdown</h3>
              <p className="text-xs text-textSecondary">Identifies topics falling below the 60% proficiency threshold</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {topicBreakdown.map((t, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-surface/60 border border-borderSubtle flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-textMain">{t.topic}</span>
                  {t.isWeak ? (
                    <Badge variant="warning" size="sm">Under 60%</Badge>
                  ) : (
                    <Badge variant="success" size="sm">Mastered</Badge>
                  )}
                </div>
                <span className="text-[11px] text-textSecondary">
                  {t.correct}/{t.total} questions correct ({t.accuracy}%)
                </span>
              </div>
              {t.isWeak && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPracticeWeakTopics(t.topic)}
                  className="text-xs px-2.5 py-1"
                >
                  Drill Topic
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Detailed Question Review List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-textMain flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> Question-by-Question Review
          </h2>
          <span className="text-xs text-textSecondary">
            Click any question to view grounded explanations and notes evidence
          </span>
        </div>

        <div className="space-y-3">
          {quiz.questions.map((question, index) => {
            const userAnswer = attempt.answers[question.id];
            const isCorrect = userAnswer?.selectedOptionIndex === question.correctOptionIndex;
            const isUnanswered = userAnswer?.selectedOptionIndex === null || userAnswer?.selectedOptionIndex === undefined;
            const isExpanded = expandedQuestions[question.id] ?? true; // default expanded

            return (
              <Card
                key={question.id}
                className={`transition-all duration-200 border ${
                  isCorrect
                    ? 'border-success/30 hover:border-success/50'
                    : isUnanswered
                    ? 'border-borderSubtle hover:border-borderElevated'
                    : 'border-danger/30 hover:border-danger/50'
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() => toggleExpand(question.id)}
                  className="flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5 shrink-0">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      ) : isUnanswered ? (
                        <HelpCircle className="w-5 h-5 text-textSecondary" />
                      ) : (
                        <XCircle className="w-5 h-5 text-danger" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-textSecondary">Question {index + 1}</span>
                        <Badge variant="cyan" size="sm">{question.topic}</Badge>
                        {isCorrect ? (
                          <Badge variant="success" size="sm">Correct (+1)</Badge>
                        ) : isUnanswered ? (
                          <Badge variant="neutral" size="sm">Skipped (0)</Badge>
                        ) : (
                          <Badge variant="danger" size="sm">Incorrect (0)</Badge>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-textMain leading-relaxed">
                        {question.question}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="p-1 rounded text-textSecondary hover:text-textMain"
                    aria-label="Toggle question details"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="pt-4 mt-3 border-t border-borderSubtle/60 space-y-3">
                    {/* Options list */}
                    <div className="space-y-2">
                      {question.options.map((option, optIdx) => {
                        const isChosen = userAnswer?.selectedOptionIndex === optIdx;
                        const isRealCorrect = question.correctOptionIndex === optIdx;

                        let style = 'bg-surface/50 border-borderSubtle text-textSecondary';
                        if (isRealCorrect) {
                          style = 'bg-success/15 border-success/40 text-textMain font-semibold';
                        } else if (isChosen && !isRealCorrect) {
                          style = 'bg-danger/15 border-danger/40 text-textMain font-semibold';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-lg border text-xs flex items-center justify-between ${style}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                              <span>{option}</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-bold text-[11px]">
                              {isChosen && (
                                <span className={isRealCorrect ? 'text-success' : 'text-danger'}>
                                  (Your Answer)
                                </span>
                              )}
                              {isRealCorrect && (
                                <span className="text-success flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Correct Answer
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Grounded Explanation Box */}
                    <div className="p-3.5 rounded-xl bg-surface/80 border border-borderSubtle space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Source-Grounded Explanation</span>
                      </div>
                      <p className="text-xs text-textMain leading-relaxed">
                        {question.explanation}
                      </p>
                      {question.sourceContext && (
                        <div className="pt-1.5 mt-1 border-t border-borderSubtle/60 text-[11px] text-textSecondary italic">
                          &ldquo;{question.sourceContext}&rdquo;
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
