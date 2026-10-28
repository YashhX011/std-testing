import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Award,
  Target,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Flame,
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
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { QuizAttempt, TopicPerformance } from '../../types/quiz';

interface AnalyticsViewProps {
  attempts: QuizAttempt[];
  topicPerformances: TopicPerformance[];
  streakCount: number;
  isSampleData: boolean;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  attempts,
  topicPerformances,
  streakCount,
  isSampleData,
}) => {
  // Aggregate stats
  const totalAttempts = attempts.length;
  const totalCorrect = attempts.reduce((acc, a) => acc + a.correctCount, 0);
  const totalIncorrect = attempts.reduce((acc, a) => acc + a.incorrectCount, 0);
  const totalUnanswered = attempts.reduce((acc, a) => acc + a.unansweredCount, 0);
  const totalSolved = totalCorrect + totalIncorrect;

  const overallAccuracy = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;

  // Score Trend Data
  const trendData = attempts
    .slice()
    .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())
    .map((a, idx) => ({
      name: `Quiz ${idx + 1}`,
      date: new Date(a.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      accuracy: a.accuracy,
      score: a.score,
      total: a.totalQuestions,
      title: a.quizTitle,
    }));

  // Subject Performance Data
  const subjectMap: Record<string, { totalAcc: number; count: number; totalQ: number }> = {};
  attempts.forEach(a => {
    const s = a.subject || 'General';
    if (!subjectMap[s]) subjectMap[s] = { totalAcc: 0, count: 0, totalQ: 0 };
    subjectMap[s].totalAcc += a.accuracy;
    subjectMap[s].count += 1;
    subjectMap[s].totalQ += a.totalQuestions;
  });

  const subjectData = Object.entries(subjectMap).map(([subject, data]) => ({
    subject,
    accuracy: Math.round(data.totalAcc / data.count),
    quizzes: data.count,
    questions: data.totalQ,
  }));

  // Pie chart data: Answer accuracy breakdown
  const pieData = [
    { name: 'Correct', value: totalCorrect, color: '#22C55E' },
    { name: 'Incorrect', value: totalIncorrect, color: '#EF4444' },
    { name: 'Skipped', value: totalUnanswered, color: '#94A3B8' },
  ].filter(d => d.value > 0);

  // Strongest and Weakest topics
  const rankedTopics = [...topicPerformances].filter(t => t.totalQuestions >= 1);
  const weakestTopics = rankedTopics.slice(0, 3);
  const strongestTopics = [...rankedTopics].reverse().slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-borderSubtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-textMain tracking-tight">
              Progress & Mastery Analytics
            </h1>
            {isSampleData ? (
              <Badge variant="cyan" size="sm" icon={<Zap className="w-3 h-3" />}>
                Demo Dataset
              </Badge>
            ) : (
              <Badge variant="success" size="sm">
                Active Student
              </Badge>
            )}
          </div>
          <p className="text-xs text-textSecondary">
            Quantitative diagnostic telemetry tracking score progression, question accuracy, and syllabus readiness.
          </p>
        </div>
      </div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Overall Accuracy</span>
          <p className="text-2xl font-black text-textMain">{overallAccuracy}%</p>
          <span className="text-[11px] text-textSecondary">{totalCorrect} correct answers</span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Completed Sessions</span>
          <p className="text-2xl font-black text-textMain">{totalAttempts}</p>
          <span className="text-[11px] text-textSecondary">Evaluated attempts</span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Study Streak</span>
          <p className="text-2xl font-black text-warning flex items-center gap-1.5">
            <Flame className="w-5 h-5 fill-warning/20" /> {streakCount} {streakCount === 1 ? 'Day' : 'Days'}
          </p>
          <span className="text-[11px] text-textSecondary">Active study consistency</span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Topics Mapped</span>
          <p className="text-2xl font-black text-cyan">{topicPerformances.length}</p>
          <span className="text-[11px] text-textSecondary">Distinct syllabus topics</span>
        </Card>
      </div>

      {/* Row 1: Line Chart (Trend) & Donut Chart (Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Line Chart (2 Cols) */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-borderSubtle pb-3">
            <div>
              <h2 className="text-sm font-semibold text-textMain flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Score Trend Over Time
              </h2>
              <p className="text-xs text-textSecondary">Accuracy trajectory across chronologically completed tests</p>
            </div>
            {isSampleData && <Badge variant="cyan" size="sm">Sample</Badge>}
          </div>

          <div className="h-64 w-full">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
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
                    tickFormatter={v => `${v}%`}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#172235',
                      borderColor: 'rgba(255,255,255,0.12)',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${val}% Accuracy`, 'Score']}
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
              <div className="h-full flex items-center justify-center text-xs text-textSecondary">
                No attempt trend data available.
              </div>
            )}
          </div>
        </Card>

        {/* Donut Chart: Answer Accuracy Breakdown (1 Col) */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-borderSubtle pb-3">
            <div>
              <h2 className="text-sm font-semibold text-textMain flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-cyan" /> Answer Breakdown
              </h2>
              <p className="text-xs text-textSecondary">Distribution of solved questions</p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#172235',
                      borderColor: 'rgba(255,255,255,0.12)',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconSize={8}
                    formatter={(val: string) => <span className="text-xs text-textSecondary">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-textSecondary">No answers to display</div>
            )}
          </div>
        </Card>
      </div>

      {/* Row 2: Subject Accuracy & Strongest vs Weakest Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Accuracy Bar Chart */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-borderSubtle pb-3">
            <div>
              <h2 className="text-sm font-semibold text-textMain flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" /> Subject-Wise Accuracy
              </h2>
              <p className="text-xs text-textSecondary">Average performance across tested disciplines</p>
            </div>
          </div>

          <div className="h-64 w-full">
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
                    tickFormatter={v => `${v}%`}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#172235',
                      borderColor: 'rgba(255,255,255,0.12)',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${val}%`, 'Accuracy']}
                  />
                  <Bar dataKey="accuracy" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-textSecondary">
                No subject metrics available.
              </div>
            )}
          </div>
        </Card>

        {/* Strongest vs Weakest Topics Diagnostic */}
        <Card className="space-y-4">
          <div className="border-b border-borderSubtle pb-3">
            <h2 className="text-sm font-semibold text-textMain flex items-center gap-2">
              <Target className="w-4 h-4 text-warning" /> Topic Mastery Rankings
            </h2>
            <p className="text-xs text-textSecondary">Top performing concepts vs priority areas for revision</p>
          </div>

          <div className="space-y-4">
            {/* Weakest Areas */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-danger uppercase tracking-wider flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" /> High Priority Review Topics (&lt;60%)
              </span>
              <div className="space-y-1.5">
                {weakestTopics.length > 0 ? (
                  weakestTopics.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-surface/50 border border-borderSubtle flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-textMain truncate max-w-[200px]">{t.topic}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-textSecondary">{t.totalQuestions} qs</span>
                        <span className={`font-bold px-2 py-0.5 rounded ${t.needsPractice ? 'bg-danger/15 text-danger' : 'bg-surface text-textSecondary'}`}>
                          {t.accuracy}%
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-textSecondary italic">No topics recorded below threshold.</p>
                )}
              </div>
            </div>

            {/* Strongest Areas */}
            <div className="space-y-2 pt-2 border-t border-borderSubtle">
              <span className="text-xs font-bold text-success uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Strongest Concepts (&ge;80%)
              </span>
              <div className="space-y-1.5">
                {strongestTopics.length > 0 ? (
                  strongestTopics.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-surface/50 border border-borderSubtle flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-textMain truncate max-w-[200px]">{t.topic}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-textSecondary">{t.totalQuestions} qs</span>
                        <span className="font-bold px-2 py-0.5 rounded bg-success/15 text-success">
                          {t.accuracy}%
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-textSecondary italic">No strong topics recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
