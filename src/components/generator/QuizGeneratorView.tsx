import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Trash2,
  BookOpen,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Layers,
  BarChart,
  Brain,
  Info,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { DifficultyLevel, Quiz } from '../../types/quiz';
import { SAMPLE_NOTES, SampleNoteItem } from '../../constants/sampleNotes';
import { generateQuiz, GenerationResult } from '../../services/quizGenerator';

interface QuizGeneratorViewProps {
  onQuizReady: (quiz: Quiz, resultMeta?: { limitationNotice?: string; mode: string }) => void;
}

export const QuizGeneratorView: React.FC<QuizGeneratorViewProps> = ({ onQuizReady }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [limitationNotice, setLimitationNotice] = useState<string | null>(null);

  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

  const handleSelectSample = (sample: SampleNoteItem) => {
    setTitle(`${sample.subject}: ${sample.title}`);
    setSubject(sample.subject);
    setDifficulty(sample.difficulty);
    setNotes(sample.content);
    setIsSampleModalOpen(false);
    setErrorMessage(null);
  };

  const handleClear = () => {
    setTitle('');
    setSubject('');
    setNotes('');
    setErrorMessage(null);
    setLimitationNotice(null);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLimitationNotice(null);

    // Initial validation
    if (!notes.trim()) {
      setErrorMessage('Please paste your study notes or select a sample note set to begin.');
      return;
    }

    if (notes.trim().length < 60) {
      setErrorMessage(`Your study notes are too short (${notes.trim().length} chars). Please paste at least 60 characters so StudyPilot can extract meaningful concepts.`);
      return;
    }

    setIsLoading(true);
    setLoadingStep('Analyzing text structure and terminology...');

    // Progress step animation for high-quality UX
    setTimeout(() => {
      setLoadingStep('Extracting key assertions, mechanisms, and facts...');
    }, 450);

    setTimeout(() => {
      setLoadingStep('Synthesizing grounded distractor options & explanations...');
    }, 900);

    setTimeout(async () => {
      try {
        const result: GenerationResult = await generateQuiz({
          title: title.trim() || `${subject || 'Study Notes'} Quiz`,
          subject: subject.trim() || 'General Science',
          notes,
          questionCount,
          difficulty,
        });

        setIsLoading(false);

        if (!result.success || !result.quiz) {
          setErrorMessage(result.errorMessage || 'Failed to generate quiz. Please check notes formatting.');
          return;
        }

        if (result.limitationNotice) {
          setLimitationNotice(result.limitationNotice);
        }

        onQuizReady(result.quiz, {
          limitationNotice: result.limitationNotice,
          mode: result.mode,
        });
      } catch (err: any) {
        setIsLoading(false);
        setErrorMessage(err.message || 'An unexpected error occurred while generating questions.');
      }
    }, 1300);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-borderSubtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-textMain tracking-tight">
              Create AI-Grounded Quiz
            </h1>
            <Badge variant="cyan" size="sm">Factual Grounding</Badge>
          </div>
          <p className="text-xs text-textSecondary">
            Paste your raw notes, textbook excerpts, or lecture slides. StudyPilot extracts grounded MCQs with verified source explanations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setIsSampleModalOpen(true)}
            leftIcon={<BookOpen className="w-4 h-4 text-cyan" />}
          >
            Load Sample Notes
          </Button>
          {notes && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              leftIcon={<Trash2 className="w-4 h-4 text-danger" />}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleGenerate} className="space-y-6">
        <Card className="space-y-5">
          {/* Metadata Row: Title & Subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="quiz-title" className="block text-xs font-semibold text-textSecondary uppercase tracking-wider">
                Quiz Title
              </label>
              <input
                id="quiz-title"
                type="text"
                placeholder="e.g. Chapter 4: Cellular Respiration Review"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-borderSubtle text-sm text-textMain placeholder:text-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="quiz-subject" className="block text-xs font-semibold text-textSecondary uppercase tracking-wider">
                Subject / Domain
              </label>
              <input
                id="quiz-subject"
                type="text"
                placeholder="e.g. Biology, Computer Science, Economics"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-borderSubtle text-sm text-textMain placeholder:text-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Notes Input Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="study-notes" className="text-xs font-semibold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan" /> Study Notes / Source Material
              </label>
              <span className="text-[11px] text-textSecondary">
                {notes.length} characters (min 60)
              </span>
            </div>
            <textarea
              id="study-notes"
              rows={10}
              placeholder="Paste your study notes, key terms, processes, definitions, or bullet summaries here... (StudyPilot ensures every question has an exact ground-truth rationale in your notes)"
              value={notes}
              onChange={e => {
                setNotes(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              className="w-full px-4 py-3 rounded-xl bg-surface border border-borderSubtle text-sm text-textMain placeholder:text-textSecondary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-mono leading-relaxed resize-y"
            />
          </div>

          {/* Configuration Selectors: Question Count & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-borderSubtle">
            {/* Question Count (5, 10, 15) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider">
                Number of Questions
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map(count => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all border ${
                      questionCount === count
                        ? 'bg-primary/20 text-white border-primary shadow-glow-sm'
                        : 'bg-surface text-textSecondary border-borderSubtle hover:bg-surface/80 hover:text-textMain'
                    }`}
                  >
                    {count} Questions
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider">
                Target Difficulty
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Easy', 'Medium', 'Hard'] as DifficultyLevel[]).map(diff => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all border ${
                      difficulty === diff
                        ? 'bg-cyan/20 text-white border-cyan shadow-glow-md'
                        : 'bg-surface text-textSecondary border-borderSubtle hover:bg-surface/80 hover:text-textMain'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Error message alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-danger/15 border border-danger/30 text-danger text-sm flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Unable to Generate Quiz</p>
              <p className="text-xs text-danger/90">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Limitation notice banner */}
        {limitationNotice && (
          <div className="p-4 rounded-xl bg-warning/15 border border-warning/30 text-warning text-sm flex items-start gap-3 animate-fade-in">
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Factual Grounding Notice</p>
              <p className="text-xs text-warning/90">{limitationNotice}</p>
            </div>
          </div>
        )}

        {/* Loading Step Card */}
        {isLoading && (
          <Card className="p-6 text-center space-y-4 border-primary/40 bg-surface/80 animate-pulse">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary mx-auto flex items-center justify-center animate-spin">
              <Brain className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-textMain">Synthesizing Grounded Exam Questions...</h3>
              <p className="text-xs text-cyan font-mono">{loadingStep}</p>
            </div>
            <div className="max-w-xs mx-auto h-1.5 bg-card rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-cyan animate-pulse w-3/4 rounded-full" />
            </div>
          </Card>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-textSecondary">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span>100% strictly grounded in notes &bull; Zero hallucinated facts</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              type="submit"
              size="lg"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading}
              leftIcon={<Sparkles className="w-5 h-5" />}
              className="w-full sm:w-auto px-8"
            >
              Generate Quiz
            </Button>
          </div>
        </div>
      </form>

      {/* Sample Notes Selection Modal */}
      <Modal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        title="Load Pre-Configured Study Notes"
        maxWidth="lg"
      >
        <div className="space-y-3">
          <p className="text-xs text-textSecondary">
            Select one of these curated, high-yield academic note sets for immediate demonstration:
          </p>
          <div className="space-y-3">
            {SAMPLE_NOTES.map(sample => (
              <div
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className="p-4 rounded-xl bg-surface/70 hover:bg-surface border border-borderSubtle hover:border-cyan/40 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-textMain group-hover:text-cyan transition-colors">
                    {sample.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="cyan" size="sm">{sample.subject}</Badge>
                    <Badge variant="neutral" size="sm">{sample.difficulty}</Badge>
                  </div>
                </div>
                <p className="text-xs text-textSecondary leading-relaxed">
                  {sample.description}
                </p>
                <span className="text-[11px] text-cyan font-semibold inline-block pt-1">
                  Click to populate editor &rarr;
                </span>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};
