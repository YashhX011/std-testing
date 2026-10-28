import React, { useState } from 'react';
import {
  Target,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  ChevronRight,
  Flame,
  HelpCircle,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { Quiz, QuizQuestion, TopicPerformance } from '../../types/quiz';
import { storageService } from '../../services/storage';

interface SmartPracticeViewProps {
  weakTopics: TopicPerformance[];
  savedQuizzes: Quiz[];
  initialTopic?: string;
  onNavigateToGenerate: () => void;
  onExitPractice: () => void;
}

export const SmartPracticeView: React.FC<SmartPracticeViewProps> = ({
  weakTopics,
  savedQuizzes,
  initialTopic,
  onNavigateToGenerate,
  onExitPractice,
}) => {
  // Extract all questions from saved quizzes
  const allAvailableQuestions: QuizQuestion[] = [];
  savedQuizzes.forEach(quiz => {
    quiz.questions.forEach(q => {
      // Prevent duplicates by ID
      if (!allAvailableQuestions.some(existing => existing.id === q.id)) {
        allAvailableQuestions.push(q);
      }
    });
  });

  const availableTopics = Array.from(new Set(allAvailableQuestions.map(q => q.topic))).filter(Boolean);

  const [selectedTopic, setSelectedTopic] = useState<string>(
    initialTopic || (weakTopics.find(t => t.needsPractice)?.topic ?? (availableTopics[0] || 'All Topics'))
  );

  const [isSessionActive, setIsSessionActive] = useState<boolean>(Boolean(initialTopic));
  const [practiceQuestions, setPracticeQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasRevealedAnswer, setHasRevealedAnswer] = useState<boolean>(false);
  const [sessionResults, setSessionResults] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Starts targeted practice session
  const startPractice = (targetTopic: string) => {
    let pool: QuizQuestion[] = [];
    if (targetTopic === 'All Weak Topics') {
      const weakNames = weakTopics.filter(t => t.needsPractice).map(t => t.topic);
      pool = allAvailableQuestions.filter(q => weakNames.includes(q.topic));
    } else {
      pool = allAvailableQuestions.filter(q => q.topic === targetTopic);
    }

    if (pool.length === 0) {
      pool = allAvailableQuestions.slice(0, 5);
    }

    // Shuffle practice pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
    setPracticeQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasRevealedAnswer(false);
    setSessionResults({ correct: 0, total: 0 });
    setIsCompleted(false);
    setIsSessionActive(true);
  };

  const handleSelectOptionInPractice = (optionIdx: number) => {
    if (hasRevealedAnswer) return; // already revealed
    setSelectedOption(optionIdx);
    setHasRevealedAnswer(true);

    const isCorrect = optionIdx === currentQuestion.correctOptionIndex;
    setSessionResults(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const handleNextQuestion = () => {
    if (currentIndex < practiceQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setHasRevealedAnswer(false);
    } else {
      setIsCompleted(true);
    }
  };

  const currentQuestion = practiceQuestions[currentIndex];

  // If session is completed, show summary screen
  if (isCompleted) {
    const accuracy = sessionResults.total > 0 ? Math.round((sessionResults.correct / sessionResults.total) * 100) : 0;
    return (
      <div className="max-w-xl mx-auto space-y-6 text-center py-12 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary mx-auto flex items-center justify-center">
          <Award className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <Badge variant="cyan" size="md">Practice Session Completed</Badge>
          <h2 className="text-2xl font-bold text-textMain">Great Effort Reinforcing Concepts!</h2>
          <p className="text-sm text-textSecondary">
            You solved {sessionResults.correct} out of {sessionResults.total} practice questions ({accuracy}% accuracy).
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex justify-around items-center">
            <div>
              <span className="text-3xl font-extrabold text-success">{sessionResults.correct}</span>
              <p className="text-xs text-textSecondary font-semibold">Mastered</p>
            </div>
            <div className="h-8 w-px bg-borderSubtle" />
            <div>
              <span className="text-3xl font-extrabold text-danger">
                {sessionResults.total - sessionResults.correct}
              </span>
              <p className="text-xs text-textSecondary font-semibold">Need Review</p>
            </div>
            <div className="h-8 w-px bg-borderSubtle" />
            <div>
              <span className="text-3xl font-extrabold text-cyan">{accuracy}%</span>
              <p className="text-xs text-textSecondary font-semibold">Accuracy</p>
            </div>
          </div>
        </Card>

        <div className="flex justify-center gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setIsSessionActive(false)}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Practice Another Topic
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onExitPractice}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Active instant-feedback practice question view
  if (isSessionActive && currentQuestion) {
    const isCorrect = selectedOption === currentQuestion.correctOptionIndex;
    const progress = Math.round(((currentIndex + 1) / practiceQuestions.length) * 100);

    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-12">
        <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-borderSubtle">
          <div>
            <span className="text-xs font-bold text-cyan uppercase tracking-wider">Smart Practice Mode</span>
            <p className="text-sm font-semibold text-textMain">{currentQuestion.topic}</p>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setIsSessionActive(false)}>
            Quit Session
          </Button>
        </div>

        <ProgressBar progress={progress} color="cyan" size="sm" />

        <Card className="space-y-6 p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-textSecondary">
              Question {currentIndex + 1} of {practiceQuestions.length}
            </span>
            <Badge variant="cyan" size="sm">Instant Feedback</Badge>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-textMain leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Options with immediate reveal after selection */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isAnswerKey = idx === currentQuestion.correctOptionIndex;

              let style = 'bg-surface/70 hover:bg-surface border-borderSubtle text-textSecondary hover:text-textMain';

              if (hasRevealedAnswer) {
                if (isAnswerKey) {
                  style = 'bg-success/20 border-success text-textMain shadow-glow-sm';
                } else if (isSelected && !isAnswerKey) {
                  style = 'bg-danger/20 border-danger text-textMain';
                } else {
                  style = 'bg-surface/40 border-borderSubtle/50 text-textSecondary opacity-60';
                }
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOptionInPractice(idx)}
                  className={`p-4 rounded-xl border text-sm font-medium flex items-center justify-between transition-all ${style} ${
                    !hasRevealedAnswer ? 'cursor-pointer hover:border-cyan/40' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-card border border-borderSubtle text-xs font-bold flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {hasRevealedAnswer && isAnswerKey && (
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                  )}
                  {hasRevealedAnswer && isSelected && !isAnswerKey && (
                    <XCircle className="w-5 h-5 text-danger shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Instant explanation reveals immediately after choice */}
          {hasRevealedAnswer && (
            <div className={`p-4 rounded-xl border space-y-2 animate-fade-in ${
              isCorrect ? 'bg-success/10 border-success/30' : 'bg-warning/10 border-warning/30'
            }`}>
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-success" />
                ) : (
                  <XCircle className="w-4 h-4 text-warning" />
                )}
                <span className={`text-xs font-bold ${isCorrect ? 'text-success' : 'text-warning'}`}>
                  {isCorrect ? 'Correct! Concept verified.' : 'Incorrect. Study the notes explanation:'}
                </span>
              </div>
              <p className="text-xs text-textMain leading-relaxed">
                {currentQuestion.explanation}
              </p>
              {currentQuestion.sourceContext && (
                <div className="text-[11px] text-textSecondary italic pt-1 border-t border-borderSubtle">
                  Context: &ldquo;{currentQuestion.sourceContext}&rdquo;
                </div>
              )}
            </div>
          )}

          {/* Next Button */}
          {hasRevealedAnswer && (
            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={handleNextQuestion}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                {currentIndex < practiceQuestions.length - 1 ? 'Next Question' : 'View Summary'}
              </Button>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // Topic Selection Screen
  const weakList = weakTopics.filter(t => t.needsPractice);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-card border border-borderSubtle space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="warning" size="sm" icon={<Target className="w-3.5 h-3.5" />}>
            Diagnostic Smart Drill
          </Badge>
          <span className="text-xs text-textSecondary">Syllabus Weak Topic Prioritization</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-textMain tracking-tight">
          Targeted Practice Lab
        </h1>
        <p className="text-xs sm:text-sm text-textSecondary max-w-2xl">
          Unlike standard tests, Smart Practice Mode reveals grounded explanations immediately after every answer, locking in key facts before test day.
        </p>
      </div>

      {/* Weak Topics Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-textMain flex items-center gap-2">
          <Target className="w-4 h-4 text-warning" /> Diagnosed Weak Topics (&lt;60% Accuracy)
        </h2>

        {weakList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {weakList.map((t, idx) => (
              <Card
                key={idx}
                hoverable
                onClick={() => startPractice(t.topic)}
                className="border-warning/30 hover:border-warning p-5 space-y-3 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-textMain group-hover:text-warning transition-colors">
                    {t.topic}
                  </span>
                  <Badge variant="warning" size="sm">{t.accuracy}% Accuracy</Badge>
                </div>
                <p className="text-xs text-textSecondary">
                  {t.correctAnswers} correct out of {t.totalQuestions} questions attempted.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-borderSubtle text-xs text-warning font-semibold">
                  <span>Start Instant-Feedback Drill</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-success mx-auto opacity-70" />
            <h3 className="text-base font-semibold text-textMain">No Weak Topics Diagnosed</h3>
            <p className="text-xs text-textSecondary max-w-md mx-auto">
              You either haven't attempted enough questions or your scores are comfortably above 60%. Generate a new quiz to continue challenging your knowledge!
            </p>
            <Button
              size="sm"
              variant="primary"
              onClick={onNavigateToGenerate}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Generate New Quiz
            </Button>
          </Card>
        )}
      </div>

      {/* Or Select Any Topic */}
      {availableTopics.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-borderSubtle">
          <h2 className="text-sm font-semibold text-textMain flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan" /> Practice Any Available Subject Topic
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {availableTopics.map((topic, i) => (
              <div
                key={i}
                onClick={() => startPractice(topic)}
                className="p-3.5 rounded-xl bg-surface/60 hover:bg-surface border border-borderSubtle hover:border-cyan/40 cursor-pointer transition-all flex items-center justify-between group"
              >
                <span className="text-xs font-semibold text-textMain truncate group-hover:text-cyan">
                  {topic}
                </span>
                <ChevronRight className="w-4 h-4 text-textSecondary group-hover:text-cyan group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
