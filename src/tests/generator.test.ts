import { describe, it, expect } from 'vitest';
import { generateQuiz } from '../services/quizGenerator';

describe('Quiz Generator and Grounded Question Validation', () => {
  it('rejects empty or very short notes with a helpful error message', async () => {
    const result = await generateQuiz({
      title: 'Short Note',
      subject: 'Biology',
      notes: 'Too short',
      questionCount: 5,
      difficulty: 'Medium',
    });

    expect(result.success).toBe(false);
    expect(result.errorMessage).toContain('too brief');
    expect(result.quiz).toBeUndefined();
  });

  it('generates questions with exactly 4 options and valid correctOptionIndex from notes', async () => {
    const customNotes = `
      Photosynthesis occurs in chloroplasts containing chlorophyll pigments.
      The light reactions absorb photons to generate ATP and NADPH inside the thylakoid membrane.
      The Calvin cycle occurs in the stroma and fixes carbon dioxide into G3P sugars.
      RuBisCO is the primary enzyme responsible for carbon fixation in the Calvin cycle.
      Water photolysis releases molecular oxygen as a byproduct of the light reactions.
      Stomata regulate gas exchange and water transpiration in plant leaves.
    `;

    const result = await generateQuiz({
      title: 'Plant Biology Quiz',
      subject: 'Botany',
      notes: customNotes,
      questionCount: 5,
      difficulty: 'Medium',
    });

    expect(result.success).toBe(true);
    expect(result.quiz).toBeDefined();
    expect(result.quiz?.questions.length).toBeGreaterThanOrEqual(1);

    result.quiz?.questions.forEach(q => {
      expect(q.options).toHaveLength(4);
      expect(q.correctOptionIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctOptionIndex).toBeLessThan(4);
      expect(q.explanation.length).toBeGreaterThan(0);
      expect(q.topic.length).toBeGreaterThan(0);
    });
  });

  it('notifies user transparently when notes cannot support requested question count without hallucinating', async () => {
    const shortValidNotes = `
      Newton's first law states that an object remains at rest unless acted upon by a net external force.
      The second law defines force as the product of mass and acceleration (F = ma).
    `;

    const result = await generateQuiz({
      title: 'Newtonian Physics',
      subject: 'Physics',
      notes: shortValidNotes,
      questionCount: 15, // requests 15 from only 2 sentences
      difficulty: 'Easy',
    });

    expect(result.success).toBe(true);
    // Should provide honest limitation notice
    expect(result.limitationNotice).toBeDefined();
    expect(result.limitationNotice).toContain('prevent hallucination');
    expect(result.quiz?.questions.length).toBeLessThan(15);
  });
});
