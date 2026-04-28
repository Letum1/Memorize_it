import { useState, useMemo } from "react";
import { Link } from "wouter";
import { getAllFullSlides } from "@/data/slideHelpers";
import { getPremadeMnemonic } from "@/data/premadeMnemonics";
import { useMnemonics } from "@/lib/mnemonics";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Link2, Check, ChevronDown, Lightbulb } from "lucide-react";

export default function Mnemonic() {
  const slides = useMemo(getAllFullSlides, []);
  const { getMnemonic, setMnemonic, mnemonics } = useMnemonics();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<{ [id: string]: string }>({});

  const handleSave = (id: string) => {
    const draft = drafts[id] ?? getMnemonic(id);
    setMnemonic(id, draft);
    setExpanded(null);
  };

  const totalFacts = slides.reduce((s, sl) => s + sl.facts.length, 0);
  const written = Object.keys(mnemonics).length;

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
            <Link2 className="w-4 h-4" />
            Mnemonic Linker
          </div>
          <div className="w-[88px]" />
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2 pt-2">
            <h1 className="text-2xl font-bold text-foreground">Mnemonic Linker</h1>
            <p className="text-muted-foreground text-sm">
              Create a story, acronym, or silly image for each item. Your brain remembers stories better than facts.
            </p>
            <p className="text-xs text-muted-foreground pt-1">
              <span className="font-bold text-primary">{written}</span> of {totalFacts} items have a story
            </p>
          </div>

          {slides.map(slide => {
            const premade = getPremadeMnemonic(slide.slideNum);
            return (
            <section key={slide.slideNum} className="space-y-3">
              <div>
                <p className="text-xs uppercase text-primary tracking-widest font-semibold">Slide {slide.slideNum}</p>
                <h2 className="text-lg font-bold text-foreground">{slide.title}</h2>
              </div>
              {premade && (
                <Card className="border-amber-300/50 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-700/40">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wider font-bold text-amber-700 dark:text-amber-300">Memory hook</p>
                        <p className="text-sm font-semibold text-foreground">{premade.title}</p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed pl-6">
                      {premade.story}
                    </p>
                  </CardContent>
                </Card>
              )}
              <div className="space-y-2">
                {slide.facts.map(fact => {
                  const isOpen = expanded === fact.id;
                  const saved = getMnemonic(fact.id);
                  const draft = drafts[fact.id] ?? saved;
                  return (
                    <Card key={fact.id} className="overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : fact.id)}
                        className="w-full p-4 text-left flex items-start gap-3 hover-elevate"
                      >
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="font-semibold text-foreground text-sm leading-snug">{fact.label}</p>
                          {fact.detail && (
                            <p className="text-foreground/70 text-sm">{fact.detail}</p>
                          )}
                          {saved && !isOpen && (
                            <div className="flex items-start gap-2 mt-2 p-2 rounded-md bg-primary/10">
                              <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                              <p className="text-xs text-foreground italic line-clamp-2">{saved}</p>
                            </div>
                          )}
                        </div>
                        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <CardContent className="border-t pt-4 space-y-3">
                          <p className="text-xs text-muted-foreground">
                            Your story for this item (acronym, image, weird association — anything that sticks):
                          </p>
                          <Textarea
                            value={draft}
                            onChange={e => setDrafts(d => ({ ...d, [fact.id]: e.target.value }))}
                            placeholder={"e.g. Picture a giant... or remember it as the acronym..."}
                            className="min-h-[100px] bg-background"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                setDrafts(d => {
                                  const next = { ...d };
                                  delete next[fact.id];
                                  return next;
                                });
                                setExpanded(null);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button className="flex-1" onClick={() => handleSave(fact.id)}>
                              Save story
                            </Button>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            </section>
            );
          })}
          <div className="h-8" />
        </div>
      </main>
    </div>
  );
}
