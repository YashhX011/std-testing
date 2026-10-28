import { Quiz, QuizAttempt, UserProfile } from '../types/quiz';
import { SAMPLE_QUIZ_ATTEMPTS } from '../constants/sampleHistory';

const STORAGE_KEYS = {
  ATTEMPTS: 'studypilot_quiz_attempts_v1',
  SAVED_QUIZZES: 'studypilot_quizzes_v1',
  PROFILE: 'studypilot_user_profile_v1',
  DEMO_MODE_ACTIVE: 'studypilot_demo_mode_v1',
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Demo Student',
  gradeOrTarget: 'Honors STEM / Exam Prep',
  streakCount: 3,
};

export const storageService = {
  /**
   * Loads all saved quiz attempts. If empty and demo mode hasn't been explicitly cleared,
   * it returns the sample attempts to populate the demo screen gracefully.
   */
  getAttempts(): { attempts: QuizAttempt[]; isSampleData: boolean } {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      if (!raw) {
        // Check if user explicitly cleared history
        const demoDisabled = localStorage.getItem(STORAGE_KEYS.DEMO_MODE_ACTIVE) === 'cleared';
        if (demoDisabled) {
          return { attempts: [], isSampleData: false };
        }
        return { attempts: SAMPLE_QUIZ_ATTEMPTS, isSampleData: true };
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        if (parsed.length === 0) {
          return { attempts: [], isSampleData: false };
        }
        // If all items have isSample: true, indicate it's sample data
        const allSample = parsed.every(a => a.isSample === true);
        return { attempts: parsed, isSampleData: allSample };
      }
      return { attempts: [], isSampleData: false };
    } catch (err) {
      console.error('Failed to parse quiz attempts from localStorage:', err);
      return { attempts: [], isSampleData: false };
    }
  },

  /**
   * Saves a newly completed quiz attempt.
   * If current storage only contains sample data, saving a real attempt replaces or augments
   * with real student data and marks demo mode as user-active.
   */
  saveAttempt(attempt: QuizAttempt): void {
    try {
      const current = this.getAttempts().attempts;
      // Filter out sample data once real user data starts being produced
      const realOnly = current.filter(a => !a.isSample);
      
      // Prevent duplicate attempt IDs
      const filtered = realOnly.filter(a => a.id !== attempt.id);
      const updated = [attempt, ...filtered];
      
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(updated));
      localStorage.setItem(STORAGE_KEYS.DEMO_MODE_ACTIVE, 'user-active');
      this.updateStreak();
    } catch (err) {
      console.error('Failed to save quiz attempt to localStorage:', err);
    }
  },

  /**
   * Retrieve all saved quizzes.
   */
  getSavedQuizzes(): Quiz[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SAVED_QUIZZES);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Failed to parse saved quizzes from localStorage:', err);
      return [];
    }
  },

  /**
   * Save a newly generated quiz so the user can retake it anytime.
   */
  saveQuiz(quiz: Quiz): void {
    try {
      const quizzes = this.getSavedQuizzes();
      const filtered = quizzes.filter(q => q.id !== quiz.id);
      localStorage.setItem(STORAGE_KEYS.SAVED_QUIZZES, JSON.stringify([quiz, ...filtered]));
    } catch (err) {
      console.error('Failed to save quiz to localStorage:', err);
    }
  },

  /**
   * Delete a saved quiz and optionally its attempts.
   */
  deleteQuiz(quizId: string): void {
    try {
      const quizzes = this.getSavedQuizzes().filter(q => q.id !== quizId);
      localStorage.setItem(STORAGE_KEYS.SAVED_QUIZZES, JSON.stringify(quizzes));
      
      const attempts = this.getAttempts().attempts.filter(a => a.quizId !== quizId);
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
    } catch (err) {
      console.error('Failed to delete quiz from localStorage:', err);
    }
  },

  /**
   * Get student profile.
   */
  getProfile(): UserProfile {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!raw) return DEFAULT_PROFILE;
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_PROFILE, ...parsed };
    } catch (err) {
      return DEFAULT_PROFILE;
    }
  },

  /**
   * Update student profile.
   */
  saveProfile(profile: Partial<UserProfile>): UserProfile {
    try {
      const current = this.getProfile();
      const updated = { ...current, ...profile };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
      return updated;
    } catch (err) {
      return DEFAULT_PROFILE;
    }
  },

  /**
   * Updates streak honestly based on distinct active study dates in completed attempts.
   */
  updateStreak(): number {
    try {
      const { attempts } = this.getAttempts();
      const realAttempts = attempts.filter(a => !a.isSample);
      if (realAttempts.length === 0) return 0;

      // Extract unique dates formatted as YYYY-MM-DD
      const dates = Array.from(
        new Set(
          realAttempts.map(a => new Date(a.completedAt).toISOString().split('T')[0])
        )
      ).sort().reverse();

      if (dates.length === 0) return 0;

      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      // If no activity today or yesterday, streak is broken
      if (dates[0] !== today && dates[0] !== yesterday) {
        this.saveProfile({ streakCount: 0 });
        return 0;
      }

      let streak = 1;
      for (let i = 0; i < dates.length - 1; i++) {
        const dCurrent = new Date(dates[i]);
        const dNext = new Date(dates[i + 1]);
        const diffDays = Math.round((dCurrent.getTime() - dNext.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          streak++;
        } else {
          break;
        }
      }

      this.saveProfile({ streakCount: streak, lastActiveDate: today });
      return streak;
    } catch (err) {
      return 0;
    }
  },

  /**
   * Clears all history (requires user confirmation in UI).
   */
  clearHistory(): void {
    localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
    localStorage.removeItem(STORAGE_KEYS.SAVED_QUIZZES);
    localStorage.setItem(STORAGE_KEYS.DEMO_MODE_ACTIVE, 'cleared');
    this.saveProfile({ streakCount: 0 });
  },

  /**
   * Resets data back to rich demo data.
   */
  resetToDemo(): void {
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(SAMPLE_QUIZ_ATTEMPTS));
    localStorage.removeItem(STORAGE_KEYS.DEMO_MODE_ACTIVE);
    this.saveProfile({ name: 'Demo Student', streakCount: 3 });
  }
};
