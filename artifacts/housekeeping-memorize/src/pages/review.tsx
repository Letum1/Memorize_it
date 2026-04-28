import { useState } from "react";
import { Link, useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { slideNotes } from "@/data/slideNotes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import OrgChartTree from "@/components/OrgChartTree";

export default function Review() {
  const [, params] = useRoute<{ slide?: string }>("/review/:slide?");
  const initialIdx = (() => {
    const n = parseInt(params?.slide || '1', 10);
    if (Number.isFinite(n) && n >= 1 && n <= slideNotes.length) return n - 1;
    return 0;
  })();
  const [slideIdx, setSlideIdx] = useState(initialIdx);
  const slide = slideNotes[slideIdx];

  const goPrev = () => setSlideIdx(i => Math.max(0, i - 1));
  const goNext = () => setSlideIdx(i => Math.min(slideNotes.length - 1, i + 1));

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
            <BookOpen className="w-4 h-4" />
            Review
          </div>
          <div className="text-sm font-semibold text-foreground tabular-nums">
            {slideIdx + 1} / {slideNotes.length}
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
              transition={{ duration: 0.2 }}
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

              {slide.slideNum === 3 && <OrgChartTree />}

              {slide.slideNum !== 3 && slide.intro && (
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="p-4 text-center">
                    <p className="font-bold text-foreground">{slide.intro}</p>
                  </CardContent>
                </Card>
              )}

              {slide.slideNum !== 3 && slide.items && slide.items.length > 0 && (
                <Card>
                  <CardContent className="p-5">
                    <ul className="space-y-3">
                      {slide.items.map((item, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="text-primary font-bold shrink-0 tabular-nums w-6 text-right">
                            {i + 1}.
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-foreground font-medium leading-snug">{item.label}</p>
                            {item.sub && item.sub.length > 0 && (
                              <ul className="mt-1.5 space-y-1">
                                {item.sub.map((s, j) => (
                                  <li key={j} className="text-foreground/70 text-sm pl-3 border-l-2 border-primary/30">
                                    {s}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {slide.slideNum !== 3 && slide.groups && slide.groups.length > 0 && (
                <div className="space-y-3">
                  {slide.groups.map((group, gi) => (
                    <Card key={gi}>
                      <CardContent className="p-5 space-y-3">
                        {group.heading && (
                          <h3 className="font-bold text-primary text-sm uppercase tracking-wide">
                            {group.heading}
                          </h3>
                        )}
                        <ul className="space-y-2">
                          {group.items.map((item, i) => (
                            <li key={i} className="flex gap-3">
                              <span className="text-primary mt-1.5 shrink-0">•</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-foreground leading-snug">{item.label}</p>
                                {item.sub && item.sub.length > 0 && (
                                  <ul className="mt-1 space-y-1">
                                    {item.sub.map((s, j) => (
                                      <li key={j} className="text-foreground/70 text-sm">
                                        {s}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
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
              disabled={slideIdx === slideNotes.length - 1}
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="pt-6 pb-8">
            <p className="text-center text-xs text-muted-foreground mb-3">Jump to slide</p>
            <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
              {slideNotes.map((s, i) => (
                <button
                  key={s.slideNum}
                  onClick={() => setSlideIdx(i)}
                  className={`h-11 rounded-lg text-sm font-medium border transition-colors ${
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
