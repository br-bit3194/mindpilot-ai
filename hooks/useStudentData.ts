'use client';

import { useState, useEffect } from 'react';
import { StudentProfile, DailyLogEntry, MentalDNA, DailyCheckIn, StructuredGeminiAnalysis } from '../lib/types';
import { SEEDED_STUDENT_PROFILE, SEEDED_MENTAL_DNA, SEEDED_HISTORY } from '../lib/mockData';

export function useStudentData() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [mentalDNA, setMentalDNA] = useState<MentalDNA | null>(null);
  const [history, setHistory] = useState<DailyLogEntry[]>([]);
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // Initialize and seed storage
  useEffect(() => {
    const localProfile = localStorage.getItem('mindpilot-profile');
    const localDNA = localStorage.getItem('mindpilot-dna');
    const localHistory = localStorage.getItem('mindpilot-history');
    const localCompleted = localStorage.getItem('mindpilot-completed-actions');

    if (!localProfile || !localDNA || !localHistory) {
      // Seed default demo data on first load
      localStorage.setItem('mindpilot-profile', JSON.stringify(SEEDED_STUDENT_PROFILE));
      localStorage.setItem('mindpilot-dna', JSON.stringify(SEEDED_MENTAL_DNA));
      localStorage.setItem('mindpilot-history', JSON.stringify(SEEDED_HISTORY));
      
      setProfile(SEEDED_STUDENT_PROFILE);
      setMentalDNA(SEEDED_MENTAL_DNA);
      setHistory(SEEDED_HISTORY);
    } else {
      setProfile(JSON.parse(localProfile));
      setMentalDNA(JSON.parse(localDNA));
      setHistory(JSON.parse(localHistory));
    }

    if (localCompleted) {
      setCompletedActions(JSON.parse(localCompleted));
    }
    
    setLoading(false);
  }, []);

  const onboardStudent = (newProfile: StudentProfile) => {
    // Generate an initial Mental DNA Profile based on assessment questionnaire
    const initialDNA: MentalDNA = {
      primaryStressors: newProfile.assessment.primaryStressorSources.map(s => 
        s.charAt(0).toUpperCase() + s.slice(1)
      ),
      confidencePattern: 'Consistency-Driven',
      recoveryStyle: 'Action-Oriented',
      motivationType: newProfile.assessment.anxietyLevelSelfAssessment > 7 ? 'Fear Avoidance' : 'Intrinsic Mastery',
      burnoutSusceptibility: newProfile.assessment.anxietyLevelSelfAssessment > 7 ? 'High' : 'Medium',
      emotionalResilience: Math.max(10, 100 - newProfile.assessment.anxietyLevelSelfAssessment * 8),
      preferredInterventionStyle: 'Action Plan'
    };

    localStorage.setItem('mindpilot-profile', JSON.stringify(newProfile));
    localStorage.setItem('mindpilot-dna', JSON.stringify(initialDNA));
    localStorage.setItem('mindpilot-history', JSON.stringify([]));
    localStorage.setItem('mindpilot-completed-actions', JSON.stringify({}));

    setProfile(newProfile);
    setMentalDNA(initialDNA);
    setHistory([]);
    setCompletedActions({});
  };

  const addCheckIn = (
    checkIn: DailyCheckIn,
    analysis: StructuredGeminiAnalysis,
    updatedDNA: MentalDNA
  ) => {
    const newEntry: DailyLogEntry = {
      checkIn,
      analysis,
      mentalDNASnapshot: updatedDNA
    };

    const updatedHistory = [...history, newEntry];

    localStorage.setItem('mindpilot-history', JSON.stringify(updatedHistory));
    localStorage.setItem('mindpilot-dna', JSON.stringify(updatedDNA));

    setHistory(updatedHistory);
    setMentalDNA(updatedDNA);
  };

  const toggleActionCompletion = (planType: string, actionKey: string) => {
    const key = `${planType}-${actionKey}`;
    const updated = {
      ...completedActions,
      [key]: !completedActions[key]
    };
    
    localStorage.setItem('mindpilot-completed-actions', JSON.stringify(updated));
    setCompletedActions(updated);
  };

  const resetToDemoMode = () => {
    localStorage.setItem('mindpilot-profile', JSON.stringify(SEEDED_STUDENT_PROFILE));
    localStorage.setItem('mindpilot-dna', JSON.stringify(SEEDED_MENTAL_DNA));
    localStorage.setItem('mindpilot-history', JSON.stringify(SEEDED_HISTORY));
    localStorage.setItem('mindpilot-completed-actions', JSON.stringify({}));

    setProfile(SEEDED_STUDENT_PROFILE);
    setMentalDNA(SEEDED_MENTAL_DNA);
    setHistory(SEEDED_HISTORY);
    setCompletedActions({});
  };

  return {
    profile,
    mentalDNA,
    history,
    completedActions,
    loading,
    onboardStudent,
    addCheckIn,
    toggleActionCompletion,
    resetToDemoMode,
  };
}
