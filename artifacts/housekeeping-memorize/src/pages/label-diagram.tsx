import { useState, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { diagrams, Diagram } from "@/data/diagrams";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ImageIcon, RotateCcw, Trophy, Check, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isCorrect(input: string, label: { answer: string; synonyms?: string[] }) {
  const n = normalize(input);
  if (!n) return false;
  if (n === normalize(label.answer)) return true;
  return (label.synonyms ?? []).some((s) => n === normalize(s));
}

type Phase = "pick" | "play" | "done";

interface AnswerState {
  value: string;
  checked: boolean;
  correct: boolean;
}

export default function LabelDiagram() {
  const [phase, setPhase] = useState<Phase>("pick");
  const [diagramIdx, setDiagramIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>([]);
  const [showHints, setShowHints] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const diagram: Diagram = diagrams[diagramIdx];

  const startDiagram = (idx: number) => {
    setDiagramIdx(idx);
    setAnswers(diagrams[idx].labels.map(() => ({ value: "", checked: false, correct: false })));
    setShowHints(false);
    setPhase("play");
  };

  const handleChange = (i: number, value: string) => {
    setAnswers((prev) =>
      prev.map((a, idx) => (idx === i ? { ...a, value, checked: false } : a))
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "Enter") {
      const next = inputRefs.current[i + 1];
      if (next) next.focus();
      else checkAll();
    }
  };

  const checkAll = () => {
    setAnswers((prev) =>
      prev.map((a, i) => ({
        ...a,
        checked: true,
        correct: isCorrect(a.value, diagram.labels[i]),
      }))
    );
    const allCorrect = answers.every((a, i) => isCorrect(a.value, diagram.labels[i]));
    if (allCorrect) {
      setTimeout(() => setPhase("done"), 800);
    }
  };

  const checkedCount = answers.filter((a) => a.checked && a.correct).length;
  const total = diagram.labels.length;
  const allChecked = answers.every((a) => a.checked);
  const allCorrect = answers.every((a) => a.checked && a.correct);

  const retry = () => {
    setAnswers(diagram.labels.map(() => ({ value: "", checked: false, correct: false })));
    setShowHints(false);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <header
        className="border-b sticky top-0 bg-background/95 backdrop-blur z-10"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="max-w-3xl mx-auto p-4 flex items-center justify-between gap-3">
          <Link href="/">
            <Button variant="outline" size="default" className="h-11">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <ImageIcon className="w-4 h-4" />
            Label the Diagram
          </div>
          {phase === "play" ? (
            <div className="text-sm font-semibold text-foreground tabular-nums">
              {checkedCount} / {total}
            </div>
          ) : (
            <div className="w-[88px]" />
          )}
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="max-w-3xl mx-auto space-y-6">

          {phase === "pick" && (
            <div className="space-y-6 pt-4">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Label the Diagram</h1>
                <p className="text-muted-foreground">
                  Study the image, then type the name of each numbered part.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Choose a diagram:</p>
                <div className="grid grid-cols-1 gap-3">
                  {diagrams.map((d, i) => (
                    <button
                      key={d.id}
                      onClick={() => startDiagram(i)}
                      className="rounded-xl border-2 border-border bg-card hover:border-primary/50 active:scale-[0.98] transition-all overflow-hidden text-left"
                    >
                      <div className="flex items-center gap-4 p-4">
                        <img
                          src={d.imageUrl}
                          alt={d.title}
                          className="w-20 h-16 object-cover rounded-lg shrink-0 border"
                        />
                        <div>
                          <p className="font-semibold text-foreground">{d.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {d.labels.length} parts to label
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {phase === "play" && (
            <div className="space-y-5">
              <div className="text-center">
                <h2 className="text-lg font-bold text-foreground">{diagram.title}</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Study the image, then fill in each part name below.
                </p>
              </div>

              <div className="rounded-xl overflow-hidden border bg-card">
                <img
                  src={diagram.imageUrl}
                  alt={diagram.title}
                  className="w-full object-contain max-h-[340px]"
                />
              </div>

              <div className="space-y-2">
                {diagram.labels.map((label, i) => {
                  const ans = answers[i];
                  const isCheckedCorrect = ans?.checked && ans.correct;
                  const isCheckedWrong = ans?.checked && !ans.correct;
                  return (
                    <div key={label.number} className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                        {label.number}
                      </span>
                      <div className="flex-1 relative">
                        <input
                          ref={(el) => { inputRefs.current[i] = el; }}
                          type="text"
                          value={ans?.value ?? ""}
                          onChange={(e) => handleChange(i, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, i)}
                          disabled={isCheckedCorrect}
                          placeholder={showHints ? label.hint : `Part ${label.number}…`}
                          className={cn(
                            "w-full h-11 px-3 rounded-lg border-2 text-sm bg-background transition-colors outline-none",
                            "placeholder:text-muted-foreground/60",
                            isCheckedCorrect && "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300",
                            isCheckedWrong && "border-destructive bg-destructive/5 text-foreground",
                            !ans?.checked && "border-border focus:border-primary"
                          )}
                        />
                        {ans?.checked && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2">
                            {ans.correct
                              ? <Check className="w-4 h-4 text-emerald-500" />
                              : <X className="w-4 h-4 text-destructive" />}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <AnimatePresence>
                {allChecked && !allCorrect && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2"
                  >
                    <div className="p-3 rounded-xl border border-destructive/30 bg-destructive/5 text-sm text-muted-foreground">
                      <p className="font-semibold text-foreground mb-1">Correct answers:</p>
                      {diagram.labels.map((label, i) =>
                        !answers[i]?.correct ? (
                          <p key={label.number} className="text-sm">
                            <span className="font-semibold text-foreground">{label.number}.</span>{" "}
                            {label.answer}
                          </p>
                        ) : null
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-2 pb-6">
                <Button size="lg" className="w-full h-14 text-base" onClick={checkAll}>
                  <Check className="w-5 h-5 mr-2" />
                  Check Answers
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowHints(!showHints)}
                    className="h-11"
                  >
                    {showHints ? "Hide Hints" : "Show Hints"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={retry}
                    className="h-11"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear & Retry
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setPhase("pick")}
                  className="h-11 text-muted-foreground"
                >
                  Pick Different Diagram
                </Button>
              </div>
            </div>
          )}

          {phase === "done" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 pt-12 text-center"
            >
              <div className="inline-flex p-6 bg-primary/10 rounded-full">
                <Trophy className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">All correct!</h2>
                <p className="text-muted-foreground">
                  You labeled all {total} parts of the {diagram.title}.
                </p>
              </div>
              <div className="space-y-2 text-left">
                {diagram.labels.map((label) => (
                  <div
                    key={label.number}
                    className="flex items-start gap-3 p-3 rounded-xl border border-primary/20 bg-primary/5"
                  >
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {label.number}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{label.answer}</p>
                      {label.hint && (
                        <p className="text-xs text-muted-foreground mt-0.5">{label.hint}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 pb-8">
                <Button variant="outline" size="lg" className="h-14" onClick={() => setPhase("pick")}>
                  New Diagram
                </Button>
                <Button size="lg" className="h-14" onClick={retry}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}
