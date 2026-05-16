import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, RotateCcw, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { oralQuestions, OralQuestion } from "@/data/oralQuestions";

function QuestionCard({
  q,
  practiceMode,
}: {
  q: OralQuestion;
  practiceMode: boolean;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border bg-card overflow-hidden"
    >
      <button
        className="w-full text-left px-5 py-4 flex items-start gap-3"
        onClick={() => setRevealed((v) => !v)}
      >
        <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center justify-center">
          {q.id}
        </span>
        <p className="flex-1 text-sm font-semibold text-foreground leading-snug pr-2">
          {q.question}
        </p>
        {revealed ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        )}
      </button>

      <AnimatePresence>
        {(!practiceMode || revealed) && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 pt-1 border-t bg-emerald-50/60 dark:bg-emerald-950/20">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-2">
                Answer:
              </p>
              <ul className="space-y-1.5">
                {q.answer.map((line, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground leading-snug">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {practiceMode && !revealed && (
        <div className="px-5 pb-4">
          <button
            onClick={() => setRevealed(true)}
            className="w-full py-2 rounded-xl border border-emerald-300/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            Reveal Answer
          </button>
        </div>
      )}
    </motion.div>
  );
}

type ViewMode = "all" | "quiz";

interface QuizState {
  items: OralQuestion[];
  idx: number;
  revealed: boolean;
  score: number;
  done: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function OralQuestions() {
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [practiceMode, setPracticeMode] = useState(false);
  const [quiz, setQuiz] = useState<QuizState | null>(null);

  function startQuiz() {
    setQuiz({
      items: shuffle(oralQuestions),
      idx: 0,
      revealed: false,
      score: 0,
      done: false,
    });
    setViewMode("quiz");
  }

  function revealQuiz() {
    setQuiz((q) => q ? { ...q, revealed: true } : q);
  }

  function markQuiz(correct: boolean) {
    setQuiz((q) => {
      if (!q) return q;
      const newScore = q.score + (correct ? 1 : 0);
      const nextIdx = q.idx + 1;
      if (nextIdx >= q.items.length) {
        return { ...q, score: newScore, done: true };
      }
      return { ...q, score: newScore, idx: nextIdx, revealed: false };
    });
  }

  const current = quiz ? quiz.items[quiz.idx] : null;
  const total = quiz ? quiz.items.length : 0;
  const pct = quiz && quiz.done ? Math.round((quiz.score / total) * 100) : 0;

  return (
    <div className="min-h-[100dvh] bg-background pb-20">
      <div className="max-w-2xl mx-auto p-4 pt-8 space-y-5">

        <header className="flex items-center gap-3">
          <Link href="/">
            <button className="p-2 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight">Oral Questioning</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              HK NC II — Batch 8 · {oralQuestions.length} questions
            </p>
          </div>
          {viewMode === "all" && (
            <button
              onClick={() => { setPracticeMode((v) => !v); }}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                practiceMode
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              {practiceMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {practiceMode ? "Practice ON" : "Practice"}
            </button>
          )}
        </header>

        {/* Tab switcher */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("all")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
              viewMode === "all"
                ? "bg-rose-600 text-white border-rose-600"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Review All
          </button>
          <button
            onClick={startQuiz}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
              viewMode === "quiz"
                ? "bg-rose-600 text-white border-rose-600"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Quiz Mode
          </button>
        </div>

        {/* --- REVIEW ALL MODE --- */}
        {viewMode === "all" && (
          <div className="space-y-3">
            {practiceMode && (
              <div className="flex items-center gap-3 text-xs text-muted-foreground bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl px-4 py-2.5">
                <Eye className="w-4 h-4 text-emerald-500 shrink-0" />
                Practice mode — answers are hidden. Tap a question to reveal.
              </div>
            )}
            {oralQuestions.map((q) => (
              <QuestionCard key={q.id} q={q} practiceMode={practiceMode} />
            ))}
          </div>
        )}

        {/* --- QUIZ MODE --- */}
        {viewMode === "quiz" && quiz && !quiz.done && current && (
          <AnimatePresence mode="wait">
            <motion.div
              key={quiz.idx}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.18 }}
              className="space-y-4"
            >
              <div className="w-full bg-muted/40 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-300"
                  style={{ width: `${(quiz.idx / total) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Question {quiz.idx + 1} of {total}</span>
                <span className="font-semibold text-foreground">{quiz.score} correct so far</span>
              </div>

              <div className="rounded-2xl border bg-card p-5 space-y-3">
                <span className="inline-flex w-7 h-7 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-bold items-center justify-center">
                  {current.id}
                </span>
                <p className="text-base font-semibold text-foreground leading-snug">
                  {current.question}
                </p>
              </div>

              {!quiz.revealed ? (
                <button
                  onClick={revealQuiz}
                  className="w-full py-3.5 rounded-xl border-2 border-emerald-400/60 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Reveal Answer
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="rounded-xl border border-emerald-300/60 bg-emerald-50 dark:bg-emerald-950/20 p-4 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                      Answer:
                    </p>
                    <ul className="space-y-1.5">
                      {current.answer.map((line, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground leading-snug">{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-xs text-center text-muted-foreground font-medium">How did you do?</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => markQuiz(false)}
                      className="py-3.5 rounded-xl border-2 border-rose-300/60 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 font-semibold flex items-center justify-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      Missed
                    </button>
                    <button
                      onClick={() => markQuiz(true)}
                      className="py-3.5 rounded-xl border-2 border-emerald-400/60 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 transition-colors"
                    >
                      Got it!
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* --- QUIZ DONE --- */}
        {viewMode === "quiz" && quiz?.done && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center gap-6 pt-8"
          >
            <div className={`p-6 rounded-full text-5xl ${pct >= 80 ? "bg-emerald-100 dark:bg-emerald-950/30" : pct >= 50 ? "bg-yellow-100 dark:bg-yellow-950/30" : "bg-rose-100 dark:bg-rose-950/30"}`}>
              {pct >= 80 ? "🏆" : pct >= 50 ? "💪" : "📖"}
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">{quiz.score} / {total}</h2>
              <p className="text-sm text-muted-foreground">
                {pct >= 90 ? "Outstanding! You're ready." :
                 pct >= 70 ? "Good job — a few more reviews and you've got it." :
                 pct >= 50 ? "Getting there — review the missed ones again." :
                 "Study the answers a bit more, then try again."}
              </p>
            </div>
            <div className="w-full grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setViewMode("all")}
                className="py-3.5 rounded-xl border font-semibold text-sm hover:bg-muted transition-colors"
              >
                Review All
              </button>
              <button
                onClick={startQuiz}
                className="py-3.5 rounded-xl bg-rose-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-rose-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
