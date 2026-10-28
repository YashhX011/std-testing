import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar, NavItemKey } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';

import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { QuizGeneratorView } from './components/generator/QuizGeneratorView';
import { QuizSessionView } from './components/quiz/QuizSessionView';
import { QuizResultsView } from './components/results/QuizResultsView';
import { SmartPracticeView } from './components/practice/SmartPracticeView';
import { QuizHistoryView } from './components/history/QuizHistoryView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';

import { Quiz, QuizAttempt, UserProfile } from './types/quiz';
import { storageService } from './services/storage';
import { analyzeTopicPerformance } from './services/analytics';
import { SAMPLE_NOTES } from './constants/sampleNotes';
import {
  CELLULAR_RESPIRATION_QUESTIONS,
  OS_QUESTIONS,
  MONETARY_POLICY_QUESTIONS,
} from './services/curatedQuestions';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavItemKey>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Storage state
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isSampleData, setIsSampleData] = useState(true);
  const [savedQuizzes, setSavedQuizzes] = useState<Quiz[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(storageService.getProfile());

  // Interactive Quiz Taking / Review states
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [activeReview, setActiveReview] = useState<{ quiz: Quiz; attempt: QuizAttempt } | null>(null);
  const [practiceInitialTopic, setPracticeInitialTopic] = useState<string | undefined>(undefined);

  // Synchronize state with storage
  const reloadStorage = () => {
    const { attempts: loadedAttempts, isSampleData: isSample } = storageService.getAttempts();
    setAttempts(loadedAttempts);
    setIsSampleData(isSample);

    let quizzes = storageService.getSavedQuizzes();
    // If no quizzes saved yet, provide sample quizzes so retaking and weak topic mapping works
    if (quizzes.length === 0) {
      quizzes = [
        {
          id: 'sample-bio-1',
          title: 'Cellular Respiration & Bioenergetics',
          subject: 'Biology',
          difficulty: 'Medium',
          questions: CELLULAR_RESPIRATION_QUESTIONS.slice(0, 5),
          createdAt: new Date().toISOString(),
          isSample: true,
        },
        {
          id: 'sample-cs-1',
          title: 'Operating Systems: Virtual Memory & Concurrency',
          subject: 'Computer Science',
          difficulty: 'Hard',
          questions: OS_QUESTIONS.slice(0, 5),
          createdAt: new Date().toISOString(),
          isSample: true,
        },
        {
          id: 'sample-econ-1',
          title: 'Central Banking & Open Market Operations',
          subject: 'Economics',
          difficulty: 'Medium',
          questions: MONETARY_POLICY_QUESTIONS.slice(0, 5),
          createdAt: new Date().toISOString(),
          isSample: true,
        },
      ];
      quizzes.forEach(q => storageService.saveQuiz(q));
    }
    setSavedQuizzes(quizzes);
    setUserProfile(storageService.getProfile());
  };

  useEffect(() => {
    reloadStorage();
  }, []);

  // Compute weak topics diagnosis
  const topicPerformances = useMemo(() => {
    return analyzeTopicPerformance(savedQuizzes, attempts);
  }, [savedQuizzes, attempts]);

  const weakTopicsCount = useMemo(() => {
    return topicPerformances.filter(t => t.needsPractice).length;
  }, [topicPerformances]);

  // Quiz Lifecycle Handlers
  const handleQuizReady = (quiz: Quiz) => {
    storageService.saveQuiz(quiz);
    setSavedQuizzes(prev => [quiz, ...prev.filter(q => q.id !== quiz.id)]);
    setActiveQuiz(quiz);
    setActiveReview(null);
  };

  const handleQuizSubmitted = (attempt: QuizAttempt) => {
    reloadStorage();
    if (activeQuiz) {
      setActiveReview({ quiz: activeQuiz, attempt });
      setActiveQuiz(null);
    }
  };

  const handleRetakeQuiz = (quizId: string) => {
    const foundQuiz = savedQuizzes.find(q => q.id === quizId);
    if (foundQuiz) {
      setActiveQuiz(foundQuiz);
      setActiveReview(null);
    } else {
      // Fallback: create fresh quiz from sample
      const sample = SAMPLE_NOTES[0];
      const fallbackQuiz: Quiz = {
        id: quizId,
        title: sample.title,
        subject: sample.subject,
        difficulty: sample.difficulty,
        questions: CELLULAR_RESPIRATION_QUESTIONS.slice(0, 5),
        createdAt: new Date().toISOString(),
      };
      setActiveQuiz(fallbackQuiz);
      setActiveReview(null);
    }
  };

  const handleStartPractice = (topicName?: string) => {
    setPracticeInitialTopic(topicName);
    setCurrentTab('weak-topics');
    setActiveQuiz(null);
    setActiveReview(null);
  };

  const handleDeleteQuiz = (quizId: string) => {
    storageService.deleteQuiz(quizId);
    reloadStorage();
  };

  const handleViewResults = (attempt: QuizAttempt) => {
    const quiz = savedQuizzes.find(q => q.id === attempt.quizId) || {
      id: attempt.quizId,
      title: attempt.quizTitle,
      subject: attempt.subject,
      difficulty: attempt.difficulty,
      questions: [],
      createdAt: attempt.completedAt,
    };
    setActiveReview({ quiz, attempt });
    setActiveQuiz(null);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-textMain selection:bg-cyan/20 selection:text-cyan">
      {/* Collapsible Desktop Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={tab => {
          setCurrentTab(tab);
          setActiveQuiz(null);
          setActiveReview(null);
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        weakTopicsCount={weakTopicsCount}
        totalQuizzesCount={attempts.length}
        streakCount={userProfile.streakCount}
        isSampleData={isSampleData}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onNavigateToGenerate={() => {
            setCurrentTab('generate');
            setActiveQuiz(null);
            setActiveReview(null);
          }}
          studentName={userProfile.name}
          streakCount={userProfile.streakCount}
          isSampleData={isSampleData}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
          {/* Active Quiz Taking Session Mode */}
          {activeQuiz ? (
            <QuizSessionView
              quiz={activeQuiz}
              onQuizSubmitted={handleQuizSubmitted}
              onExitQuiz={() => setActiveQuiz(null)}
            />
          ) : activeReview ? (
            /* Post-Quiz Results & Review Mode */
            <QuizResultsView
              quiz={activeReview.quiz}
              attempt={activeReview.attempt}
              onRetake={() => handleRetakeQuiz(activeReview.quiz.id)}
              onPracticeWeakTopics={handleStartPractice}
              onGoToDashboard={() => {
                setActiveReview(null);
                setCurrentTab('overview');
              }}
            />
          ) : (
            /* Standard Tabbed Views */
            <>
              {currentTab === 'overview' && (
                <OverviewDashboard
                  attempts={attempts}
                  savedQuizzes={savedQuizzes}
                  weakTopics={topicPerformances}
                  streakCount={userProfile.streakCount}
                  isSampleData={isSampleData}
                  onNavigateToGenerate={() => setCurrentTab('generate')}
                  onNavigateToHistory={() => setCurrentTab('quizzes')}
                  onNavigateToWeakTopics={() => setCurrentTab('weak-topics')}
                  onStartPractice={handleStartPractice}
                  onRetakeQuiz={handleRetakeQuiz}
                  onResetToDemo={() => {
                    storageService.resetToDemo();
                    reloadStorage();
                  }}
                />
              )}

              {currentTab === 'generate' && (
                <QuizGeneratorView onQuizReady={handleQuizReady} />
              )}

              {currentTab === 'quizzes' && (
                <QuizHistoryView
                  attempts={attempts}
                  savedQuizzes={savedQuizzes}
                  onViewResults={handleViewResults}
                  onRetakeQuiz={handleRetakeQuiz}
                  onDeleteQuiz={handleDeleteQuiz}
                  onNavigateToGenerate={() => setCurrentTab('generate')}
                />
              )}

              {currentTab === 'weak-topics' && (
                <SmartPracticeView
                  weakTopics={topicPerformances}
                  savedQuizzes={savedQuizzes}
                  initialTopic={practiceInitialTopic}
                  onNavigateToGenerate={() => setCurrentTab('generate')}
                  onExitPractice={() => {
                    setPracticeInitialTopic(undefined);
                    setCurrentTab('overview');
                  }}
                />
              )}

              {currentTab === 'analytics' && (
                <AnalyticsView
                  attempts={attempts}
                  topicPerformances={topicPerformances}
                  streakCount={userProfile.streakCount}
                  isSampleData={isSampleData}
                />
              )}

              {currentTab === 'settings' && (
                <SettingsView
                  userProfile={userProfile}
                  onUpdateProfile={updated => {
                    const saved = storageService.saveProfile(updated);
                    setUserProfile(saved);
                  }}
                  onHistoryCleared={() => reloadStorage()}
                  onDemoReset={() => reloadStorage()}
                />
              )}
            </>
          )}
        </main>

        {/* Mobile Navigation Bar */}
        <MobileNav
          currentTab={currentTab}
          onSelectTab={tab => {
            setCurrentTab(tab);
            setActiveQuiz(null);
            setActiveReview(null);
          }}
          weakTopicsCount={weakTopicsCount}
        />
      </div>
    </div>
  );
}

export default App;
