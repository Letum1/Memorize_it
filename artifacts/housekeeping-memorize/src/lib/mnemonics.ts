import { useState, useEffect } from 'react';

const STORAGE_KEY = 'housekeeping_mnemonics';

export interface MnemonicData {
  [questionId: string]: string;
}

export function useMnemonics() {
  const [mnemonics, setMnemonics] = useState<MnemonicData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mnemonics));
  }, [mnemonics]);

  const setMnemonic = (id: string, text: string) => {
    setMnemonics(prev => {
      const next = { ...prev };
      if (text.trim()) {
        next[id] = text;
      } else {
        delete next[id];
      }
      return next;
    });
  };

  const getMnemonic = (id: string) => mnemonics[id] || '';

  return { mnemonics, setMnemonic, getMnemonic };
}
