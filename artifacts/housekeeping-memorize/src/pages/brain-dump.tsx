import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { getAllFullSlides } from "@/data/slideHelpers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Brain, Play, RotateCcw, CheckCircle2 } from "lucide-react";

const SECONDS = 120;

export default function BrainDump() {
  const slides = useMemo(getAllFullSlides, []);
  const [slideIdx, setSlideIdx] = useState(0);
  const [phase, setPhase] = useState<'pick' | 'writing' | 'review'>('pick');
  const [text, setText] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(SECONDS);
  const intervalRef = useRef<number | null>(null);

  const slide = slides[slideIdx];

  useEffect(() => {
    if (phase !== 'writing') return;
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          setPhase('review');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [phase]);

  const start = () => {
    setText('');
    setSecondsLeft(SECONDS);
    setPhase('writing');
  };

  const finish = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    setPhase('review');
  };

  const restart = () => {
    setPhase('pick');
    setText('');
    setSecondsLeft(SECONDS);
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="max-w-2xl mx-auto p-4 flex items-center justify-between gap-3">
          <Link href="/">
            <Button variant="outline" size="default" className="h-11">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Brain className="w-4 h-4" />
            Brain Dump
          </div>
          <div className="w-[88px]" />
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {phase === 'pick' && (
            <div className="space-y-6 pt-4">
              <div className="text-center space-y-3">
                <h1 className="text-2xl font-bold text-foreground">Brain Dump</h1>
                <p className="text-muted-foreground">
                  Pick a slide. You'll get 2 minutes to write down everything you remember.
                  Then you'll see the full slide to spot what you missed.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Choose a slide:</p>
                <div className="grid grid-cols-1 gap-2">
                  {slides.map((s, i) => (
                    <button
                      key={s.slideNum}
                      onClick={() => setSlideIdx(i)}
                      className={`p-4 rounded-xl border-2 text-left transition-colors ${
                        i === slideIdx
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-card hover:border-primary/40'
                      }`}
                    >
                      <p className="text-xs uppercase text-muted-foreground tracking-widest">Slide {s.slideNum}</p>
                      <p className="font-semibold text-foreground mt-0.5">{s.title}</p>
                    </button>
                  ))}
                </div>
              </div>
              <Button size="lg" className="w-full h-14 text-base" onClick={start}>
                <Play className="w-5 h-5 mr-2" />
                Start 2-minute brain dump
              </Button>
            </div>
          )}

          {phase === 'writing' && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs uppercase text-primary tracking-widest font-semibold">Slide {slide.slideNum}</p>
                  <h2 className="text-xl font-bold text-foreground truncate">{slide.title}</h2>
                </div>
                <div className={`text-3xl font-bold tabular-nums ${secondsLeft <= 15 ? 'text-destructive' : 'text-primary'}`}>
                  {mins}:{secs.toString().padStart(2, '0')}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Write everything you remember. Don't peek. Don't worry about order or grammar.
              </p>
              <Textarea
                value={text}
                onChange={e => setText(e.target.value)}
                autoFocus
                placeholder="Start typing what you remember..."
                className="min-h-[300px] text-base leading-relaxed bg-card"
              />
              <Button size="lg" className="w-full h-14" onClick={finish}>
                I'm done — show me what I missed
              </Button>
            </div>
          )}

          {phase === 'review' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 pt-2"
            >
              <div className="text-center">
                <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-2" />
                <h2 className="text-xl font-bold text-foreground">Compare</h2>
                <p className="text-sm text-muted-foreground">Read the original side-by-side with what you wrote.</p>
              </div>

              <div className="space-y-3">
                <p className="text-xs uppercase font-semibold text-muted-foreground tracking-widest">Your dump</p>
                <Card>
                  <CardContent className="p-4 whitespace-pre-wrap text-foreground leading-relaxed min-h-[120px]">
                    {text || <span className="text-muted-foreground italic">You didn't write anything.</span>}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                <p className="text-xs uppercase font-semibold text-primary tracking-widest">Slide {slide.slideNum}: {slide.title}</p>
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-5">
                    <ul className="space-y-2.5">
                      {slide.facts.map((fact, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="text-primary font-bold tabular-nums shrink-0 w-6 text-right">{i + 1}.</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-foreground font-medium leading-snug">{fact.label}</p>
                            {fact.detail && (
                              <p className="text-foreground/70 text-sm mt-0.5">{fact.detail}</p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 pb-8">
                <Button variant="outline" size="lg" className="h-14" onClick={restart}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New slide
                </Button>
                <Button size="lg" className="h-14" onClick={start}>
                  Try this one again
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
