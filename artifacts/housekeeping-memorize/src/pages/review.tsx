import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { housekeepingContent, slideTitles, totalSlides, FlashcardQuestion } from "@/data/content";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

interface SlideContent {
  slideNum: number;
  title: string;
  facts: { front: string; back: string }[];
}

function buildSlides(): SlideContent[] {
  const bySlide = new Map<number, SlideContent>();
  for (let i = 1; i <= totalSlides; i++) {
    bySlide.set(i, { slideNum: i, title: slideTitles[i - 1], facts: [] });
  }
  for (const q of housekeepingContent) {
    if (q.type !== 'flashcard') continue;
    const fc = q as FlashcardQuestion;
    const slide = bySlide.get(fc.slideNum);
    if (slide) {
      slide.facts.push({ front: fc.front, back: fc.back });
    }
  }
  return Array.from(bySlide.values());
}

export default function Review() {
  const slides = useMemo(buildSlides, []);
  const [slideIdx, setSlideIdx] = useState(0);
  const slide = slides[slideIdx];

  const goPrev = () => setSlideIdx(i => Math.max(0, i - 1));
  const goNext = () => setSlideIdx(i => Math.min(slides.length - 1, i + 1));

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <header className="p-4 border-b">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            Review Mode
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            {slideIdx + 1} / {slides.length}
          </div>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.slideNum}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="text-center pt-4">
                <p className="text-xs font-semibold text-primary uppercase tracking-widest">
                  Slide {slide.slideNum}
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-2">
                  {slide.title}
                </h1>
              </div>

              <div className="space-y-3">
                {slide.facts.map((fact, i) => (
                  <Card key={i} className="border bg-card">
                    <CardContent className="p-5 space-y-2">
                      <p className="font-semibold text-foreground leading-snug">
                        {fact.front}
                      </p>
                      <p className="text-foreground/80 leading-relaxed">
                        <span className="text-primary font-medium">Answer: </span>
                        {fact.back}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button
              variant="outline"
              size="lg"
              className="h-14"
              onClick={goPrev}
              disabled={slideIdx === 0}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>
            <Button
              size="lg"
              className="h-14"
              onClick={goNext}
              disabled={slideIdx === slides.length - 1}
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="pt-6 pb-8">
            <p className="text-center text-xs text-muted-foreground mb-3">Jump to slide</p>
            <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.slideNum}
                  onClick={() => setSlideIdx(i)}
                  className={`h-10 rounded-lg text-sm font-medium border transition-colors ${
                    i === slideIdx
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-foreground border-border hover:border-primary/50'
                  }`}
                >
                  {s.slideNum}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
