import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { getAllFullSlides } from "@/data/slideHelpers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, GraduationCap, RotateCcw, Sparkles } from "lucide-react";

const JARGON_WORDS = [
  'institutional', 'establishment', 'establishments', 'replenish', 'turndown',
  'occupancy', 'maintenance', 'inventory', 'inspection', 'amenities',
  'consumables', 'attendant', 'supervisor', 'standardize', 'sustain',
];

function gradeSimplicity(text: string): { score: number; tip: string } {
  const trimmed = text.trim();
  if (!trimmed) return { score: 0, tip: 'Write something first.' };

  const words = trimmed.split(/\s+/);
  const wordCount = words.length;
  const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLen = wordCount / Math.max(1, sentences.length);
  const longWords = words.filter(w => w.length > 8).length;
  const jargonCount = words.filter(w =>
    JARGON_WORDS.includes(w.toLowerCase().replace(/[.,!?;:]/g, ''))
  ).length;

  let score = 100;
  if (avgSentenceLen > 20) score -= 25;
  else if (avgSentenceLen > 15) score -= 10;

  const longRatio = longWords / wordCount;
  if (longRatio > 0.25) score -= 25;
  else if (longRatio > 0.15) score -= 10;

  score -= jargonCount * 8;
  if (wordCount < 30) score -= 15;
  score = Math.max(0, Math.min(100, score));

  let tip = 'Clear and simple — a kid could follow this.';
  if (score < 50) tip = 'Try shorter sentences and everyday words. Imagine you are talking to a 10-year-old.';
  else if (score < 75) tip = 'Pretty good. Watch out for long words and jargon — swap them for simpler ones.';

  return { score, tip };
}

export default function TeachIt() {
  const slides = useMemo(getAllFullSlides, []);
  const [slideIdx, setSlideIdx] = useState(0);
  const [phase, setPhase] = useState<'pick' | 'writing' | 'review'>('pick');
  const [text, setText] = useState('');

  const slide = slides[slideIdx];
  const { score, tip } = gradeSimplicity(text);

  const start = () => {
    setText('');
    setPhase('writing');
  };

  const restart = () => {
    setPhase('pick');
    setText('');
  };

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
            <GraduationCap className="w-4 h-4" />
            Teach It
          </div>
          <div className="w-[88px]" />
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {phase === 'pick' && (
            <div className="space-y-6 pt-4">
              <div className="text-center space-y-3">
                <h1 className="text-2xl font-bold text-foreground">Teach It</h1>
                <p className="text-muted-foreground">
                  Pick a slide and explain it as if you're talking to a 10-year-old.
                  If you can teach it simply, you really know it.
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
                <Sparkles className="w-5 h-5 mr-2" />
                Start teaching
              </Button>
            </div>
          )}

          {phase === 'writing' && (
            <div className="space-y-4 pt-2">
              <div>
                <p className="text-xs uppercase text-primary tracking-widest font-semibold">Slide {slide.slideNum}</p>
                <h2 className="text-xl font-bold text-foreground">{slide.title}</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Explain it in simple words. Pretend the listener has never heard of it.
              </p>
              <Textarea
                value={text}
                onChange={e => setText(e.target.value)}
                autoFocus
                placeholder="So basically, this is when..."
                className="min-h-[240px] text-base leading-relaxed bg-card"
              />

              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">Simplicity score</p>
                    <p className={`text-2xl font-bold tabular-nums ${
                      score >= 75 ? 'text-primary' : score >= 50 ? 'text-foreground' : 'text-destructive'
                    }`}>{score}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{tip}</p>
                </CardContent>
              </Card>

              <Button size="lg" className="w-full h-14" onClick={() => setPhase('review')} disabled={!text.trim()}>
                Done — show me the original
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
                <h2 className="text-xl font-bold text-foreground">How did you do?</h2>
                <p className="text-sm text-muted-foreground">Compare your explanation to the source slide.</p>
              </div>

              <div className="space-y-3">
                <p className="text-xs uppercase font-semibold text-muted-foreground tracking-widest">Your explanation</p>
                <Card>
                  <CardContent className="p-4 whitespace-pre-wrap text-foreground leading-relaxed">
                    {text}
                  </CardContent>
                </Card>
                <p className="text-xs text-muted-foreground">Simplicity score: <span className="font-bold text-primary">{score}</span></p>
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
                  Re-teach this one
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
