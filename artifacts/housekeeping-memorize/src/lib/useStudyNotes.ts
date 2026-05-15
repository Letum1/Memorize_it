import { useState, useCallback } from "react";

const STORAGE_KEY = "study-notes-v1";

interface NotesStore {
  highlights: string[];
  notes: Record<string, string>;
}

function loadStore(): NotesStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { highlights: [], notes: {} };
    return JSON.parse(raw) as NotesStore;
  } catch {
    return { highlights: [], notes: {} };
  }
}

function saveStore(store: NotesStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {}
}

export function useStudyNotes() {
  const [store, setStore] = useState<NotesStore>(loadStore);

  const toggleHighlight = useCallback((key: string) => {
    setStore((prev) => {
      const already = prev.highlights.includes(key);
      const highlights = already
        ? prev.highlights.filter((k) => k !== key)
        : [...prev.highlights, key];
      const next = { ...prev, highlights };
      saveStore(next);
      return next;
    });
  }, []);

  const setNote = useCallback((key: string, text: string) => {
    setStore((prev) => {
      const notes = { ...prev.notes };
      if (text.trim()) {
        notes[key] = text.trim();
      } else {
        delete notes[key];
      }
      const next = { ...prev, notes };
      saveStore(next);
      return next;
    });
  }, []);

  const isHighlighted = useCallback(
    (key: string) => store.highlights.includes(key),
    [store.highlights]
  );

  const getNote = useCallback(
    (key: string) => store.notes[key] ?? "",
    [store.notes]
  );

  const highlightCount = store.highlights.length;
  const noteCount = Object.keys(store.notes).length;

  return { toggleHighlight, setNote, isHighlighted, getNote, highlightCount, noteCount };
}
