import { describe, it, expect } from 'vitest';
import { analyzeTopicPerformance } from '../services/analytics';
import { Quiz, QuizAttempt } from '../types/quiz';

const mockQuiz: Quiz = {
  id: 'q_test_1',
  title: 'Biology Test',
  subject: 'Biology',
  difficulty: 'Medium',
  createdAt: new Date().toISOString(),
  questions: [
    { id: 'q1', question: 'T1 Q1', options: ['A', 'B', 'C', 'D'], correctOptionIndex: 0, topic: 'Glycolysis', explanation: '' },
    { id: 'q2', question: 'T1 Q2', options: ['A', 'B', 'C', 'D'], correctOptionIndex: 0, topic: 'Glycolysis', explanation: '' },
    { id: 'q3', question: 'T1 Q3', options: ['A', 'B', 'C', 'D'], correctOptionIndex: 0, topic: 'Glycolysis', explanation: '' },
    { id: 'q4', question: 'T2 Q1', options: ['A', 'B', 'C', 'D'], correctOptionIndex: 0, topic: 'Krebs Cycle', explanation: '' },
    { id: 'q5', question: 'T2 Q2', options: ['A', 'B', 'C', 'D'], correctOptionIndex: 0, topic: 'Krebs Cycle', explanation: '' },
    { id: 'q6', question: 'T3 Q1', options: ['A', 'B', 'C', 'D'], correctOptionIndex: 0, topic: 'Fermentation', explanation: '' },
    { id: 'q7', question: 'T3 Q2', options: ['A', 'B', 'C', 'D'], correctOptionIndex: 0, topic: 'Fermentation', explanation: '' },
    { id: 'q8', question: 'T3 Q3', options: ['A', 'B', 'C', 'D'], correctOptionIndex: 0, topic: 'Fermentation', explanation: '' },
    { id: 'q9', question: 'T3 Q4', options: ['A', 'B', 'C', 'D'], correctOptionIndex: 0, topic: 'Fermentation', explanation: '' },
  ],
};

describe('Weak Topic Detection Algorithm', () => {
  it('flags a topic as "Weak" and needing practice when accuracy is under 60% with >= 3 attempts', () => {
    // Student answered 3 questions in Glycolysis: 1 correct, 2 wrong => 33% accuracy
    const attempts: QuizAttempt[] = [
      {
        id: 'att_1',
        quizId: 'q_test_1',
        quizTitle: 'Biology Test',
        subject: 'Biology',
        difficulty: 'Medium',
        totalQuestions: 9,
        completedAt: new Date().toISOString(),
        score: 1,
        accuracy: 33,
        correctCount: 1,
        incorrectCount: 2,
        unansweredCount: 6,
        answers: {
          q1: { questionId: 'q1', selectedOptionIndex: 0, isMarkedForReview: false }, // correct
          q2: { questionId: 'q2', selectedOptionIndex: 1, isMarkedForReview: false }, // wrong
          q3: { questionId: 'q3', selectedOptionIndex: 2, isMarkedForReview: false }, // wrong
        },
      },
    ];

    const result = analyzeTopicPerformance([mockQuiz], attempts);
    const glycolysis = result.find(t => t.topic === 'Glycolysis');

    expect(glycolysis).toBeDefined();
    expect(glycolysis?.status).toBe('Weak');
    expect(glycolysis?.needsPractice).toBe(true);
    expect(glycolysis?.accuracy).toBe(33);
    expect(glycolysis?.totalQuestions).toBe(3);
  });

  it('labels topic as "Not enough data" if attempted questions are fewer than 3, even if accuracy is low', () => {
    // Student answered only 2 questions in Krebs Cycle: 0 correct, 2 wrong => 0% accuracy
    const attempts: QuizAttempt[] = [
      {
        id: 'att_2',
        quizId: 'q_test_1',
        quizTitle: 'Biology Test',
        subject: 'Biology',
        difficulty: 'Medium',
        totalQuestions: 9,
        completedAt: new Date().toISOString(),
        score: 0,
        accuracy: 0,
        correctCount: 0,
        incorrectCount: 2,
        unansweredCount: 7,
        answers: {
          q4: { questionId: 'q4', selectedOptionIndex: 1, isMarkedForReview: false }, // wrong
          q5: { questionId: 'q5', selectedOptionIndex: 2, isMarkedForReview: false }, // wrong
        },
      },
    ];

    const result = analyzeTopicPerformance([mockQuiz], attempts);
    const krebs = result.find(t => t.topic === 'Krebs Cycle');

    expect(krebs).toBeDefined();
    expect(krebs?.status).toBe('Not enough data');
    expect(krebs?.needsPractice).toBe(false);
    expect(krebs?.totalQuestions).toBe(2);
  });

  it('labels topic as "Strong" when accuracy is >= 80% with >= 3 questions', () => {
    // 4 questions in Fermentation: 4 correct => 100%
    const attempts: QuizAttempt[] = [
      {
        id: 'att_3',
        quizId: 'q_test_1',
        quizTitle: 'Biology Test',
        subject: 'Biology',
        difficulty: 'Medium',
        totalQuestions: 9,
        completedAt: new Date().toISOString(),
        score: 4,
        accuracy: 100,
        correctCount: 4,
        incorrectCount: 0,
        unansweredCount: 5,
        answers: {
          q6: { questionId: 'q6', selectedOptionIndex: 0, isMarkedForReview: false },
          q7: { questionId: 'q7', selectedOptionIndex: 0, isMarkedForReview: false },
          q8: { questionId: 'q8', selectedOptionIndex: 0, isMarkedForReview: false },
          q9: { questionId: 'q9', selectedOptionIndex: 0, isMarkedForReview: false },
        },
      },
    ];

    const result = analyzeTopicPerformance([mockQuiz], attempts);
    const fermentation = result.find(t => t.topic === 'Fermentation');

    expect(fermentation).toBeDefined();
    expect(fermentation?.status).toBe('Strong');
    expect(fermentation?.needsPractice).toBe(false);
    expect(fermentation?.accuracy).toBe(100);
  });
});
