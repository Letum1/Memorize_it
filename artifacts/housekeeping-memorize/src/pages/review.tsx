import { useState, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { slideNotes, SlideNote } from "@/data/slideNotes";
import { useStudyNotes } from "@/lib/useStudyNotes";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, List, X, Pencil, Check, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";

const CHAPTER_IMAGES: Record<number, string> = {
  3:  "/book-org-chart.jpeg",
  5:  "/book-checkout.jpeg",
  7:  "/book-turndown.jpeg",
  8:  "/book-room-codes.jpeg",
  11: "/book-maintenance-codes.jpeg",
  12: "/book-room-types.jpeg",
  13: "/book-cart.jpeg",
  15: "/diagram-bed.jpeg",
  18: "/diagram-floor-polisher.jpeg",
  19: "/diagram-vacuum.jpeg",
  20: "/book-mur.jpeg",
  23: "/book-core-competencies.jpeg",
};

const CHAPTER_COLORS: Record<number, string> = {
  1:  "from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20",
  2:  "from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20",
  3:  "from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20",
  4:  "from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20",
  5:  "from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20",
  6:  "from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20",
  7:  "from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20",
  8:  "from-cyan-50 to-sky-50 dark:from-cyan-950/20 dark:to-sky-950/20",
  9:  "from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20",
  10: "from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20",
};

function chapterColor(n: number) {
  return CHAPTER_COLORS[n] || CHAPTER_COLORS[(n % 10) || 1];
}

function itemKey(slideNum: number, type: "item" | "group", groupIdx: number, itemIdx: number) {
  return type === "item"
    ? `s${slideNum}-i${itemIdx}`
    : `s${slideNum}-g${groupIdx}-i${itemIdx}`;
}

function NoteEditor({
  value,
  onSave,
  onCancel,
}: {
  value: string;
  onSave: (v: string) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState(value);
  return (
    <div className="mt-2 space-y-1.5" onClick={(e) => e.stopPropagation()}>
      <textarea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add your note…"
        rows={2}
        className="w-full px-3 py-2 text-sm rounded-lg border-2 border-primary/40 bg-background resize-none outline-none focus:border-primary"
      />
      <div className="flex gap-2">
        <button
          onClick={() => onSave(text)}
          className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Check className="w-3 h-3" /> Save
        </button>
        <button
          onClick={onCancel}
          className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg transition-colors"
        >
          Cancel
        </button>
        {value && (
          <button
            onClick={() => onSave("")}
            className="text-xs text-destructive/70 hover:text-destructive px-3 py-1.5 rounded-lg transition-colors ml-auto"
          >
            Remove note
          </button>
        )}
      </div>
    </div>
  );
}

function HighlightableItem({
  label,
  sub,
  noteKey,
  number,
  isHighlighted,
  note,
  onToggle,
  onNote,
}: {
  label: string;
  sub?: string[];
  noteKey: string;
  number?: number;
  isHighlighted: boolean;
  note: string;
  onToggle: () => void;
  onNote: (text: string) => void;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <div
      onClick={onToggle}
      className={cn(
        "flex gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none",
        isHighlighted
          ? "border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700/50"
          : "border-border/60 bg-card hover:border-primary/30"
      )}
    >
      {number !== undefined && (
        <span className={cn(
          "w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors",
          isHighlighted ? "bg-amber-400/30 text-amber-700 dark:text-amber-300" : "bg-primary/10 text-primary"
        )}>
          {number}
        </span>
      )}
      {number === undefined && (
        <span className={cn(
          "mt-2 shrink-0 text-sm transition-colors",
          isHighlighted ? "text-amber-500" : "text-primary"
        )}>•</span>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn(
            "font-medium leading-snug text-sm transition-colors",
            isHighlighted ? "text-amber-900 dark:text-amber-100" : "text-foreground"
          )}>
            {label}
          </p>
          {isHighlighted && (
            <button
              onClick={(e) => { e.stopPropagation(); setEditing(true); }}
              className="shrink-0 p-1 rounded-md hover:bg-amber-200/60 dark:hover:bg-amber-800/40 transition-colors"
            >
              <Pencil className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            </button>
          )}
        </div>
        {sub && sub.length > 0 && (
          <ul className="mt-1.5 space-y-1">
            {sub.map((s, j) => (
              <li key={j} className={cn(
                "text-sm pl-3 border-l-2 leading-relaxed transition-colors",
                isHighlighted ? "border-amber-300 text-amber-800/70 dark:text-amber-200/70" : "border-primary/30 text-muted-foreground"
              )}>
                {s}
              </li>
            ))}
          </ul>
        )}
        {note && !editing && (
          <div className="mt-2 flex items-start gap-1.5">
            <StickyNote className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs italic text-amber-700 dark:text-amber-300 leading-relaxed">{note}</p>
          </div>
        )}
        {editing && (
          <NoteEditor
            value={note}
            onSave={(v) => { onNote(v); setEditing(false); }}
            onCancel={() => setEditing(false)}
          />
        )}
      </div>
    </div>
  );
}

function ChapterContent({
  slide,
  isHighlighted,
  getNote,
  toggleHighlight,
  setNote,
}: {
  slide: SlideNote;
  isHighlighted: (key: string) => boolean;
  getNote: (key: string) => string;
  toggleHighlight: (key: string) => void;
  setNote: (key: string, text: string) => void;
}) {
  const image = CHAPTER_IMAGES[slide.slideNum];

  return (
    <div className="space-y-6">
      {image && (
        <div className="rounded-2xl overflow-hidden border border-border/50 shadow-sm">
          <img src={image} alt={slide.title} className="w-full object-contain" />
        </div>
      )}

      {slide.intro && (
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-center">
          <p className="font-semibold text-foreground leading-relaxed">{slide.intro}</p>
        </div>
      )}

      {slide.items && slide.items.length > 0 && (
        <div className="space-y-2">
          {slide.items.map((item, i) => {
            const k = itemKey(slide.slideNum, "item", 0, i);
            return (
              <HighlightableItem
                key={i}
                noteKey={k}
                number={i + 1}
                label={item.label}
                sub={item.sub}
                isHighlighted={isHighlighted(k)}
                note={getNote(k)}
                onToggle={() => toggleHighlight(k)}
                onNote={(t) => setNote(k, t)}
              />
            );
          })}
        </div>
      )}

      {slide.groups && slide.groups.length > 0 && (
        <div className="space-y-4">
          {slide.groups.map((group, gi) => (
            <div key={gi} className="rounded-xl border border-border/60 overflow-hidden">
              {group.heading && (
                <div className="px-4 py-2.5 bg-primary/10 border-b border-primary/15">
                  <h3 className="font-bold text-primary text-sm uppercase tracking-wide">
                    {group.heading}
                  </h3>
                </div>
              )}
              <div className="p-2 space-y-1.5 bg-card">
                {group.items.map((item, i) => {
                  const k = itemKey(slide.slideNum, "group", gi, i);
                  return (
                    <HighlightableItem
                      key={i}
                      noteKey={k}
                      label={item.label}
                      sub={item.sub}
                      isHighlighted={isHighlighted(k)}
                      note={getNote(k)}
                      onToggle={() => toggleHighlight(k)}
                      onNote={(t) => setNote(k, t)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-center text-muted-foreground/60 pt-2">
        Tap any item to highlight it · Tap the pencil to add a note
      </p>
    </div>
  );
}

function TableOfContents({
  slides,
  currentIdx,
  onSelect,
  onClose,
}: {
  slides: SlideNote[];
  currentIdx: number;
  onSelect: (i: number) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="absolute right-0 top-0 bottom-0 w-full max-w-xs bg-background border-l shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-background/95 backdrop-blur border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <List className="w-4 h-4 text-primary" />
            <span className="font-bold text-foreground">Contents</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <div className="p-3 space-y-1">
          {slides.map((s, i) => (
            <button
              key={s.slideNum}
              onClick={() => { onSelect(i); onClose(); }}
              className={cn(
                "w-full text-left px-3 py-3 rounded-xl transition-colors flex gap-3 items-start",
                i === currentIdx
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground"
              )}
            >
              <span className={cn(
                "text-xs font-bold shrink-0 mt-0.5 w-6 text-right tabular-nums",
                i === currentIdx ? "text-primary-foreground/70" : "text-muted-foreground"
              )}>
                {s.slideNum}
              </span>
              <span className="text-sm font-medium leading-snug">{s.title}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Review() {
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showTOC, setShowTOC] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const { toggleHighlight, setNote, isHighlighted, getNote, highlightCount, noteCount } = useStudyNotes();

  const slide = slideNotes[idx];
  const total = slideNotes.length;

  const goTo = (newIdx: number) => {
    if (newIdx < 0 || newIdx >= total) return;
    setDirection(newIdx > idx ? 1 : -1);
    setIdx(newIdx);
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <header
        className="border-b sticky top-0 bg-background/95 backdrop-blur z-10"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link href="/">
            <Button variant="outline" size="default" className="h-10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen className="w-4 h-4 text-primary shrink-0" />
            <span className="text-sm font-semibold text-foreground truncate hidden sm:inline">
              Housekeeping Handbook
            </span>
            {(highlightCount > 0 || noteCount > 0) && (
              <div className="flex items-center gap-1">
                {highlightCount > 0 && (
                  <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-full">
                    {highlightCount} ★
                  </span>
                )}
                {noteCount > 0 && (
                  <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full">
                    {noteCount} 📝
                  </span>
                )}
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="default"
            className="h-10 gap-2 shrink-0"
            onClick={() => setShowTOC(true)}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Contents</span>
          </Button>
        </div>
      </header>

      <main ref={mainRef} className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 pb-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.article
              key={slide.slideNum}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              <div className={cn(
                "mt-6 mb-5 rounded-2xl p-6 bg-gradient-to-br text-center",
                chapterColor(slide.slideNum)
              )}>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Chapter {slide.slideNum} of {total}
                </p>
                <h1 className="text-2xl font-bold text-foreground leading-tight">
                  {slide.title}
                </h1>
              </div>

              <ChapterContent
                slide={slide}
                isHighlighted={isHighlighted}
                getNote={getNote}
                toggleHighlight={toggleHighlight}
                setNote={setNote}
              />

              <div className="mt-8 grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 flex-col gap-0.5"
                  onClick={() => goTo(idx - 1)}
                  disabled={idx === 0}
                >
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </div>
                  {idx > 0 && (
                    <span className="text-[10px] text-muted-foreground line-clamp-1 px-2">
                      {slideNotes[idx - 1].title}
                    </span>
                  )}
                </Button>
                <Button
                  size="lg"
                  className="h-14 flex-col gap-0.5"
                  onClick={() => goTo(idx + 1)}
                  disabled={idx === total - 1}
                >
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  {idx < total - 1 && (
                    <span className="text-[10px] text-primary-foreground/70 line-clamp-1 px-2">
                      {slideNotes[idx + 1].title}
                    </span>
                  )}
                </Button>
              </div>

              <div className="mt-5 flex items-center gap-2 justify-center flex-wrap">
                {slideNotes.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={cn(
                      "rounded-full transition-all",
                      i === idx
                        ? "w-5 h-2 bg-primary"
                        : "w-2 h-2 bg-muted-foreground/25 hover:bg-muted-foreground/50"
                    )}
                  />
                ))}
              </div>

              <div className="mt-3 text-center pb-4">
                <span className="text-xs text-muted-foreground tabular-nums">
                  {idx + 1} of {total}
                </span>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {showTOC && (
          <TableOfContents
            slides={slideNotes}
            currentIdx={idx}
            onSelect={goTo}
            onClose={() => setShowTOC(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
