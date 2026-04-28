import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useMastery } from "@/lib/mastery";
import { useStreaks, getDailySeed, seededShuffle } from "@/lib/streaks";
import { housekeepingContent, Question, MultipleChoiceQuestion, FillBlankQuestion, FlashcardQuestion } from "@/data/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Check, X, ArrowRight, Flame, Trophy, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const DAILY_COUNT = 10;

function pickDailyQuestions(): Question[] {
  const seed = getDailySeed();
  const shuffled = seededShuffle(housekeepingContent, seed);
  return shuffled.slice(0, DAILY_COUNT);
}

type Feedback = 'idle' | 'correct' | 'wrong';

export default function DailyDrill() {
  const [, setLocation] = useLocation();
  const { recordAnswer } = useMastery();
  const { completedToday, currentStreak, longestStreak, completeDailyDrill } = useStreaks();

  const items = useMemo(pickDailyQuestions, []);
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>('idle');
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const [input, setInput] = useState('');
  const [picked, setPicked] = useState<string | null>(null);
  const [flipped, setFlipped] = useState(false);

  const current = items[idx];

  useEffect(() => {
    setInput('');
    setPicked(null);
    setFlipped(false);
    setFeedback('idle');
  }, [idx]);

  if (completedToday && !done) {
    return <AlreadyDoneScreen currentStreak={currentStreak} longestStreak={longestStreak} />;
  }

  const handleAnswer = (isCorrect: boolean) => {
    recordAnswer(current.id, isCorrect);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setCorrect(c => c + 1);
    if (isCorrect) {
      setTimeout(advance, 900);
    }
  };

  const advance = () => {
    if (idx + 1 >= items.length) {
      completeDailyDrill();
      setDone(true);
    } else {
      setIdx(i => i + 1);
    }
  };

  if (done) {
    return <DoneScreen correct={correct} total={items.length} streak={currentStreak + (completedToday ? 0 : 1)} />;
  }

  const progress = (idx / items.length) * 100;

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="max-w-lg mx-auto p-3 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" size="default" onClick={() => setLocation('/')} className="h-11">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit
            </Button>
            <div className="flex items-center gap-2 text-sm font-semibold text-orange-600 dark:text-orange-400">
              <Flame className="w-4 h-4" />
              {currentStreak} day{currentStreak === 1 ? '' : 's'}
            </div>
            <span className="text-sm font-semibold tabular-nums">
              {idx + 1} / {items.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-[11px] font-bold uppercase tracking-wider text-center text-orange-700 dark:text-orange-400">
            Daily Drill — {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: feedback === 'wrong' ? [0, -10, 10, -10, 10, 0] : 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="text-xs font-semibold text-primary uppercase tracking-wider text-center mb-4">
              Slide {current.slideNum}: {current.slideTitle}
            </div>

            {current.type === 'flashcard' && (
              <FlashcardCard
                question={current as FlashcardQuestion}
                flipped={flipped}
                setFlipped={setFlipped}
                onAnswer={handleAnswer}
                feedback={feedback}
              />
            )}
            {current.type === 'multiple-choice' && (
              <MultipleChoiceCard
                question={current as MultipleChoiceQuestion}
                picked={picked}
                setPicked={setPicked}
                onAnswer={handleAnswer}
                feedback={feedback}
              />
            )}
            {current.type === 'fill-blank' && (
              <FillBlankCard
                question={current as FillBlankQuestion}
                input={input}
                setInput={setInput}
                onAnswer={handleAnswer}
                feedback={feedback}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {feedback === 'wrong' && current.type !== 'flashcard' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 left-0 right-0 p-5 bg-destructive/10 border-t border-destructive/30 backdrop-blur-md flex flex-col gap-3"
          >
            <div>
              <div className="flex items-center gap-2 font-bold text-destructive mb-1">
                <X className="w-5 h-5" /> Not quite.
              </div>
              <p className="text-foreground text-sm">
                Correct answer:{' '}
                <span className="font-bold text-primary">
                  {current.type === 'multiple-choice'
                    ? (current as MultipleChoiceQuestion).correctAnswer
                    : (current as FillBlankQuestion).correctAnswer}
                </span>
              </p>
            </div>
            <Button size="lg" className="w-full" onClick={advance}>
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}

        {feedback === 'correct' && current.type !== 'flashcard' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-green-500 text-white p-6 rounded-full shadow-2xl">
              <Check className="w-16 h-16" />
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function FlashcardCard({ question, flipped, setFlipped, onAnswer, feedback }: { question: FlashcardQuestion, flipped: boolean, setFlipped: (b: boolean) => void, onAnswer: (c: boolean) => void, feedback: Feedback }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <button
        type="button"
        onClick={() => setFlipped(!flipped)}
        className="w-full min-h-[280px] p-8 rounded-2xl border-2 border-border bg-card shadow-sm flex items-center justify-center text-center text-lg font-medium text-foreground active:scale-[0.98] transition-transform"
      >
        {flipped ? question.back : question.front}
      </button>
      {!flipped ? (
        <Button size="lg" variant="outline" className="w-full h-14" onClick={() => setFlipped(true)}>
          Show answer
        </Button>
      ) : feedback === 'idle' ? (
        <div className="grid grid-cols-2 gap-3 w-full">
          <Button size="lg" variant="outline" className="h-14 border-destructive/40 text-destructive" onClick={() => onAnswer(false)}>
            <X className="w-4 h-4 mr-2" /> Got it wrong
          </Button>
          <Button size="lg" className="h-14" onClick={() => onAnswer(true)}>
            <Check className="w-4 h-4 mr-2" /> Got it right
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function MultipleChoiceCard({ question, picked, setPicked, onAnswer, feedback }: { question: MultipleChoiceQuestion, picked: string | null, setPicked: (s: string) => void, onAnswer: (c: boolean) => void, feedback: Feedback }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground text-center">{question.question}</h2>
      <div className="space-y-2">
        {question.options.map(opt => {
          const isPicked = picked === opt;
          const isCorrect = opt === question.correctAnswer;
          const showResult = feedback !== 'idle' && (isPicked || (feedback === 'wrong' && isCorrect));
          return (
            <button
              key={opt}
              disabled={feedback !== 'idle'}
              onClick={() => {
                setPicked(opt);
                onAnswer(opt === question.correctAnswer);
              }}
              className={cn(
                "w-full p-4 rounded-xl border-2 text-left text-base font-medium transition-all min-h-[60px]",
                feedback === 'idle' && "border-border bg-card hover:border-primary/40 active:scale-[0.99]",
                showResult && isCorrect && "border-green-500 bg-green-500/10 text-foreground",
                showResult && !isCorrect && isPicked && "border-destructive bg-destructive/10 text-destructive"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FillBlankCard({ question, input, setInput, onAnswer, feedback }: { question: FillBlankQuestion, input: string, setInput: (s: string) => void, onAnswer: (c: boolean) => void, feedback: Feedback }) {
  const check = () => {
    const a = input.trim().toLowerCase();
    if (!a) return;
    const correct = question.correctAnswer.toLowerCase();
    const synonyms = (question.synonyms || []).map(s => s.toLowerCase());
    const isRight = a === correct || synonyms.includes(a);
    onAnswer(isRight);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground text-center leading-relaxed">
        {question.question.split('___').map((part, i, arr) => (
          <span key={i}>
            {part}
            {i < arr.length - 1 && <span className="inline-block min-w-[80px] border-b-2 border-primary mx-1" />}
          </span>
        ))}
      </h2>
      <Input
        value={input}
        onChange={e => setInput(e.target.value)}
        disabled={feedback !== 'idle'}
        placeholder="Type your answer"
        className="h-14 text-lg text-center"
        autoFocus
        onKeyDown={e => { if (e.key === 'Enter') check(); }}
      />
      {feedback === 'idle' && (
        <Button size="lg" className="w-full h-14" disabled={!input.trim()} onClick={check}>
          Check answer
        </Button>
      )}
    </div>
  );
}

function AlreadyDoneScreen({ currentStreak, longestStreak }: { currentStreak: number, longestStreak: number }) {
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
            <CalendarCheck className="w-4 h-4" />
            Daily Drill
          </div>
          <div className="w-[88px]" />
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-8">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
          <div className="inline-flex p-6 bg-orange-500/10 rounded-full">
            <Flame className="w-16 h-16 text-orange-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">{currentStreak} day streak</h1>
          <p className="text-muted-foreground">You already finished today's drill. Come back tomorrow to keep your streak alive.</p>
        </motion.div>
        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="p-4 rounded-xl border bg-card">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Current</p>
            <p className="text-2xl font-bold text-foreground mt-1">{currentStreak}🔥</p>
          </div>
          <div className="p-4 rounded-xl border bg-card">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Longest</p>
            <p className="text-2xl font-bold text-foreground mt-1">{longestStreak}🏆</p>
          </div>
        </div>
        <Link href="/">
          <Button size="lg" variant="outline" className="h-14 px-8">Back home</Button>
        </Link>
      </main>
    </div>
  );
}

function DoneScreen({ correct, total, streak }: { correct: number, total: number, streak: number }) {
  const pct = Math.round((correct / total) * 100);
  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-6 text-center space-y-8 max-w-md mx-auto">
      <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
        <div className="inline-flex p-6 bg-orange-500/10 rounded-full">
          <Flame className="w-16 h-16 text-orange-500" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">{streak} day streak!</h1>
        <p className="text-muted-foreground">Daily drill complete. Come back tomorrow.</p>
      </motion.div>
      <div className="grid grid-cols-2 gap-3 w-full">
        <div className="p-4 rounded-xl border bg-card">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Correct</p>
          <p className="text-2xl font-bold text-foreground mt-1">{correct} / {total}</p>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Score</p>
          <p className="text-2xl font-bold text-foreground mt-1">{pct}%</p>
        </div>
      </div>
      <Link href="/">
        <Button size="lg" className="h-14 px-8"><Trophy className="w-4 h-4 mr-2" /> Back home</Button>
      </Link>
    </div>
  );
}
