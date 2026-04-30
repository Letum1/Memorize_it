import { useState, useMemo, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { slideNotes } from "@/data/slideNotes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ListChecks, ChevronLeft, ChevronRight, RotateCcw, CheckCircle2, Eye, EyeOff, Shuffle, Trophy, Undo2 } from "lucide-react";

const PROCEDURE_SLIDE_NUMS = [5, 7, 20, 24];

interface ProcedureStep {
  num: number;
  text: string;
  detail?: string;
}

interface Procedure {
  slideNum: number;
  title: string;
  steps: ProcedureStep[];
}

function buildProcedures(): Procedure[] {
  return PROCEDURE_SLIDE_NUMS
    .map(num => slideNotes.find(s => s.slideNum === num))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map(s => {
      const steps: ProcedureStep[] = (s.items ?? []).map((item, i) => ({
        num: i + 1,
        text: item.label,
        detail: item.sub && item.sub.length > 0 ? item.sub.join(" ") : undefined,
      }));
      return { slideNum: s.slideNum, title: s.title, steps };
    });
}

function ProcedureList({ procedures }: { procedures: Procedure[] }) {
  return (
    <div className="space-y-6 pt-4">
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 bg-primary/10 text-primary rounded-full">
          <ListChecks className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Procedures</h1>
        <p className="text-muted-foreground">
          Step-by-step. These are the most important sequences to memorize. Tap any procedure to walk through every step.
        </p>
      </div>

      <div className="space-y-3">
        {procedures.map(p => (
          <Link key={p.slideNum} href={`/procedures/${p.slideNum}`}>
            <Card className="hover-elevate-2 cursor-pointer transition-colors active:scale-[0.98] border-primary/30 bg-primary/5">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-primary/20 text-primary rounded-full shrink-0">
                  <ListChecks className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {p.steps.length} steps · Slide {p.slideNum}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function OrderTest({ procedure, onBack }: { procedure: Procedure; onBack: () => void }) {
  const total = procedure.steps.length;
  const [pool, setPool] = useState<ProcedureStep[]>(() => shuffle(procedure.steps));
  const [order, setOrder] = useState<ProcedureStep[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [wrongStep, setWrongStep] = useState<number | null>(null);
  const [phase, setPhase] = useState<'play' | 'done'>('play');

  const expectedNum = order.length + 1;

  const handlePick = (step: ProcedureStep) => {
    if (phase !== 'play') return;
    if (step.num === expectedNum) {
      const newOrder = [...order, step];
      setOrder(newOrder);
      setPool(pool.filter(p => p.num !== step.num));
      setWrongStep(null);
      if (newOrder.length === total) {
        setTimeout(() => setPhase('done'), 400);
      }
    } else {
      setMistakes(m => m + 1);
      setWrongStep(step.num);
      setTimeout(() => setWrongStep(prev => (prev === step.num ? null : prev)), 700);
    }
  };

  const handleUndo = () => {
    if (order.length === 0 || phase !== 'play') return;
    const last = order[order.length - 1];
    setOrder(order.slice(0, -1));
    setPool([...pool, last]);
  };

  const handleReset = () => {
    setPool(shuffle(procedure.steps));
    setOrder([]);
    setMistakes(0);
    setWrongStep(null);
    setPhase('play');
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="text-center space-y-1">
        <p className="text-xs uppercase text-rose-600 dark:text-rose-400 tracking-widest font-semibold">Order Test · Slide {procedure.slideNum}</p>
        <h1 className="text-xl font-bold text-foreground">{procedure.title}</h1>
      </div>

      {phase === 'play' ? (
        <>
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-foreground tabular-nums">
              {order.length} / {total}
            </span>
            <span className="text-muted-foreground tabular-nums">
              {mistakes} {mistakes === 1 ? 'mistake' : 'mistakes'}
            </span>
          </div>

          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4 space-y-2">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Tap step <span className="font-bold text-primary">{expectedNum}</span> next
              </p>
              {order.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">Pick the FIRST step to begin.</p>
              ) : (
                <ol className="space-y-1">
                  {order.map((s, i) => (
                    <li key={s.num} className="flex gap-3 text-sm text-foreground">
                      <span className="font-mono text-xs text-primary w-5 shrink-0">{i + 1}.</span>
                      <span className="line-clamp-2">{s.text}</span>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>

          <div className="space-y-2">
            <p className="text-xs uppercase font-semibold text-muted-foreground tracking-widest">Choose the next step</p>
            <AnimatePresence>
              {pool.map(step => (
                <motion.button
                  key={step.num}
                  layout
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => handlePick(step)}
                  className={`w-full p-3 rounded-xl border-2 text-left text-sm font-medium transition-colors min-h-[56px] flex items-center ${
                    wrongStep === step.num
                      ? 'border-destructive bg-destructive/10 text-destructive animate-pulse'
                      : 'border-border bg-card text-foreground hover:border-primary/40 active:scale-[0.98]'
                  }`}
                >
                  {step.text}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="lg" className="h-12" onClick={handleUndo} disabled={order.length === 0}>
              <Undo2 className="w-4 h-4 mr-2" />
              Undo last
            </Button>
            <Button variant="outline" size="lg" className="h-12" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reshuffle
            </Button>
          </div>

          <Button variant="ghost" className="w-full" onClick={onBack}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to walkthrough
          </Button>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-5 text-center pt-4"
        >
          <div className="inline-flex p-5 bg-primary/10 rounded-full">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground">
              {mistakes === 0 ? 'Perfect order!' : 'All steps placed.'}
            </h2>
            <p className="text-muted-foreground">
              {total} steps · {mistakes} {mistakes === 1 ? 'mistake' : 'mistakes'}
            </p>
          </div>
          <ol className="space-y-1.5 text-left">
            {procedure.steps.map(s => (
              <li
                key={s.num}
                className="flex gap-3 p-2 rounded-lg text-sm text-foreground/80 border border-primary/20 bg-primary/5"
              >
                <span className="font-mono text-xs text-primary w-5 shrink-0">{s.num}.</span>
                <span>{s.text}</span>
              </li>
            ))}
          </ol>
          <div className="grid grid-cols-2 gap-3 pb-2">
            <Button variant="outline" size="lg" className="h-12" onClick={onBack}>
              Walkthrough
            </Button>
            <Button size="lg" className="h-12" onClick={handleReset}>
              <Shuffle className="w-4 h-4 mr-2" />
              Test again
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function StepWalkthrough({ procedure, onTest }: { procedure: Procedure; onTest: () => void }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [hideText, setHideText] = useState(false);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const total = procedure.steps.length;
  const step = procedure.steps[stepIdx];
  const isLast = stepIdx === total - 1;

  const next = () => {
    setCompleted(prev => new Set(prev).add(step.num));
    if (!isLast) {
      setStepIdx(stepIdx + 1);
      setHideText(false);
    }
  };

  const prev = () => {
    if (stepIdx > 0) {
      setStepIdx(stepIdx - 1);
      setHideText(false);
    }
  };

  const reset = () => {
    setStepIdx(0);
    setCompleted(new Set());
    setHideText(false);
  };

  const allDone = completed.size === total;

  return (
    <div className="space-y-6 pt-2">
      <div className="text-center space-y-1">
        <p className="text-xs uppercase text-primary tracking-widest font-semibold">Slide {procedure.slideNum}</p>
        <h1 className="text-xl font-bold text-foreground">{procedure.title}</h1>
      </div>

      <Button
        variant="outline"
        className="w-full h-12 border-rose-400/60 bg-rose-50/60 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/40"
        onClick={onTest}
      >
        <Shuffle className="w-4 h-4 mr-2" />
        Test order — drag steps into place
      </Button>

      <div className="flex items-center gap-1 px-1">
        {procedure.steps.map((s, i) => (
          <div
            key={s.num}
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              completed.has(s.num)
                ? 'bg-primary'
                : i === stepIdx
                ? 'bg-primary/50'
                : 'bg-muted'
            }`}
          />
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Step {stepIdx + 1} of {total}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.num}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-primary/30 bg-card">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-xl font-bold">
                  {step.num}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setHideText(h => !h)}
                  className="text-xs"
                >
                  {hideText ? (
                    <>
                      <Eye className="w-4 h-4 mr-1" /> Show
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 mr-1" /> Hide & recall
                    </>
                  )}
                </Button>
              </div>
              {hideText ? (
                <div className="py-12 text-center text-muted-foreground italic">
                  Try to recall step {step.num} from memory…
                </div>
              ) : (
                <>
                  <p className="text-xl font-medium text-foreground leading-snug">{step.text}</p>
                  {step.detail && (
                    <p className="text-sm text-muted-foreground border-l-2 border-primary/40 pl-3">
                      {step.detail}
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" size="lg" className="h-14" onClick={prev} disabled={stepIdx === 0}>
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </Button>
        <Button size="lg" className="h-14" onClick={next} disabled={isLast && completed.has(step.num)}>
          {isLast ? (
            <>
              <CheckCircle2 className="w-5 h-5 mr-1" /> Finish
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-5 h-5 ml-1" />
            </>
          )}
        </Button>
      </div>

      {allDone && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-3 text-center pt-4 pb-2"
        >
          <div className="inline-flex p-4 bg-primary/10 rounded-full">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-foreground">All {total} steps walked.</h2>
          <p className="text-sm text-muted-foreground">Run it again until you can do every step from memory.</p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </Button>
            <Link href="/procedures">
              <Button className="h-12 w-full">All Procedures</Button>
            </Link>
          </div>
        </motion.div>
      )}

      <div className="pt-4 border-t">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 text-center">All steps</p>
        <ol className="space-y-1.5">
          {procedure.steps.map(s => (
            <li
              key={s.num}
              className={`flex gap-3 p-2 rounded-lg text-sm ${
                completed.has(s.num)
                  ? 'text-foreground/40 line-through'
                  : s.num === step.num
                  ? 'bg-primary/10 text-foreground font-medium'
                  : 'text-foreground/80'
              }`}
            >
              <span className="font-mono text-xs text-muted-foreground w-5 shrink-0">{s.num}.</span>
              <span>{s.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function Procedures() {
  const procedures = useMemo(buildProcedures, []);
  const [match, params] = useRoute<{ slide: string }>("/procedures/:slide");
  const slideNum = match ? parseInt(params.slide, 10) : null;
  const selected = slideNum != null ? procedures.find(p => p.slideNum === slideNum) : null;
  const [mode, setMode] = useState<'walk' | 'test'>('walk');

  useEffect(() => {
    setMode('walk');
  }, [slideNum]);

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="max-w-2xl mx-auto p-4 flex items-center justify-between gap-3">
          <Link href={selected ? "/procedures" : "/"}>
            <Button variant="outline" size="default" className="h-11">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {selected ? "All" : "Home"}
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <ListChecks className="w-4 h-4" />
            Procedures
          </div>
          <div className="w-[88px]" />
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="max-w-2xl mx-auto pb-10">
          {selected ? (
            mode === 'test' ? (
              <OrderTest procedure={selected} onBack={() => setMode('walk')} />
            ) : (
              <StepWalkthrough procedure={selected} onTest={() => setMode('test')} />
            )
          ) : (
            <ProcedureList procedures={procedures} />
          )}
        </div>
      </main>
    </div>
  );
}
