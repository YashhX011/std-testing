export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[]; // exactly 4 options
  correctOptionIndex: number; // 0, 1, 2, or 3
  explanation: string;
  topic: string;
  sourceContext?: string; // quote or grounded snippet from the notes
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  notesSummary?: string;
  difficulty: DifficultyLevel;
  questions: QuizQuestion[];
  createdAt: string; // ISO string
  isSample?: boolean;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionIndex: number | null; // null if skipped/unanswered
  isMarkedForReview: boolean;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  subject: string;
  difficulty: DifficultyLevel;
  totalQuestions: number;
  completedAt: string; // ISO string
  answers: Record<string, UserAnswer>;
  score: number; // count of correct answers
  accuracy: number; // percentage (0 - 100)
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  isPracticeMode?: boolean;
  isSample?: boolean;
}

export interface TopicPerformance {
  topic: string;
  subject?: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number; // percentage (0 - 100)
  status: 'Weak' | 'Strong' | 'Average' | 'Not enough data';
  needsPractice: boolean;
}

export interface UserProfile {
  name: string;
  gradeOrTarget: string;
  streakCount: number;
  lastActiveDate?: string;
}
