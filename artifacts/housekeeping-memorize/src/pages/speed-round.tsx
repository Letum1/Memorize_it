import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useStreaks } from "@/lib/streaks";
import { useMastery } from "@/lib/mastery";
import { housekeepingContent, MultipleChoiceQuestion, FillBlankQuestion, FlashcardQuestion } from "@/data/content";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, Trophy, Timer, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const ROUND_SECONDS = 60;

interface SpeedQ {
  id: string;
  prompt: string;
  options: string[];
  correct: string;
  slideNum: number;
  slideTitle: string;
}

function buildPool(): SpeedQ[] {
  const pool: SpeedQ[] = [];
  // Use multiple-choice as-is
  for (const q of housekeepingContent) {
    if (q.type === 'multiple-choice') {
      const mc = q as MultipleChoiceQuestion;
      pool.push({
        id: mc.id,
        prompt: mc.question,
        options: mc.options,
        correct: mc.correctAnswer,
        slideNum: mc.slideNum,
        slideTitle: mc.slideTitle,
      });
    } else if (q.type === 'flashcard') {
      // Build a 4-option MCQ from a flashcard by picking 3 distractor backs
      const fc = q as FlashcardQuestion;
      const distractors = housekeepingContent
        .filter(o => o.type === 'flashcard' && o.id !== fc.id)
        .map(o => (o as FlashcardQuestion).back)
        .filter(b => b !== fc.back);
      const picks = shuffle(distractors).slice(0, 3);
      const options = shuffle([fc.back, ...picks]);
      pool.push({
        id: fc.id,
        prompt: fc.front,
        options,
        correct: fc.back,
        slideNum: fc.slideNum,
        slideTitle: fc.slideTitle,
      });
    } else if (q.type === 'fill-blank') {
      const fb = q as FillBlankQuestion;
      const distractors = housekeepingContent
        .filter(o => o.type === 'fill-blank' && o.id !== fb.id)
        .map(o => (o as FillBlankQuestion).correctAnswer)
        .filter(a => a.toLowerCase() !== fb.correctAnswer.toLowerCase());
      const picks = shuffle(distractors).slice(0, 3);
      const options = shuffle([fb.correctAnswer, ...picks]);
      pool.push({
        id: fb.id,
        prompt: fb.question.replace('___', '_____'),
        options,
        correct: fb.correctAnswer,
        slideNum: fb.slideNum,
        slideTitle: fb.slideTitle,
      });
    }
  }
  return pool;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = 'intro' | 'play' | 'done';

export default function SpeedRound() {
  const [, setLocation] = useLocation();
  const { recordAnswer } = useMastery();
  const { bestSpeedScore, recordSpeedScore } = useStreaks();

  const [phase, setPhase] = useState<Phase>('intro');
  const [queue, setQueue] = useState<SpeedQ[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const [picked, setPicked] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [newRecord, setNewRecord] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setQueue(shuffle(buildPool()));
    setIdx(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setSecondsLeft(ROUND_SECONDS);
    setPicked(null);
    setFeedback('idle');
    setNewRecord(false);
    setPhase('play');
  };

  useEffect(() => {
    if (phase !== 'play') return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [phase]);

  useEffect(() => {
    if (phase === 'play' && secondsLeft === 0) {
      finishRound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, phase]);

  const finishRound = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (score > bestSpeedScore) {
      setNewRecord(true);
      recordSpeedScore(score);
    }
    setPhase('done');
  };

  const handlePick = (opt: string) => {
    if (feedback !== 'idle' || phase !== 'play') return;
    const current = queue[idx];
    const isRight = opt === current.correct;
    setPicked(opt);
    setFeedback(isRight ? 'correct' : 'wrong');
    recordAnswer(current.id, isRight);
    if (isRight) {
      setScore(s => s + 1);
      setStreak(st => {
        const next = st + 1;
        setBestStreak(b => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
    }
    setTimeout(() => {
      setPicked(null);
      setFeedback('idle');
      setIdx(i => (i + 1) % queue.length);
    }, isRight ? 350 : 800);
  };

  if (phase === 'intro') {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col">
        <header className="border-b" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="max-w-lg mx-auto p-4 flex items-center justify-between">
            <Link href="/">
              <Button variant="outline" size="default" className="h-11">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Zap className="w-4 h-4" />
              Speed Round
            </div>
            <div className="w-[88px]" />
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-8">
          <div className="inline-flex p-6 bg-yellow-500/10 rounded-full">
            <Zap className="w-16 h-16 text-yellow-500" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground">60-Second Speed Round</h1>
            <p className="text-muted-foreground">Answer as many as you can before the clock hits zero. Tap fast — no penalty for wrong, but you lose your streak.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="p-4 rounded-xl border bg-card">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Best score</p>
              <p className="text-3xl font-bold text-foreground mt-1">{bestSpeedScore}</p>
            </div>
            <div className="p-4 rounded-xl border bg-card">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Time</p>
              <p className="text-3xl font-bold text-foreground mt-1">60s</p>
            </div>
          </div>
          <Button size="lg" className="w-full h-14 text-base" onClick={start}>
            <Zap className="w-5 h-5 mr-2" />
            Start round
          </Button>
        </main>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-6 text-center space-y-8 max-w-md mx-auto">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
          <div className={cn("inline-flex p-6 rounded-full", newRecord ? "bg-yellow-500/15" : "bg-muted")}>
            {newRecord ? <Trophy className="w-16 h-16 text-yellow-500" /> : <Zap className="w-16 h-16 text-muted-foreground" />}
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {newRecord ? 'New record!' : "Time's up"}
          </h1>
          <p className="text-muted-foreground">{score === 0 ? 'Try again — you got this.' : 'Nice work. Keep climbing.'}</p>
        </motion.div>
        <div className="grid grid-cols-3 gap-3 w-full">
          <div className="p-4 rounded-xl border bg-card">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Score</p>
            <p className="text-2xl font-bold text-foreground mt-1">{score}</p>
          </div>
          <div className="p-4 rounded-xl border bg-card">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Best</p>
            <p className="text-2xl font-bold text-foreground mt-1">{Math.max(bestSpeedScore, score)}</p>
          </div>
          <div className="p-4 rounded-xl border bg-card">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Streak</p>
            <p className="text-2xl font-bold text-foreground mt-1">{bestStreak}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full">
          <Button size="lg" variant="outline" className="h-14" onClick={() => setLocation('/')}>
            Back home
          </Button>
          <Button size="lg" className="h-14" onClick={start}>
            <RotateCcw className="w-4 h-4 mr-2" /> Play again
          </Button>
        </div>
      </div>
    );
  }

  const current = queue[idx];
  const timePct = (secondsLeft / ROUND_SECONDS) * 100;
  const lowTime = secondsLeft <= 10;

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="max-w-lg mx-auto p-3 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold tabular-nums">
              <Trophy className="w-4 h-4 text-primary" />
              {score}
            </div>
            <div className={cn("flex items-center gap-2 text-2xl font-bold tabular-nums transition-colors", lowTime ? "text-destructive" : "text-foreground")}>
              <Timer className="w-5 h-5" />
              {secondsLeft}s
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-orange-500 tabular-nums">
              {streak}🔥
            </div>
          </div>
          <div className="h-1.5 w-full rounded-full overflow-hidden bg-muted">
            <motion.div
              className={cn("h-full", lowTime ? "bg-destructive" : "bg-primary")}
              initial={{ width: '100%' }}
              animate={{ width: `${timePct}%` }}
              transition={{ duration: 1, ease: 'linear' }}
            />
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id + '-' + idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="w-full space-y-4"
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-center text-primary">
              Slide {current.slideNum}
            </p>
            <h2 className="text-xl font-semibold text-foreground text-center min-h-[64px] flex items-center justify-center">{current.prompt}</h2>
            <div className="grid grid-cols-1 gap-2">
              {current.options.map(opt => {
                const isPicked = picked === opt;
                const isCorrect = opt === current.correct;
                const showResult = feedback !== 'idle' && (isPicked || (feedback === 'wrong' && isCorrect));
                return (
                  <button
                    key={opt}
                    disabled={feedback !== 'idle'}
                    onClick={() => handlePick(opt)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left text-base font-medium transition-all min-h-[60px]",
                      feedback === 'idle' && "border-border bg-card hover:border-primary/40 active:scale-[0.98]",
                      showResult && isCorrect && "border-green-500 bg-green-500/10 text-foreground",
                      showResult && !isCorrect && isPicked && "border-destructive bg-destructive/10 text-destructive"
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
