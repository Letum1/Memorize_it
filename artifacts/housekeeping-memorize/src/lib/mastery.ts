import { useState, useEffect } from 'react';
import { housekeepingContent, QuestionType } from '../data/content';

export const MAX_MASTERY = 5;

export interface MasteryData {
  [questionId: string]: number;
}

export function useMastery() {
  const [mastery, setMastery] = useState<MasteryData>(() => {
    try {
      const stored = localStorage.getItem('housekeeping_mastery');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('housekeeping_mastery', JSON.stringify(mastery));
  }, [mastery]);

  const recordAnswer = (questionId: string, isCorrect: boolean) => {
    setMastery(prev => {
      const currentLevel = prev[questionId] || 0;
      let newLevel = currentLevel;
      if (isCorrect) {
        newLevel = Math.min(MAX_MASTERY, currentLevel + 1);
      } else {
        newLevel = Math.max(0, currentLevel - 2);
      }
      return { ...prev, [questionId]: newLevel };
    });
  };

  const getOverallMastery = () => {
    if (housekeepingContent.length === 0) return 0;
    const totalPossible = housekeepingContent.length * MAX_MASTERY;
    const currentTotal = housekeepingContent.reduce((sum, q) => sum + (mastery[q.id] || 0), 0);
    return Math.round((currentTotal / totalPossible) * 100);
  };

  const getSlideProgress = (slideNum: number) => {
    const slideQuestions = housekeepingContent.filter(q => q.slideNum === slideNum);
    if (slideQuestions.length === 0) return { mastered: 0, total: 0, percent: 0 };
    
    const mastered = slideQuestions.filter(q => (mastery[q.id] || 0) === MAX_MASTERY).length;
    return {
      mastered,
      total: slideQuestions.length,
      percent: Math.round((mastered / slideQuestions.length) * 100)
    };
  };

  const getSessionItems = (mode: QuestionType | 'mixed', count: number = 15) => {
    let available = [...housekeepingContent];
    if (mode !== 'mixed') {
      available = available.filter(q => q.type === mode);
    }

    if (available.length === 0) return [];

    // Calculate weights based on mastery level. Lower mastery = higher weight.
    // Level 0: weight 10
    // Level 1: weight 8
    // Level 2: weight 6
    // Level 3: weight 4
    // Level 4: weight 2
    // Level 5 (Mastered): weight 1 (only ~10% chance)
    
    const weightedPool = available.map(q => {
      const level = mastery[q.id] || 0;
      let weight = 10 - (level * 2);
      if (level === MAX_MASTERY) weight = 1;
      return { q, weight, random: Math.random() * weight };
    });

    // Sort by randomized weight descending
    weightedPool.sort((a, b) => b.random - a.random);

    return weightedPool.slice(0, count).map(item => item.q);
  };

  const getHardestItems = (count: number = 10) => {
    const ranked = housekeepingContent
      .map(q => ({ q, level: mastery[q.id] || 0, jitter: Math.random() }))
      .filter(r => r.level < MAX_MASTERY)
      .sort((a, b) => {
        if (a.level !== b.level) return a.level - b.level;
        return a.jitter - b.jitter;
      });

    if (ranked.length === 0) {
      const fallback = housekeepingContent
        .map(q => ({ q, jitter: Math.random() }))
        .sort((a, b) => a.jitter - b.jitter);
      return fallback.slice(0, count).map(r => r.q);
    }

    return ranked.slice(0, count).map(r => r.q);
  };

  const getWeakCount = () => {
    return housekeepingContent.filter(q => (mastery[q.id] || 0) < MAX_MASTERY).length;
  };

  const resetProgress = () => {
    setMastery({});
    localStorage.removeItem('housekeeping_mastery');
  };

  return {
    mastery,
    recordAnswer,
    getOverallMastery,
    getSlideProgress,
    getSessionItems,
    getHardestItems,
    getWeakCount,
    resetProgress
  };
}
