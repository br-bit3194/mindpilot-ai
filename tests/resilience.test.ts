import { describe, it, expect } from 'vitest';
import { localAnalyzeCheckIn, recalculateMentalDNA } from '../lib/gemini';
import { getInterventionForStudent } from '../lib/mockData';
import { DailyCheckIn, StudentProfile } from '../lib/types';

describe('MindPilot AI Resilience Calculations', () => {
  const mockProfile: StudentProfile = {
    name: 'Test Pilot',
    academic: {
      examType: 'JEE',
      targetScore: '280',
      examDate: '2026-09-15',
      studyHoursPerDay: 11,
    },
    lifestyle: {
      sleepHours: 6,
      exerciseHabits: 'Occasional',
      coachingStatus: 'Offline Coaching',
    },
    assessment: {
      primaryStressorSources: ['fear of failure', 'parent expectations'],
      anxietyLevelSelfAssessment: 7,
      supportSystemRating: 5,
    },
    createdAt: new Date().toISOString(),
  };

  it('correctly extracts subject and lifestyle triggers from journal texts', () => {
    const checkIn: DailyCheckIn = {
      id: 'test-1',
      date: '2026-06-13',
      mood: 'anxious',
      energyLevel: 5,
      stressLevel: 8,
      sleepHours: 5,
      studyHours: 12,
      journalEntry: "I'm having a massive physics backlog problem, and my mother kept comparing me. I'm barely sleeping.",
    };

    const analysis = localAnalyzeCheckIn(checkIn, mockProfile);

    // Should detect Physics, Parent expectations, and Sleep issues
    expect(analysis.stressTriggers).toContain('Physics');
    expect(analysis.stressTriggers).toContain('Parent Expectations');
    expect(analysis.stressTriggers).toContain('Sleep Deprivation');
    expect(analysis.sleepIssues).toBe(true);
    expect(analysis.parentPressure).toBe(true);
  });

  it('calculates burnout risk accurately based on hours and stress levels', () => {
    const lowStressCheckIn: DailyCheckIn = {
      id: 'test-2',
      date: '2026-06-13',
      mood: 'good',
      energyLevel: 8,
      stressLevel: 2,
      sleepHours: 8,
      studyHours: 8,
      journalEntry: "Good day, covered mathematics calculus formulas, slept well.",
    };

    const highStressCheckIn: DailyCheckIn = {
      id: 'test-3',
      date: '2026-06-13',
      mood: 'exhausted',
      energyLevel: 3,
      stressLevel: 9,
      sleepHours: 4.5,
      studyHours: 13,
      journalEntry: "So tired. Backlog in physics rotatory motion is killing me. Slept late.",
    };

    const lowAnalysis = localAnalyzeCheckIn(lowStressCheckIn, mockProfile);
    const highAnalysis = localAnalyzeCheckIn(highStressCheckIn, mockProfile);

    expect(lowAnalysis.burnoutRisk).toBeLessThan(40);
    expect(highAnalysis.burnoutRisk).toBeGreaterThan(70);
  });

  it('selects the correct intervention plan style depending on burnout metrics', () => {
    // Should trigger Burnout plan if burnout risk >= 60
    const burnoutPlan = getInterventionForStudent(75, ['Physics'], 35);
    expect(burnoutPlan.type).toBe('burnout');

    // Should trigger Parent pressure plan if parent expectation triggers are active and risk is low
    const parentPlan = getInterventionForStudent(45, ['Parent Expectations'], 50);
    expect(parentPlan.type).toBe('parent-pressure');

    // Should trigger Exam panic / subject anxiety plan
    const subjectAnxietyPlan = getInterventionForStudent(45, ['Physics Textbook'], 30);
    expect(subjectAnxietyPlan.type).toBe('low-confidence');
  });

  it('dynamically updates Mental DNA profile resilience indices across daily logs', () => {
    const checkIn: DailyCheckIn = {
      id: 'test-4',
      date: '2026-06-13',
      mood: 'anxious',
      energyLevel: 4,
      stressLevel: 8,
      sleepHours: 5,
      studyHours: 12,
      journalEntry: "Hard Physics paper, failed mock test today. Feeling low.",
    };

    const analysis = localAnalyzeCheckIn(checkIn, mockProfile);
    const historyEntry = { checkIn, analysis, mentalDNASnapshot: {} as any };

    const updatedDNA = recalculateMentalDNA(mockProfile, [historyEntry]);

    // Resonance should decrease under pressure, and style should match
    expect(updatedDNA.burnoutSusceptibility).toBe('High');
    expect(updatedDNA.confidencePattern).toBe('Volatile / Vulnerable');
  });
});
