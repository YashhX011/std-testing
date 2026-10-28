import { QuizAttempt } from '../types/quiz';

/**
 * Realistic baseline sample attempts shown on initial demo view.
 * All items are explicitly flagged with `isSample: true` so the UI and analytics
 * engine clearly labels them as sample demo data.
 */
export const SAMPLE_QUIZ_ATTEMPTS: QuizAttempt[] = [
  {
    id: 'sample-attempt-1',
    quizId: 'sample-bio-1',
    quizTitle: 'Cellular Respiration & Bioenergetics',
    subject: 'Biology',
    difficulty: 'Medium',
    totalQuestions: 5,
    completedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    answers: {
      'q1': { questionId: 'q1', selectedOptionIndex: 0, isMarkedForReview: false },
      'q2': { questionId: 'q2', selectedOptionIndex: 1, isMarkedForReview: false },
      'q3': { questionId: 'q3', selectedOptionIndex: 2, isMarkedForReview: false },
      'q4': { questionId: 'q4', selectedOptionIndex: 0, isMarkedForReview: false },
      'q5': { questionId: 'q5', selectedOptionIndex: 3, isMarkedForReview: false },
    },
    score: 4,
    accuracy: 80,
    correctCount: 4,
    incorrectCount: 1,
    unansweredCount: 0,
    isSample: true,
  },
  {
    id: 'sample-attempt-2',
    quizId: 'sample-cs-1',
    quizTitle: 'Operating Systems: Virtual Memory & Concurrency',
    subject: 'Computer Science',
    difficulty: 'Hard',
    totalQuestions: 5,
    completedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    answers: {
      'q1': { questionId: 'q1', selectedOptionIndex: 0, isMarkedForReview: false },
      'q2': { questionId: 'q2', selectedOptionIndex: 2, isMarkedForReview: false }, // incorrect
      'q3': { questionId: 'q3', selectedOptionIndex: 1, isMarkedForReview: false }, // incorrect
      'q4': { questionId: 'q4', selectedOptionIndex: 3, isMarkedForReview: false },
      'q5': { questionId: 'q5', selectedOptionIndex: 2, isMarkedForReview: false }, // incorrect
    },
    score: 2,
    accuracy: 40,
    correctCount: 2,
    incorrectCount: 3,
    unansweredCount: 0,
    isSample: true,
  },
  {
    id: 'sample-attempt-3',
    quizId: 'sample-econ-1',
    quizTitle: 'Central Banking & Open Market Operations',
    subject: 'Economics',
    difficulty: 'Medium',
    totalQuestions: 5,
    completedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    answers: {
      'q1': { questionId: 'q1', selectedOptionIndex: 0, isMarkedForReview: false },
      'q2': { questionId: 'q2', selectedOptionIndex: 1, isMarkedForReview: false },
      'q3': { questionId: 'q3', selectedOptionIndex: 2, isMarkedForReview: false },
      'q4': { questionId: 'q4', selectedOptionIndex: 1, isMarkedForReview: false },
      'q5': { questionId: 'q5', selectedOptionIndex: 0, isMarkedForReview: false },
    },
    score: 5,
    accuracy: 100,
    correctCount: 5,
    incorrectCount: 0,
    unansweredCount: 0,
    isSample: true,
  }
];
