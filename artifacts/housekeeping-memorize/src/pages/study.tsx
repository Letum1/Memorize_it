import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useMastery } from "@/lib/mastery";
import { useHardMode, looseTextMatch } from "@/lib/hardMode";
import { Question, QuestionType, FlashcardQuestion, MultipleChoiceQuestion, FillBlankQuestion } from "@/data/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Check, X, ArrowRight, ArrowLeft, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

type FeedbackState = 'idle' | 'correct' | 'wrong';

export default function Study() {
  const { mode } = useParams<{ mode: string }>();
  const [, setLocation] = useLocation();
  const { getSessionItems, getHardestItems, recordAnswer } = useMastery();
  const { hardMode } = useHardMode();

  const [items, setItems] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const [sessionCorrect, setSessionCorrect] = useState(0);

  const isHardest = mode === 'hardest';

  // Initialize session once
  useEffect(() => {
    let newItems: Question[] = [];
    if (mode === 'hardest') {
      newItems = getHardestItems(10);
    } else {
      const qType = mode as QuestionType | 'mixed';
      newItems = getSessionItems(qType, 15);
    }
    if (newItems.length === 0) {
      setLocation('/');
      return;
    }
    setItems(newItems);
  }, [mode, setLocation]);

  if (items.length === 0) return <div className="min-h-screen flex items-center justify-center p-4">Loading...</div>;

  const currentQuestion = items[currentIndex];
  const progress = ((currentIndex) / items.length) * 100;

  const finishSession = (finalCorrect: number) => {
    sessionStorage.setItem('lastSessionScore', JSON.stringify({
      correct: finalCorrect,
      total: items.length
    }));
    setLocation('/results');
  };

  const handleAnswer = (isCorrect: boolean) => {
    recordAnswer(currentQuestion.id, isCorrect);
    setFeedback(isCorrect ? 'correct' : 'wrong');

    const newCorrect = sessionCorrect + (isCorrect ? 1 : 0);
    if (isCorrect) {
      setSessionCorrect(newCorrect);
      const isLast = currentIndex + 1 >= items.length;
      setTimeout(() => {
        if (isLast) {
          finishSession(newCorrect);
        } else {
          setFeedback('idle');
          setCurrentIndex(prev => prev + 1);
        }
      }, 1000);
    }
  };

  const advance = () => {
    if (currentIndex + 1 >= items.length) {
      finishSession(sessionCorrect);
    } else {
      setFeedback('idle');
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <header
        className="border-b sticky top-0 bg-background/95 backdrop-blur z-20"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="p-3 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="default"
              onClick={() => setLocation('/')}
              className="h-11 px-4 font-medium"
              data-testid="button-exit-study"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit
            </Button>
            <span className="text-sm font-semibold text-foreground tabular-nums">
              {currentIndex + 1} / {items.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          {isHardest && (
            <div className="text-[11px] font-bold uppercase tracking-wider text-center text-amber-700 dark:text-amber-400">
              Hardest 10 Drill
            </div>
          )}
          {hardMode && (
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
              <Flame className="w-3.5 h-3.5" />
              Hard Mode — no clues
            </div>
          )}
          <div className="text-xs font-semibold text-primary uppercase tracking-wider text-center">
            Slide {currentQuestion.slideNum}: {currentQuestion.slideTitle}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-lg mx-auto w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: 1, 
              x: feedback === 'wrong' ? [0, -10, 10, -10, 10, 0] : 0
            }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full flex-1 flex flex-col justify-center"
          >
            {currentQuestion.type === 'flashcard' && (
              <Flashcard 
                question={currentQuestion as FlashcardQuestion} 
                onAnswer={handleAnswer} 
                feedback={feedback}
                advance={advance}
              />
            )}
            {currentQuestion.type === 'multiple-choice' && !hardMode && (
              <MultipleChoice 
                question={currentQuestion as MultipleChoiceQuestion} 
                onAnswer={handleAnswer} 
                feedback={feedback}
                advance={advance}
              />
            )}
            {currentQuestion.type === 'multiple-choice' && hardMode && (
              <HardModeTyped
                prompt={(currentQuestion as MultipleChoiceQuestion).question}
                correctAnswer={(currentQuestion as MultipleChoiceQuestion).correctAnswer}
                onAnswer={handleAnswer}
                feedback={feedback}
              />
            )}
            {currentQuestion.type === 'fill-blank' && (
              <FillBlank 
                question={currentQuestion as FillBlankQuestion} 
                onAnswer={handleAnswer} 
                feedback={feedback}
                advance={advance}
                hardMode={hardMode}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Feedback Overlay for Wrong Answer */}
        {feedback === 'wrong' && currentQuestion.type !== 'flashcard' && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 left-0 right-0 p-6 bg-destructive/10 border-t border-destructive/20 text-destructive-foreground rounded-t-2xl flex flex-col gap-4 backdrop-blur-md"
          >
            <div>
              <div className="flex items-center gap-2 font-bold text-destructive mb-1">
                <X className="w-5 h-5" />
                Not quite.
              </div>
              <p className="text-foreground text-sm font-medium">
                Correct answer:{' '}
                <span className="font-bold text-primary">
                  {currentQuestion.type === 'multiple-choice' 
                    ? (currentQuestion as MultipleChoiceQuestion).correctAnswer 
                    : (currentQuestion as FillBlankQuestion).correctAnswer}
                </span>
              </p>
            </div>
            <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={advance}>
              Got it
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
        
        {feedback === 'correct' && currentQuestion.type !== 'flashcard' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
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

function Flashcard({ question, onAnswer, feedback, advance }: { question: FlashcardQuestion, onAnswer: (c: boolean) => void, feedback: FeedbackState, advance: () => void }) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [question.id]);

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div 
        className="w-full aspect-square md:aspect-video cursor-pointer"
        style={{ perspective: '1200px' }}
        onClick={() => { if(feedback === 'idle') setFlipped(f => !f); }}
      >
        <motion.div
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-card border rounded-3xl p-8 flex items-center justify-center shadow-lg"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            <h2 className="text-2xl font-semibold text-center text-foreground">{question.front}</h2>
            {!flipped && <div className="absolute bottom-6 text-sm text-muted-foreground animate-pulse">Tap to flip</div>}
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-primary text-primary-foreground rounded-3xl p-8 flex flex-col items-center justify-center shadow-lg"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="text-xs uppercase tracking-widest text-primary-foreground/70 mb-4">Answer</p>
            <p className="text-xl font-medium text-center leading-relaxed">{question.back}</p>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {flipped && feedback === 'idle' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex gap-4"
          >
            <Button size="lg" variant="outline" className="flex-1 h-16 text-destructive border-destructive/20 hover:bg-destructive/10" onClick={() => onAnswer(false)}>
              Still learning
            </Button>
            <Button size="lg" className="flex-1 h-16 bg-green-600 hover:bg-green-700 text-white" onClick={() => {
              onAnswer(true);
            }}>
              I knew it
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MultipleChoice({ question, onAnswer, feedback }: { question: MultipleChoiceQuestion, onAnswer: (c: boolean) => void, feedback: FeedbackState, advance: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (opt: string) => {
    if (feedback !== 'idle') return;
    setSelected(opt);
    onAnswer(opt === question.correctAnswer);
  };

  return (
    <div className="w-full space-y-8">
      <h2 className="text-2xl font-bold text-foreground text-center">{question.question}</h2>
      
      <div className="flex flex-col gap-3">
        {question.options.map((opt, i) => {
          const isSelected = selected === opt;
          const isCorrect = opt === question.correctAnswer;
          
          let stateClass = "border-border hover:border-primary/50 bg-card";
          if (feedback !== 'idle') {
            if (isCorrect) stateClass = "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400";
            else if (isSelected && !isCorrect) stateClass = "border-destructive bg-destructive/10 text-destructive";
            else stateClass = "border-border opacity-50";
          }

          return (
            <button
              key={i}
              disabled={feedback !== 'idle'}
              onClick={() => handleSelect(opt)}
              className={cn(
                "w-full p-6 text-left rounded-2xl border-2 transition-all active:scale-[0.98] font-medium text-lg flex items-center justify-between",
                stateClass
              )}
            >
              <span>{opt}</span>
              {feedback !== 'idle' && isCorrect && <Check className="w-6 h-6 text-green-500" />}
              {feedback !== 'idle' && isSelected && !isCorrect && <X className="w-6 h-6 text-destructive" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FillBlank({ question, onAnswer, feedback, hardMode }: { question: FillBlankQuestion, onAnswer: (c: boolean) => void, feedback: FeedbackState, advance: () => void, hardMode?: boolean }) {
  const [val, setVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // auto focus
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [question.id]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback !== 'idle' || !val.trim()) return;

    const normalizedVal = val.trim().toLowerCase();
    const target = question.correctAnswer.toLowerCase();
    const isCorrect = hardMode
      ? normalizedVal === target
      : (
          normalizedVal === target ||
          (question.synonyms?.map(s => s.toLowerCase()).includes(normalizedVal) ?? false)
        );

    onAnswer(isCorrect);
  };

  const parts = question.question.split('___');

  return (
    <form onSubmit={submit} className="w-full space-y-8 flex flex-col items-center">
      <div className="text-2xl font-bold text-foreground text-center leading-relaxed">
        {parts[0]}
        <span className="inline-block mx-2 border-b-4 border-primary min-w-[4rem] text-primary">
          {feedback === 'idle' ? val || '\u00A0' : val}
        </span>
        {parts[1]}
      </div>

      <div className="w-full max-w-sm mt-8 space-y-4">
        <Input
          ref={inputRef}
          type="text"
          value={val}
          onChange={e => setVal(e.target.value)}
          disabled={feedback !== 'idle'}
          className="h-16 text-xl text-center rounded-2xl border-2 bg-card"
          placeholder={hardMode ? "Exact answer only..." : "Type your answer..."}
        />
        <Button 
          type="submit" 
          size="lg" 
          className="w-full h-16 text-lg rounded-2xl"
          disabled={feedback !== 'idle' || !val.trim()}
        >
          Check Answer
        </Button>
      </div>
    </form>
  );
}

function HardModeTyped({ prompt, correctAnswer, onAnswer, feedback }: { prompt: string, correctAnswer: string, onAnswer: (c: boolean) => void, feedback: FeedbackState }) {
  const [val, setVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [prompt]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback !== 'idle' || !val.trim()) return;
    onAnswer(looseTextMatch(val, correctAnswer));
  };

  return (
    <form onSubmit={submit} className="w-full space-y-8 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-foreground text-center leading-relaxed">{prompt}</h2>

      <div className="w-full max-w-sm mt-4 space-y-4">
        <Input
          ref={inputRef}
          type="text"
          value={val}
          onChange={e => setVal(e.target.value)}
          disabled={feedback !== 'idle'}
          className="h-16 text-xl text-center rounded-2xl border-2 bg-card"
          placeholder="Type the answer from memory..."
        />
        <Button
          type="submit"
          size="lg"
          className="w-full h-16 text-lg rounded-2xl"
          disabled={feedback !== 'idle' || !val.trim()}
        >
          Check Answer
        </Button>
        <p className="text-[11px] text-center text-muted-foreground uppercase tracking-wider">
          No options shown — recall it yourself.
        </p>
      </div>
    </form>
  );
}
