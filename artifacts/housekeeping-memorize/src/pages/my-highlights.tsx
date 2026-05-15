import { useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Star, StickyNote, BookOpen } from "lucide-react";
import { slideNotes, SlideNote, NoteItem } from "@/data/slideNotes";

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

interface ResolvedItem {
  key: string;
  label: string;
  note: string;
}

interface ResolvedChapter {
  slideNum: number;
  title: string;
  items: ResolvedItem[];
}

function resolveLabel(slide: SlideNote, key: string): string | null {
  const itemMatch = key.match(/^s\d+-i(\d+)$/);
  const groupMatch = key.match(/^s\d+-g(\d+)-i(\d+)$/);

  if (itemMatch) {
    const i = parseInt(itemMatch[1]);
    const item = slide.items?.[i];
    return item?.label ?? null;
  }
  if (groupMatch) {
    const g = parseInt(groupMatch[1]);
    const i = parseInt(groupMatch[2]);
    const item = slide.groups?.[g]?.items?.[i];
    return item?.label ?? null;
  }
  return null;
}

export default function MyHighlights() {
  const store = useMemo(() => loadStore(), []);

  const chapters = useMemo<ResolvedChapter[]>(() => {
    const slideMap: Record<number, SlideNote> = {};
    for (const s of slideNotes) slideMap[s.slideNum] = s;

    const bySlide: Record<number, ResolvedItem[]> = {};

    for (const key of store.highlights) {
      const slideMatch = key.match(/^s(\d+)-/);
      if (!slideMatch) continue;
      const slideNum = parseInt(slideMatch[1]);
      const slide = slideMap[slideNum];
      if (!slide) continue;

      const label = resolveLabel(slide, key);
      if (!label) continue;

      if (!bySlide[slideNum]) bySlide[slideNum] = [];
      bySlide[slideNum].push({
        key,
        label,
        note: store.notes[key] ?? "",
      });
    }

    return Object.entries(bySlide)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([slideNumStr, items]) => {
        const slideNum = parseInt(slideNumStr);
        return {
          slideNum,
          title: slideMap[slideNum]?.title ?? `Chapter ${slideNum}`,
          items,
        };
      });
  }, [store]);

  const totalHighlights = store.highlights.length;
  const totalNotes = Object.keys(store.notes).length;

  return (
    <div className="min-h-[100dvh] bg-background pb-16">
      <div className="max-w-2xl mx-auto p-4 pt-8 space-y-6">
        <header className="flex items-center gap-3">
          <Link href="/">
            <button className="p-2 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight">My Highlights</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {totalHighlights} highlight{totalHighlights !== 1 ? "s" : ""} · {totalNotes} note{totalNotes !== 1 ? "s" : ""}
            </p>
          </div>
          <Link href="/review">
            <button className="flex items-center gap-1.5 text-xs text-primary font-medium px-3 py-1.5 rounded-full border border-primary/30 hover:bg-primary/10 transition-colors">
              <BookOpen className="w-3.5 h-3.5" />
              Open Book
            </button>
          </Link>
        </header>

        {chapters.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center py-24 space-y-4"
          >
            <div className="p-5 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <Star className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">No highlights yet</h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Open the Review book and tap any item to highlight it. Your highlights will appear here.
            </p>
            <Link href="/review">
              <button className="mt-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
                Go to Review Book
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {chapters.map((chapter, chIdx) => (
              <motion.div
                key={chapter.slideNum}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: chIdx * 0.04 }}
                className="rounded-2xl border bg-card overflow-hidden"
              >
                <div className="px-4 py-3 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200/60 dark:border-amber-800/40 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                      Chapter {chapter.slideNum}
                    </p>
                    <h2 className="font-semibold text-foreground text-sm leading-snug">{chapter.title}</h2>
                  </div>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full">
                    {chapter.items.length} ★
                  </span>
                </div>

                <div className="divide-y divide-border">
                  {chapter.items.map((item) => (
                    <div key={item.key} className="px-4 py-3 space-y-1.5">
                      <div className="flex items-start gap-2">
                        <Star className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0 fill-amber-400" />
                        <p className="text-sm text-foreground leading-snug">{item.label}</p>
                      </div>
                      {item.note && (
                        <div className="ml-5 flex items-start gap-2 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200/60 dark:border-yellow-800/40 rounded-lg px-3 py-2">
                          <StickyNote className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                          <p className="text-xs text-yellow-900 dark:text-yellow-300 leading-snug">{item.note}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
