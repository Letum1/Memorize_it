import { useState, useMemo, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, XCircle, RotateCcw, Trophy, Eye } from "lucide-react";
import { loadNames, buildScript, buildQuizItems, hasConfiguredNames, QuizItem, Role, ButlerNames } from "@/lib/butlerScript";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const QUIZ_COUNT = 10;

type Phase = "start" | "quiz" | "done";

interface Result {
  item: QuizItem;
  userText: string;
  correct: boolean | null;
}

function actorNameForRole(role: Role, names: ButlerNames): string {
  if (role === "butler") return names.butlerName;
  if (role === "receptionist") return names.sameActor ? names.butlerName : names.receptionistName;
  return "";
}

export default function ButlerQuiz() {
  const names = useMemo(() => loadNames(), []);

  // If names aren't configured, redirect to the review page where the settings panel auto-opens
  if (!hasConfiguredNames()) {
    window.location.href = "/butler-review";
    return null;
  }

  const allItems = useMemo(() => {
    const script = buildScript(names);
    return buildQuizItems(script);
  }, [names]);

  const [phase, setPhase] = useState<Phase>("start");
  const [items, setItems] = useState<QuizItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userText, setUserText] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function startQuiz() {
    const picked = shuffle(allItems).slice(0, Math.min(QUIZ_COUNT, allItems.length));
    setItems(picked);
    setCurrentIdx(0);
    setUserText("");
    setRevealed(false);
    setResults([]);
    setPhase("quiz");
    setTimeout(() => textareaRef.current?.focus(), 100);
  }

  function revealAnswer() {
    setRevealed(true);
  }

  function markResult(correct: boolean) {
    const item = items[currentIdx];
    const next: Result = { item, userText, correct };
    const newResults = [...results, next];
    setResults(newResults);

    if (currentIdx + 1 >= items.length) {
      setPhase("done");
    } else {
      setCurrentIdx((i) => i + 1);
      setUserText("");
      setRevealed(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }

  const current = items[currentIdx];
  const score = results.filter((r) => r.correct).length;
  const total = items.length;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="min-h-[100dvh] bg-background pb-16">
      <div className="max-w-2xl mx-auto p-4 pt-8 space-y-5">

        <header className="flex items-center gap-3">
          <Link href="/butler-review">
            <button className="p-2 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight">Butler Quiz</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {names.butlerName} · {names.hotelName}
            </p>
          </div>
          {phase === "quiz" && (
            <span className="text-sm font-semibold text-foreground tabular-nums">
              {currentIdx + 1} / {total}
            </span>
          )}
        </header>

        {phase === "start" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center gap-6 pt-12"
          >
            <div className="p-6 bg-sky-100 dark:bg-sky-950/30 rounded-full">
              <BriefcaseBusiness className="w-12 h-12 text-sky-600 dark:text-sky-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">Test Your Butler Lines</h2>
              <p className="text-sm text-muted-foreground max-w-xs">
                You'll get {Math.min(QUIZ_COUNT, allItems.length)} random butler lines. Read the context, type what you think {names.butlerName} says, then reveal and self-grade.
              </p>
            </div>
            <div className="w-full space-y-2 text-left bg-sky-50 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-800/40 rounded-2xl p-4">
              <p className="text-xs font-semibold text-sky-700 dark:text-sky-300 uppercase tracking-wider">How it works</p>
              <ul className="text-sm text-muted-foreground space-y-1.5 list-none">
                <li>📍 Scene + cue line shown for context</li>
                <li>✏️ First few words of line shown as prompt</li>
                <li>💬 Type the complete line from memory</li>
                <li>👁️ Tap "Reveal" to see the full answer</li>
                <li>✅ Mark yourself Correct or Missed</li>
              </ul>
            </div>
            <button
              onClick={startQuiz}
              className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-base font-bold transition-colors"
            >
              Start Quiz
            </button>
            <Link href="/butler-review">
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Review the script first →
              </button>
            </Link>
          </motion.div>
        )}

        {phase === "quiz" && current && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.18 }}
              className="space-y-4"
            >
              <div className="w-full bg-muted/40 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIdx) / total) * 100}%` }}
                />
              </div>

              <div className="rounded-2xl border bg-card p-4 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                  Scene: {current.sceneTitle}
                </p>
                <div className="bg-muted/50 rounded-xl px-3 py-2.5">
                  <p className="text-xs text-muted-foreground italic leading-snug">{current.cueText}</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg shrink-0">{current.role === "receptionist" ? "🗂️" : "🫡"}</span>
                  <p className="text-sm font-semibold text-foreground leading-snug">
                    {actorNameForRole(current.role, names)}{" "}
                    <span className={`text-[11px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${current.role === "receptionist" ? "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300" : "bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300"}`}>
                      {current.role === "receptionist" ? "Receptionist" : "Butler"}
                    </span>
                    {": "}
                    <span className="text-sky-700 dark:text-sky-300">"{current.promptWords}…"</span>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Your answer — type the complete line:
                </label>
                <textarea
                  ref={textareaRef}
                  value={userText}
                  onChange={(e) => setUserText(e.target.value)}
                  disabled={revealed}
                  rows={4}
                  placeholder={`"${current.promptWords}…"`}
                  className="w-full border-2 rounded-xl px-3 py-2.5 text-sm bg-background resize-none focus:outline-none focus:border-sky-400 transition-colors placeholder:text-muted-foreground/50 disabled:opacity-70"
                />
              </div>

              {!revealed ? (
                <button
                  onClick={revealAnswer}
                  className="w-full py-3.5 rounded-xl border-2 border-sky-400/60 text-sky-700 dark:text-sky-300 font-semibold flex items-center justify-center gap-2 hover:bg-sky-50 dark:hover:bg-sky-950/20 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Reveal Answer
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="rounded-xl border border-emerald-300/60 bg-emerald-50 dark:bg-emerald-950/20 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-1.5">
                      Full answer:
                    </p>
                    <p className="text-sm text-emerald-900 dark:text-emerald-200 leading-relaxed">
                      "{current.fullLine}"
                    </p>
                  </div>
                  <p className="text-xs text-center text-muted-foreground font-medium">
                    How did you do?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => markResult(false)}
                      className="py-3.5 rounded-xl border-2 border-rose-300/60 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 font-semibold flex items-center justify-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Missed
                    </button>
                    <button
                      onClick={() => markResult(true)}
                      className="py-3.5 rounded-xl border-2 border-emerald-400/60 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Got it!
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {phase === "done" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center gap-6 pt-8"
          >
            <div className={`p-6 rounded-full ${pct >= 80 ? "bg-emerald-100 dark:bg-emerald-950/30" : pct >= 50 ? "bg-yellow-100 dark:bg-yellow-950/30" : "bg-rose-100 dark:bg-rose-950/30"}`}>
              <Trophy className={`w-12 h-12 ${pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-yellow-600" : "text-rose-600"}`} />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-foreground">{score} / {total}</h2>
              <p className="text-sm text-muted-foreground">
                {pct >= 90 ? "Excellent! You know the script cold." :
                 pct >= 70 ? "Good job! A few more reviews and you'll nail it." :
                 pct >= 50 ? "Getting there — keep practicing the script." :
                 "Review the script a few more times, then try again."}
              </p>
            </div>

            <div className="w-full space-y-2">
              {results.map((r, i) => (
                <div
                  key={i}
                  className={`rounded-xl border px-3 py-2.5 text-left flex items-start gap-2.5 ${
                    r.correct
                      ? "border-emerald-200/60 bg-emerald-50/50 dark:bg-emerald-950/10"
                      : "border-rose-200/60 bg-rose-50/50 dark:bg-rose-950/10"
                  }`}
                >
                  <span className="mt-0.5 shrink-0">
                    {r.correct
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      : <XCircle className="w-4 h-4 text-rose-500" />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{r.item.sceneTitle}</p>
                    <p className="text-xs text-foreground leading-snug mt-0.5 line-clamp-2">"{r.item.fullLine}"</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full grid grid-cols-2 gap-3 pt-2">
              <Link href="/butler-review">
                <button className="w-full py-3.5 rounded-xl border font-semibold text-sm hover:bg-muted transition-colors">
                  Review Script
                </button>
              </Link>
              <button
                onClick={startQuiz}
                className="py-3.5 rounded-xl bg-sky-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-sky-700 transition-colors"
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
