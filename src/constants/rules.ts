/**
 * Rules and thresholds for StudyPilot AI learning analytics.
 * Easy to configure in one centralized location.
 */

// Weak-topic detection rules:
// - Identify a topic as needing practice when the student gets less than 60% correct
//   and has attempted at least three questions in that topic.
// - If there is insufficient evidence (fewer than 3 questions), label "Not enough data".
export const WEAK_TOPIC_ACCURACY_THRESHOLD = 0.60; // 60%
export const WEAK_TOPIC_MIN_ATTEMPTS = 3; // minimum 3 questions needed to diagnose

// Strong topic threshold:
export const STRONG_TOPIC_ACCURACY_THRESHOLD = 0.80; // 80%

// Minimum notes character length required to generate questions
export const MIN_NOTES_CHARACTER_LENGTH = 60;
