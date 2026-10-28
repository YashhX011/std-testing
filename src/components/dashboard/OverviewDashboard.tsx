import React from 'react';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Flame,
  Award,
  ArrowRight,
  Target,
  Clock,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Quiz, QuizAttempt, TopicPerformance } from '../../types/quiz';

interface OverviewDashboardProps {
  attempts: QuizAttempt[];
  savedQuizzes: Quiz[];
  weakTopics: TopicPerformance[];
  streakCount: number;
  isSampleData: boolean;
  onNavigateToGenerate: () => void;
  onNavigateToHistory: () => void;
  onNavigateToWeakTopics: () => void;
  onStartPractice: (topicName?: string) => void;
  onRetakeQuiz: (quizId: string) => void;
  onResetToDemo: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  attempts,
  savedQuizzes,
  weakTopics,
  streakCount,
  isSampleData,
  onNavigateToGenerate,
  onNavigateToHistory,
  onNavigateToWeakTopics,
  onStartPractice,
  onRetakeQuiz,
  onResetToDemo,
}) => {
  // Aggregate KPI Calculations
  const totalQuizzes = attempts.length;
  const totalQuestionsAnswered = attempts.reduce(
    (acc, a) => acc + (a.correctCount + a.incorrectCount),
    0
  );
  const totalCorrect = attempts.reduce((acc, a) => acc + a.correctCount, 0);
  const averageScore =
    totalQuizzes > 0
      ? Math.round(
          attempts.reduce((acc, a) => acc + a.accuracy, 0) / totalQuizzes
        )
      : 0;

  // Chart data: Score trend over time
  const trendData = attempts
    .slice()
    .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())
    .map((a, idx) => ({
      name: `Quiz ${idx + 1}`,
      date: new Date(a.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      score: a.score,
      accuracy: a.accuracy,
      title: a.quizTitle,
      subject: a.subject,
    }));

  // Chart data: Subject performance
  const subjectMap: Record<string, { totalAcc: number; count: number }> = {};
  attempts.forEach(a => {
    const sub = a.subject || 'General';
    if (!subjectMap[sub]) subjectMap[sub] = { totalAcc: 0, count: 0 };
    subjectMap[sub].totalAcc += a.accuracy;
    subjectMap[sub].count += 1;
  });

  const subjectData = Object.entries(subjectMap).map(([subject, data]) => ({
    subject,
    accuracy: Math.round(data.totalAcc / data.count),
    quizzes: data.count,
  }));

  const recentAttempts = attempts.slice(0, 4);

  return (
    <div className="space-y-6 pb-12">
      {/* Sample Data Banner */}
      {isSampleData && (
        <div className="bg-cyan/10 border border-cyan/25 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan/20 text-cyan flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-textMain flex items-center gap-1.5">
                Viewing Sample Demonstration Dataset
              </p>
              <p className="text-xs text-textSecondary">
                This initial dashboard displays preloaded sample analytics. Completing your first custom quiz will seamlessly transition to your active personal progress.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={onNavigateToGenerate}
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Create Your First Quiz
          </Button>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-card via-surface to-card border border-borderSubtle p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-2">
          <Badge variant="cyan" size="sm" icon={<Sparkles className="w-3 h-3" />}>
            AI Exam Coach & Diagnostic Engine
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-textMain tracking-tight">
            Ready to level up your learning?
          </h1>
          <p className="text-sm sm:text-base text-textSecondary leading-relaxed">
            Turn your class lecture notes into syllabus-accurate exam quizzes, identify your weak topics below 60% accuracy, and accelerate exam readiness with targeted practice.
          </p>
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              variant="primary"
              leftIcon={<Sparkles className="w-5 h-5 text-white" />}
              onClick={onNavigateToGenerate}
            >
              Generate New Quiz
            </Button>
            {weakTopics.filter(t => t.needsPractice).length > 0 && (
              <Button
                size="lg"
                variant="secondary"
                leftIcon={<Target className="w-5 h-5 text-warning" />}
                onClick={() => onStartPractice()}
              >
                Target Weakest Topics
              </Button>
            )}
          </div>
        </div>

        {/* Ambient fintech background glow */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-16 w-64 h-64 bg-cyan/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Quizzes Completed */}
        <Card hoverable className="space-y-2">
          <div className="flex items-center justify-between text-textSecondary">
            <span className="text-xs font-semibold uppercase tracking-wider">Quizzes Completed</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-textMain tracking-tight">
              {totalQuizzes}
            </span>
            <span className="text-xs text-textSecondary font-medium">recorded sessions</span>
          </div>
          <p className="text-xs text-textSecondary">
            {isSampleData ? '3 sample demos included' : 'Personal saved attempts'}
          </p>
        </Card>

        {/* KPI 2: Average Score */}
        <Card hoverable className="space-y-2">
          <div className="flex items-center justify-between text-textSecondary">
            <span className="text-xs font-semibold uppercase tracking-wider">Average Score</span>
            <div className="w-8 h-8 rounded-lg bg-cyan/10 text-cyan flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-textMain tracking-tight">
              {averageScore}%
            </span>
            <span className={`text-xs font-semibold ${averageScore >= 75 ? 'text-success' : averageScore >= 60 ? 'text-warning' : 'text-danger'}`}>
              {averageScore >= 75 ? 'Proficient' : averageScore >= 60 ? 'Passing' : 'Needs Review'}
            </span>
          </div>
          <p className="text-xs text-textSecondary">Overall average accuracy</p>
        </Card>

        {/* KPI 3: Questions Answered */}
        <Card hoverable className="space-y-2">
          <div className="flex items-center justify-between text-textSecondary">
            <span className="text-xs font-semibold uppercase tracking-wider">Questions Solved</span>
            <div className="w-8 h-8 rounded-lg bg-success/10 text-success flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-textMain tracking-tight">
              {totalQuestionsAnswered}
            </span>
            <span className="text-xs text-success font-medium">{totalCorrect} correct</span>
          </div>
          <p className="text-xs text-textSecondary">
            {totalQuestionsAnswered > 0
              ? `${Math.round((totalCorrect / totalQuestionsAnswered) * 100)}% accuracy rate`
              : 'Start your first quiz'}
          </p>
        </Card>

        {/* KPI 4: Study Streak */}
        <Card hoverable className="space-y-2">
          <div className="flex items-center justify-between text-textSecondary">
            <span className="text-xs font-semibold uppercase tracking-wider">Study Streak</span>
            <div className="w-8 h-8 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-textMain tracking-tight">
              {streakCount}
            </span>
            <span className="text-xs text-textSecondary font-medium">consecutive {streakCount === 1 ? 'day' : 'days'}</span>
          </div>
          <p className="text-xs text-textSecondary">Calculated from verified quiz activity</p>
        </Card>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Performance Over Time (2 Cols) */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-textMain flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Performance Over Time
              </h3>
              <p className="text-xs text-textSecondary">Accuracy percentage across your completed quiz attempts</p>
            </div>
            {isSampleData && (
              <Badge variant="cyan" size="sm">Sample Trend</Badge>
            )}
          </div>

          <div className="h-64 w-full pt-2">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={11}
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    tickFormatter={val => `${val}%`}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#172235',
                      borderColor: 'rgba(255,255,255,0.12)',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                    formatter={(value: any) => [`${value}% Accuracy`, 'Score']}
                    labelFormatter={(label, items) => {
                      const item = items[0]?.payload;
                      return item ? `${item.title} (${item.date})` : label;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: '#22D3EE', r: 4, strokeWidth: 1, stroke: '#0B0F19' }}
                    activeDot={{ r: 6, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-textSecondary space-y-2">
                <BookOpen className="w-8 h-8 opacity-40" />
                <p className="text-sm">No quiz attempts yet to plot trendline.</p>
                <Button size="sm" variant="outline" onClick={onNavigateToGenerate}>
                  Take a quiz
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Chart 2: Subject Accuracy Bar Chart (1 Col) */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-textMain">Subject Mastery</h3>
              <p className="text-xs text-textSecondary">Average accuracy by subject</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            {subjectData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="subject"
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={11}
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    tickFormatter={val => `${val}%`}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#172235',
                      borderColor: 'rgba(255,255,255,0.12)',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                    formatter={(value: any) => [`${value}%`, 'Accuracy']}
                  />
                  <Bar
                    dataKey="accuracy"
                    fill="#22D3EE"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={38}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-textSecondary space-y-2">
                <Target className="w-8 h-8 opacity-40" />
                <p className="text-sm">No subject data recorded.</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Weak Topics Panel & Recent Quizzes Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weak Topics Diagnostic Panel (1 Col) */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-borderSubtle pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-warning/15 text-warning">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-textMain">Diagnostic Topics</h3>
                <p className="text-xs text-textSecondary">Target threshold: &lt;60% (min 3 attempts)</p>
              </div>
            </div>
            <button
              onClick={onNavigateToWeakTopics}
              className="text-xs text-cyan hover:underline font-medium"
            >
              View all
            </button>
          </div>

          <div className="space-y-3">
            {weakTopics.length > 0 ? (
              weakTopics.slice(0, 4).map((topic, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-surface/50 border border-borderSubtle flex items-center justify-between hover:border-borderElevated transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-textMain">{topic.topic}</span>
                      {topic.needsPractice && (
                        <Badge variant="warning" size="sm">Weak</Badge>
                      )}
                      {topic.status === 'Not enough data' && (
                        <Badge variant="neutral" size="sm">Need Data</Badge>
                      )}
                      {topic.status === 'Strong' && (
                        <Badge variant="success" size="sm">Strong</Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-textSecondary">
                      {topic.totalQuestions} questions &bull; {topic.accuracy}% accuracy
                    </p>
                  </div>
                  {topic.needsPractice && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onStartPractice(topic.topic)}
                      className="text-xs px-2.5 py-1"
                    >
                      Practice
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-textSecondary space-y-2">
                <Target className="w-8 h-8 mx-auto opacity-40 text-success" />
                <p className="text-xs">No weak topics diagnosed yet! Keep taking quizzes to map mastery.</p>
              </div>
            )}
          </div>

          <Button
            size="sm"
            variant="secondary"
            className="w-full"
            onClick={onNavigateToWeakTopics}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Open Weak Topics Lab
          </Button>
        </Card>

        {/* Recent Quiz History (2 Cols) */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-borderSubtle pb-3">
            <div>
              <h3 className="text-base font-semibold text-textMain">Recent Quiz History</h3>
              <p className="text-xs text-textSecondary">Review recent attempts and retake saved quizzes</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={onNavigateToHistory}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              All Quizzes
            </Button>
          </div>

          {recentAttempts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-borderSubtle text-xs text-textSecondary font-semibold">
                    <th className="pb-3 pl-2">Quiz Title</th>
                    <th className="pb-3">Subject</th>
                    <th className="pb-3">Score & Accuracy</th>
                    <th className="pb-3">Completed</th>
                    <th className="pb-3 pr-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderSubtle/60">
                  {recentAttempts.map((attempt) => (
                    <tr key={attempt.id} className="hover:bg-surface/40 transition-colors">
                      <td className="py-3 pl-2 font-medium text-textMain">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[200px]">{attempt.quizTitle}</span>
                          {attempt.isSample && (
                            <Badge variant="cyan" size="sm">Demo</Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 text-textSecondary text-xs">
                        <span className="px-2 py-0.5 rounded bg-surface border border-borderSubtle text-textSecondary font-medium">
                          {attempt.subject}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-textMain text-sm">
                            {attempt.score}/{attempt.totalQuestions}
                          </span>
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded ${
                              attempt.accuracy >= 75
                                ? 'bg-success/15 text-success'
                                : attempt.accuracy >= 60
                                ? 'bg-warning/15 text-warning'
                                : 'bg-danger/15 text-danger'
                            }`}
                          >
                            {attempt.accuracy}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-textSecondary text-xs">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {new Date(attempt.completedAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-2 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRetakeQuiz(attempt.quizId)}
                          leftIcon={<RotateCcw className="w-3.5 h-3.5 text-primary" />}
                          className="text-xs"
                        >
                          Retake
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-textSecondary space-y-3">
              <BookOpen className="w-10 h-10 mx-auto opacity-30" />
              <p className="text-sm font-medium">No quiz attempts recorded yet.</p>
              <div className="flex justify-center gap-3">
                <Button size="sm" variant="primary" onClick={onNavigateToGenerate}>
                  Generate a Quiz
                </Button>
                <Button size="sm" variant="secondary" onClick={onResetToDemo}>
                  Load Demo Data
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
