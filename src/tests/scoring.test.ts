import { describe, it, expect } from 'vitest';
import { calculateQuizScore } from '../services/analytics';
import { QuizQuestion, UserAnswer } from '../types/quiz';

const mockQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctOptionIndex: 1,
    topic: 'Math',
    explanation: '2 + 2 equals 4',
  },
  {
    id: 'q2',
    question: 'What is the chemical symbol for water?',
    options: ['CO2', 'NaCl', 'H2O', 'O2'],
    correctOptionIndex: 2,
    topic: 'Chemistry',
    explanation: 'Water is H2O',
  },
  {
    id: 'q3',
    question: 'What planet is closest to the Sun?',
    options: ['Mercury', 'Venus', 'Earth', 'Mars'],
    correctOptionIndex: 0,
    topic: 'Astronomy',
    explanation: 'Mercury is closest',
  },
  {
    id: 'q4',
    question: 'What is the speed of light?',
    options: ['300,000 km/s', '150,000 km/s', '1,000 km/s', 'Infinite'],
    correctOptionIndex: 0,
    topic: 'Physics',
    explanation: 'Speed of light is approx 300,000 km/s',
  },
];

describe('Quiz Scoring and Accuracy Logic', () => {
  it('correctly scores all correct answers and calculates 100% accuracy', () => {
    const answers: Record<string, UserAnswer> = {
      q1: { questionId: 'q1', selectedOptionIndex: 1, isMarkedForReview: false },
      q2: { questionId: 'q2', selectedOptionIndex: 2, isMarkedForReview: false },
      q3: { questionId: 'q3', selectedOptionIndex: 0, isMarkedForReview: false },
      q4: { questionId: 'q4', selectedOptionIndex: 0, isMarkedForReview: false },
    };

    const result = calculateQuizScore(mockQuestions, answers);
    expect(result.score).toBe(4);
    expect(result.correctCount).toBe(4);
    expect(result.incorrectCount).toBe(0);
    expect(result.unansweredCount).toBe(0);
    expect(result.accuracy).toBe(100);
  });

  it('correctly calculates accuracy when some questions are incorrect', () => {
    const answers: Record<string, UserAnswer> = {
      q1: { questionId: 'q1', selectedOptionIndex: 1, isMarkedForReview: false }, // correct
      q2: { questionId: 'q2', selectedOptionIndex: 0, isMarkedForReview: false }, // wrong
      q3: { questionId: 'q3', selectedOptionIndex: 0, isMarkedForReview: false }, // correct
      q4: { questionId: 'q4', selectedOptionIndex: 1, isMarkedForReview: false }, // wrong
    };

    const result = calculateQuizScore(mockQuestions, answers);
    expect(result.score).toBe(2);
    expect(result.correctCount).toBe(2);
    expect(result.incorrectCount).toBe(2);
    expect(result.unansweredCount).toBe(0);
    expect(result.accuracy).toBe(50);
  });

  it('safely handles zero questions answered without dividing by zero', () => {
    const answers: Record<string, UserAnswer> = {};

    const result = calculateQuizScore(mockQuestions, answers);
    expect(result.score).toBe(0);
    expect(result.answeredCount).toBe(0);
    expect(result.unansweredCount).toBe(4);
    expect(result.accuracy).toBe(0); // must safely return 0
  });

  it('calculates accuracy based on answered questions only when partial answers exist', () => {
    const answers: Record<string, UserAnswer> = {
      q1: { questionId: 'q1', selectedOptionIndex: 1, isMarkedForReview: false }, // correct
      q2: { questionId: 'q2', selectedOptionIndex: 0, isMarkedForReview: false }, // wrong
      // q3 and q4 skipped
    };

    const result = calculateQuizScore(mockQuestions, answers);
    expect(result.score).toBe(1);
    expect(result.answeredCount).toBe(2);
    expect(result.unansweredCount).toBe(2);
    expect(result.accuracy).toBe(50); // 1 correct out of 2 answered
  });
});
