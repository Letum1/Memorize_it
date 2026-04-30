import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { getAllFullSlides, FullSlide, SlidePair } from "@/data/slideHelpers";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Grid3x3, RotateCcw, Trophy, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const PAIRS_PER_ROUND = 5;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickPairs(slide: FullSlide): SlidePair[] {
  const eligible = slide.pairs.filter(p => p.term && p.definition);
  return shuffle(eligible).slice(0, Math.min(PAIRS_PER_ROUND, eligible.length));
}

export default function Match() {
  const slides = useMemo(getAllFullSlides, []);
  const eligibleSlides = slides.filter(s => s.pairs.length >= 2);
  const [slideIdx, setSlideIdx] = useState(0);
  const [phase, setPhase] = useState<'pick' | 'play' | 'done'>('pick');
  const [pairs, setPairs] = useState<SlidePair[]>([]);
  const [shuffledTerms, setShuffledTerms] = useState<SlidePair[]>([]);
  const [shuffledDefs, setShuffledDefs] = useState<SlidePair[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedDef, setSelectedDef] = useState<string | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<Set<string>>(new Set());
  const [wrongAttempt, setWrongAttempt] = useState<{ term: string; def: string } | null>(null);
  const [mistakes, setMistakes] = useState(0);

  const slide = eligibleSlides[slideIdx];

  const start = () => {
    const newPairs = pickPairs(slide);
    setPairs(newPairs);
    setShuffledTerms(shuffle(newPairs));
    setShuffledDefs(shuffle(newPairs));
    setMatchedPairIds(new Set());
    setSelectedTerm(null);
    setSelectedDef(null);
    setWrongAttempt(null);
    setMistakes(0);
    setPhase('play');
  };

  useEffect(() => {
    if (selectedTerm && selectedDef) {
      const tPair = pairs.find(p => p.id === selectedTerm);
      const dPair = pairs.find(p => p.id === selectedDef);
      if (!tPair || !dPair) return;
      const isMatch = tPair.id === dPair.id;
      if (isMatch) {
        setMatchedPairIds(prev => new Set(prev).add(tPair.id));
        setSelectedTerm(null);
        setSelectedDef(null);
      } else {
        setWrongAttempt({ term: selectedTerm, def: selectedDef });
        setMistakes(m => m + 1);
        const t = setTimeout(() => {
          setWrongAttempt(null);
          setSelectedTerm(null);
          setSelectedDef(null);
        }, 700);
        return () => clearTimeout(t);
      }
    }
    return undefined;
  }, [selectedTerm, selectedDef, pairs]);

  useEffect(() => {
    if (phase === 'play' && pairs.length > 0 && matchedPairIds.size === pairs.length) {
      const t = setTimeout(() => setPhase('done'), 600);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [matchedPairIds, pairs, phase]);

  const restart = () => {
    setPhase('pick');
    setPairs([]);
    setShuffledTerms([]);
    setShuffledDefs([]);
    setMatchedPairIds(new Set());
    setSelectedTerm(null);
    setSelectedDef(null);
    setWrongAttempt(null);
    setMistakes(0);
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="max-w-3xl mx-auto p-4 flex items-center justify-between gap-3">
          <Link href="/">
            <Button variant="outline" size="default" className="h-11">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Grid3x3 className="w-4 h-4" />
            Diagram Master
          </div>
          {phase === 'play' ? (
            <div className="text-sm font-semibold text-foreground tabular-nums">
              {matchedPairIds.size} / {pairs.length}
            </div>
          ) : (
            <div className="w-[88px]" />
          )}
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {phase === 'pick' && (
            <div className="space-y-6 pt-4">
              <div className="text-center space-y-3">
                <h1 className="text-2xl font-bold text-foreground">Diagram Master</h1>
                <p className="text-muted-foreground">
                  Match each term to its definition. Tap one on the left, then tap its match on the right.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Choose a slide:</p>
                <div className="grid grid-cols-1 gap-2">
                  {eligibleSlides.map((s, i) => (
                    <button
                      key={s.slideNum}
                      onClick={() => setSlideIdx(i)}
                      className={`p-4 rounded-xl border-2 text-left transition-colors ${
                        i === slideIdx
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-card hover:border-primary/40'
                      }`}
                    >
                      <p className="text-xs uppercase text-muted-foreground tracking-widest">Slide {s.slideNum} — {s.pairs.length} pairs</p>
                      <p className="font-semibold text-foreground mt-0.5">{s.title}</p>
                    </button>
                  ))}
                </div>
              </div>
              <Button size="lg" className="w-full h-14 text-base" onClick={start}>
                <Grid3x3 className="w-5 h-5 mr-2" />
                Start matching
              </Button>
            </div>
          )}

          {phase === 'play' && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-xs uppercase text-primary tracking-widest font-semibold">Slide {slide.slideNum}</p>
                <h2 className="text-lg font-bold text-foreground">{slide.title}</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <p className="text-xs uppercase font-semibold text-muted-foreground tracking-widest text-center">Terms</p>
                  {shuffledTerms.map(p => {
                    const isMatched = matchedPairIds.has(p.id);
                    const isSelected = selectedTerm === p.id;
                    const isWrong = wrongAttempt?.term === p.id;
                    return (
                      <button
                        key={`t-${p.id}`}
                        disabled={isMatched}
                        onClick={() => !isMatched && setSelectedTerm(p.id)}
                        className={cn(
                          "w-full p-3 rounded-xl border-2 text-left text-sm font-medium transition-all min-h-[64px] flex items-center",
                          isMatched && "border-primary/30 bg-primary/10 text-foreground/40 line-through",
                          !isMatched && isSelected && "border-primary bg-primary/10 text-foreground",
                          !isMatched && isWrong && "border-destructive bg-destructive/10 text-destructive animate-pulse",
                          !isMatched && !isSelected && !isWrong && "border-border bg-card text-foreground hover:border-primary/40 active:scale-[0.98]"
                        )}
                      >
                        {p.term}
                      </button>
                    );
                  })}
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase font-semibold text-muted-foreground tracking-widest text-center">Definitions</p>
                  {shuffledDefs.map(p => {
                    const isMatched = matchedPairIds.has(p.id);
                    const isSelected = selectedDef === p.id;
                    const isWrong = wrongAttempt?.def === p.id;
                    return (
                      <button
                        key={`d-${p.id}`}
                        disabled={isMatched}
                        onClick={() => !isMatched && setSelectedDef(p.id)}
                        className={cn(
                          "w-full p-3 rounded-xl border-2 text-left text-sm font-medium transition-all min-h-[64px] flex items-center",
                          isMatched && "border-primary/30 bg-primary/10 text-foreground/40 line-through",
                          !isMatched && isSelected && "border-primary bg-primary/10 text-foreground",
                          !isMatched && isWrong && "border-destructive bg-destructive/10 text-destructive animate-pulse",
                          !isMatched && !isSelected && !isWrong && "border-border bg-card text-foreground hover:border-primary/40 active:scale-[0.98]"
                        )}
                      >
                        {p.definition}
                      </button>
                    );
                  })}
                </div>
              </div>

              <AnimatePresence>
                {wrongAttempt && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 justify-center text-sm text-destructive"
                  >
                    <X className="w-4 h-4" />
                    Not a match — try again
                  </motion.div>
                )}
              </AnimatePresence>

              <Button variant="outline" className="w-full" onClick={restart}>
                Pick different slide
              </Button>
            </div>
          )}

          {phase === 'done' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 pt-12 text-center"
            >
              <div className="inline-flex p-6 bg-primary/10 rounded-full">
                <Trophy className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">All matched.</h2>
                <p className="text-muted-foreground">
                  {pairs.length} pairs · {mistakes} {mistakes === 1 ? 'mistake' : 'mistakes'}
                </p>
              </div>
              <div className="space-y-3 text-left">
                {pairs.map(p => (
                  <div key={p.id} className="p-3 rounded-xl border border-primary/20 bg-primary/5">
                    <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      {p.term}
                    </p>
                    <p className="text-sm text-foreground/70 mt-1 ml-6">{p.definition}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 pb-8">
                <Button variant="outline" size="lg" className="h-14" onClick={restart}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New slide
                </Button>
                <Button size="lg" className="h-14" onClick={start}>
                  Same slide again
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
