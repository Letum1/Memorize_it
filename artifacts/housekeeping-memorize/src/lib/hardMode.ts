import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'housekeeping_hard_mode_v1';

function loadHardMode(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === '1' || raw === 'true';
  } catch {
    return false;
  }
}

export function useHardMode() {
  const [enabled, setEnabled] = useState<boolean>(loadHardMode);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
    } catch {
      // ignore
    }
  }, [enabled]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setEnabled(e.newValue === '1' || e.newValue === 'true');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggle = useCallback(() => setEnabled(v => !v), []);

  return { hardMode: enabled, setHardMode: setEnabled, toggleHardMode: toggle };
}

export function isHardModeEnabled(): boolean {
  return loadHardMode();
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[.,!?;:'"()\-]/g, '');
}

export function looseTextMatch(input: string, target: string): boolean {
  return normalize(input) === normalize(target);
}
