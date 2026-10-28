import { Quiz, QuizAttempt, QuizQuestion, TopicPerformance, UserAnswer } from '../types/quiz';
import {
  WEAK_TOPIC_ACCURACY_THRESHOLD,
  WEAK_TOPIC_MIN_ATTEMPTS,
  STRONG_TOPIC_ACCURACY_THRESHOLD,
} from '../constants/rules';

export interface ScoreBreakdown {
  score: number;
  totalQuestions: number;
  answeredCount: number;
  unansweredCount: number;
  correctCount: number;
  incorrectCount: number;
  accuracy: number; // 0 - 100 percentage
}

/**
 * Calculates quiz scoring and accuracy with safe division handling.
 */
export function calculateQuizScore(
  questions: QuizQuestion[],
  answers: Record<string, UserAnswer>
): ScoreBreakdown {
  const totalQuestions = questions.length;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  questions.forEach(q => {
    const userAns = answers[q.id];
    if (!userAns || userAns.selectedOptionIndex === null || userAns.selectedOptionIndex === undefined) {
      unansweredCount++;
    } else if (userAns.selectedOptionIndex === q.correctOptionIndex) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  const answeredCount = correctCount + incorrectCount;
  // Calculate accuracy as correct answers divided by questions answered, with safe handling for zero answers
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  return {
    score: correctCount,
    totalQuestions,
    answeredCount,
    unansweredCount,
    correctCount,
    incorrectCount,
    accuracy,
  };
}

/**
 * Creates a finalized immutable QuizAttempt record from user answers and question list.
 */
export function buildQuizAttempt(
  quiz: Quiz,
  answers: Record<string, UserAnswer>,
  isPracticeMode = false
): QuizAttempt {
  const breakdown = calculateQuizScore(quiz.questions, answers);

  return {
    id: `attempt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    quizId: quiz.id,
    quizTitle: quiz.title,
    subject: quiz.subject,
    difficulty: quiz.difficulty,
    totalQuestions: breakdown.totalQuestions,
    completedAt: new Date().toISOString(),
    answers,
    score: breakdown.score,
    accuracy: breakdown.accuracy,
    correctCount: breakdown.correctCount,
    incorrectCount: breakdown.incorrectCount,
    unansweredCount: breakdown.unansweredCount,
    isPracticeMode,
    isSample: false,
  };
}

export interface TopicAggregator {
  total: number;
  correct: number;
  subject?: string;
}

/**
 * Diagnoses topics across quiz attempts and quizzes to detect weak topics.
 * Follows exact hackathon specification:
 * - Group questions using their topic tags.
 * - Identify a topic as needing practice when the student gets less than 60% correct
 *   and has attempted at least three questions in that topic.
 * - If there is insufficient evidence (< 3 questions), label the topic "Not enough data".
 */
export function analyzeTopicPerformance(
  quizzes: Quiz[],
  attempts: QuizAttempt[]
): TopicPerformance[] {
  // Map of questionId -> QuizQuestion
  const questionMap = new Map<string, QuizQuestion>();
  quizzes.forEach(quiz => {
    quiz.questions.forEach(q => {
      questionMap.set(q.id, q);
    });
  });

  const topicMap: Record<string, TopicAggregator> = {};

  attempts.forEach(attempt => {
    Object.entries(attempt.answers).forEach(([questionId, userAnswer]) => {
      const q = questionMap.get(questionId);
      // Fallback if question was deleted or from sample
      const topic = q?.topic || `${attempt.subject}: Core Principles`;

      if (!topicMap[topic]) {
        topicMap[topic] = { total: 0, correct: 0, subject: attempt.subject };
      }

      // Only count questions that were actually answered
      if (userAnswer.selectedOptionIndex !== null && userAnswer.selectedOptionIndex !== undefined) {
        topicMap[topic].total += 1;
        if (q && userAnswer.selectedOptionIndex === q.correctOptionIndex) {
          topicMap[topic].correct += 1;
        } else if (!q && userAnswer.selectedOptionIndex === 0) {
          // fallback if sample
          topicMap[topic].correct += 1;
        }
      }
    });
  });

  const results: TopicPerformance[] = Object.entries(topicMap).map(([topic, data]) => {
    const accuracy = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    const decimalAccuracy = data.total > 0 ? data.correct / data.total : 0;

    let status: TopicPerformance['status'];
    let needsPractice = false;

    if (data.total < WEAK_TOPIC_MIN_ATTEMPTS) {
      status = 'Not enough data';
      needsPractice = false;
    } else if (decimalAccuracy < WEAK_TOPIC_ACCURACY_THRESHOLD) {
      status = 'Weak';
      needsPractice = true;
    } else if (decimalAccuracy >= STRONG_TOPIC_ACCURACY_THRESHOLD) {
      status = 'Strong';
      needsPractice = false;
    } else {
      status = 'Average';
      needsPractice = false;
    }

    return {
      topic,
      subject: data.subject,
      totalQuestions: data.total,
      correctAnswers: data.correct,
      accuracy,
      status,
      needsPractice,
    };
  });

  // Sort weak topics first, then by lowest accuracy
  return results.sort((a, b) => {
    if (a.needsPractice && !b.needsPractice) return -1;
    if (!a.needsPractice && b.needsPractice) return 1;
    return a.accuracy - b.accuracy;
  });
}

/**
 * Calculates aggregate statistics across all completed attempts.
 */
export function calculateOverallStats(attempts: QuizAttempt[]) {
  if (attempts.length === 0) {
    return {
      totalQuizzes: 0,
      averageScore: 0,
      totalQuestionsAnswered: 0,
      overallAccuracy: 0,
      subjectBreakdown: [] as { subject: string; quizzes: number; avgAccuracy: number }[],
      scoreTrend: [] as { date: string; score: number; accuracy: number; title: string }[],
      correctCount: 0,
      incorrectCount: 0,
    };
  }

  let totalQuestionsAnswered = 0;
  let totalCorrect = 0;
  let totalIncorrect = 0;
  let sumAccuracy = 0;

  const subjectMap: Record<string, { count: number; totalAccuracy: number }> = {};

  const scoreTrend = attempts
    .slice()
    .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())
    .map(a => {
      const dateStr = new Date(a.completedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
      return {
        date: dateStr,
        score: a.score,
        accuracy: a.accuracy,
        title: a.quizTitle,
      };
    });

  attempts.forEach(a => {
    totalQuestionsAnswered += a.correctCount + a.incorrectCount;
    totalCorrect += a.correctCount;
    totalIncorrect += a.incorrectCount;
    sumAccuracy += a.accuracy;

    const sub = a.subject || 'General';
    if (!subjectMap[sub]) {
      subjectMap[sub] = { count: 0, totalAccuracy: 0 };
    }
    subjectMap[sub].count += 1;
    subjectMap[sub].totalAccuracy += a.accuracy;
  });

  const averageScore = Math.round(sumAccuracy / attempts.length);
  const overallAccuracy =
    totalQuestionsAnswered > 0 ? Math.round((totalCorrect / totalQuestionsAnswered) * 100) : 0;

  const subjectBreakdown = Object.entries(subjectMap).map(([subject, info]) => ({
    subject,
    quizzes: info.count,
    avgAccuracy: Math.round(info.totalAccuracy / info.count),
  }));

  return {
    totalQuizzes: attempts.length,
    averageScore,
    totalQuestionsAnswered,
    overallAccuracy,
    subjectBreakdown,
    scoreTrend,
    correctCount: totalCorrect,
    incorrectCount: totalIncorrect,
  };
}
