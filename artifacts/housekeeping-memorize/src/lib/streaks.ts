import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'housekeeping_streaks_v1';

export interface StreaksData {
  lastCompletedDate: string | null;
  currentStreak: number;
  longestStreak: number;
  totalDrillsCompleted: number;
  bestSpeedScore: number;
}

const DEFAULT_DATA: StreaksData = {
  lastCompletedDate: null,
  currentStreak: 0,
  longestStreak: 0,
  totalDrillsCompleted: 0,
  bestSpeedScore: 0,
};

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function loadData(): StreaksData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_DATA };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_DATA, ...parsed };
  } catch {
    return { ...DEFAULT_DATA };
  }
}

export function useStreaks() {
  const [data, setData] = useState<StreaksData>(loadData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const today = todayKey();
  const completedToday = data.lastCompletedDate === today;

  const completeDailyDrill = useCallback(() => {
    setData(prev => {
      if (prev.lastCompletedDate === today) return prev;
      const yesterday = yesterdayKey();
      const continued = prev.lastCompletedDate === yesterday;
      const newStreak = continued ? prev.currentStreak + 1 : 1;
      return {
        ...prev,
        lastCompletedDate: today,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        totalDrillsCompleted: prev.totalDrillsCompleted + 1,
      };
    });
  }, [today]);

  const recordSpeedScore = useCallback((score: number) => {
    setData(prev => ({
      ...prev,
      bestSpeedScore: Math.max(prev.bestSpeedScore, score),
    }));
  }, []);

  // Streak resets if user missed yesterday (and today not yet completed).
  const effectiveStreak = (() => {
    if (!data.lastCompletedDate) return 0;
    if (data.lastCompletedDate === today) return data.currentStreak;
    if (data.lastCompletedDate === yesterdayKey()) return data.currentStreak;
    return 0;
  })();

  return {
    data,
    completedToday,
    currentStreak: effectiveStreak,
    longestStreak: data.longestStreak,
    totalDrillsCompleted: data.totalDrillsCompleted,
    bestSpeedScore: data.bestSpeedScore,
    completeDailyDrill,
    recordSpeedScore,
  };
}

// Deterministic daily seed so the same 10 questions appear all day.
export function getDailySeed(): number {
  const t = todayKey();
  let h = 0;
  for (let i = 0; i < t.length; i++) {
    h = (h * 31 + t.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed || 1;
  const rng = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
