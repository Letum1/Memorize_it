import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useMastery } from "@/lib/mastery";
import { useStreaks } from "@/lib/streaks";
import { useHardMode } from "@/lib/hardMode";
import { slideTitles, totalSlides } from "@/data/content";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Brain, Layers, Type, Target, RotateCcw, BookOpen, GraduationCap, Link2, Grid3x3, Sparkles, Flame, CalendarCheck, Zap, Trophy, Skull } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function ProgressCircle({ value }: { value: number }) {
  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="hsl(var(--muted))"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="hsl(var(--primary))"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-primary">{value}%</span>
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Mastery</span>
      </div>
    </div>
  );
}

export default function Home() {
  const { getOverallMastery, getSlideProgress, getWeakCount, resetProgress } = useMastery();
  const { currentStreak, longestStreak, completedToday, bestSpeedScore } = useStreaks();
  const { hardMode, setHardMode } = useHardMode();
  const overall = getOverallMastery();
  const weakCount = getWeakCount();

  const isMastered = overall === 100;

  return (
    <div className="min-h-[100dvh] pb-16 bg-background">
      <div className="max-w-2xl mx-auto p-4 pt-12 space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Housekeeping Memorize</h1>
          <p className="text-muted-foreground text-lg">Study Slides &mdash; {totalSlides} slides</p>
        </header>

        <section className="flex flex-col items-center gap-6">
          <ProgressCircle value={overall} />
          {isMastered ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-2 bg-primary/10 text-primary p-6 rounded-2xl w-full"
            >
              <h2 className="text-xl font-bold">You know this cold.</h2>
              <p className="text-primary/80">You've mastered 100% of the material.</p>
            </motion.div>
          ) : (
            <p className="text-center text-muted-foreground">
              Keep drilling until you reach 100%. <br />We'll prioritize the facts you struggle with.
            </p>
          )}
        </section>

        <section className="space-y-3">
          <Link href="/daily-drill">
            <Card className={`hover-elevate-2 cursor-pointer transition-colors active:scale-[0.98] ${completedToday ? 'border-orange-300/40 bg-orange-50/60 dark:bg-orange-950/20' : 'border-orange-400/60 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/20 dark:border-orange-600/50'}`}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-orange-200/70 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-full shrink-0">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">Daily Drill</h3>
                    {currentStreak > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full bg-orange-200/60 dark:bg-orange-900/40">
                        <Flame className="w-3 h-3" /> {currentStreak} day{currentStreak === 1 ? '' : 's'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {completedToday
                      ? "Done today — come back tomorrow to keep the streak."
                      : "10 questions a day. Build the habit."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/speed-round">
            <Card className="hover-elevate-2 cursor-pointer transition-colors active:scale-[0.98] border-yellow-400/50 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 dark:border-yellow-600/40">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-yellow-200/70 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 rounded-full shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">Speed Round</h3>
                    {bestSpeedScore > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full bg-yellow-200/60 dark:bg-yellow-900/40">
                        <Trophy className="w-3 h-3" /> {bestSpeedScore} best
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    60 seconds. Answer as many as you can.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          {(currentStreak > 0 || longestStreak > 0) && (
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="p-3 rounded-xl border bg-card text-center">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Streak</p>
                <p className="text-xl font-bold text-orange-600 dark:text-orange-400 mt-0.5">{currentStreak}🔥</p>
              </div>
              <div className="p-3 rounded-xl border bg-card text-center">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Longest</p>
                <p className="text-xl font-bold text-foreground mt-0.5">{longestStreak}🏆</p>
              </div>
              <div className="p-3 rounded-xl border bg-card text-center">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Speed</p>
                <p className="text-xl font-bold text-yellow-700 dark:text-yellow-400 mt-0.5">{bestSpeedScore}⚡</p>
              </div>
            </div>
          )}

          <Link href="/review">
            <Card className="hover-elevate-2 cursor-pointer transition-colors active:scale-[0.98] border-primary/30 bg-primary/5">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-primary/20 text-primary rounded-full shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">Review Mode</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Read all {totalSlides} slides in full — start here.</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className={`transition-colors ${hardMode ? 'border-rose-400/60 bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/20 dark:border-rose-600/50' : 'border-border bg-card'}`}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`p-3 rounded-full shrink-0 ${hardMode ? 'bg-rose-200/70 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300' : 'bg-muted text-muted-foreground'}`}>
                <Skull className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">Hard Mode</h3>
                  {hardMode && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 px-2 py-0.5 rounded-full bg-rose-200/60 dark:bg-rose-900/40">
                      ON
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  No clues. Multiple-choice options are hidden — type the answer from memory.
                </p>
              </div>
              <Switch checked={hardMode} onCheckedChange={setHardMode} aria-label="Toggle Hard Mode" />
            </CardContent>
          </Card>

          {weakCount > 0 && (
            <Link href="/study/hardest">
              <Card className="hover-elevate-2 cursor-pointer transition-colors active:scale-[0.98] border-amber-400/50 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-700/50">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="p-3 bg-amber-200/60 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full shrink-0">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">Hardest 10 Drill</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Focus on your weakest facts.{" "}
                      <span className="font-semibold text-amber-700 dark:text-amber-400">{weakCount} left to master.</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}

          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground pt-2">Practice & Drill</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/study/mixed">
              <Card className="hover-elevate-2 cursor-pointer transition-colors active:scale-[0.98] border-primary/20 bg-primary/5 h-full">
                <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                  <div className="p-3 bg-primary/20 text-primary rounded-full">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Mixed Drill</h3>
                    <p className="text-xs text-muted-foreground mt-1">Smart rotation</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/study/flashcard">
              <Card className="hover-elevate-2 cursor-pointer transition-colors active:scale-[0.98] h-full">
                <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                  <div className="p-3 bg-muted text-foreground rounded-full">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Flashcards</h3>
                    <p className="text-xs text-muted-foreground mt-1">Tap to flip</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/study/fill-blank">
              <Card className="hover-elevate-2 cursor-pointer transition-colors active:scale-[0.98] h-full">
                <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                  <div className="p-3 bg-muted text-foreground rounded-full">
                    <Type className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Fill Blank</h3>
                    <p className="text-xs text-muted-foreground mt-1">Recall exactly</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/study/multiple-choice">
              <Card className="hover-elevate-2 cursor-pointer transition-colors active:scale-[0.98] h-full">
                <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                  <div className="p-3 bg-muted text-foreground rounded-full">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Multi Choice</h3>
                    <p className="text-xs text-muted-foreground mt-1">Identify facts</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground pt-4">Deep Memorization</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/brain-dump">
              <Card className="hover-elevate-2 cursor-pointer transition-colors active:scale-[0.98] h-full">
                <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                  <div className="p-3 bg-muted text-foreground rounded-full">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Brain Dump</h3>
                    <p className="text-xs text-muted-foreground mt-1">Blurt for 2 min</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/teach-it">
              <Card className="hover-elevate-2 cursor-pointer transition-colors active:scale-[0.98] h-full">
                <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                  <div className="p-3 bg-muted text-foreground rounded-full">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Teach It</h3>
                    <p className="text-xs text-muted-foreground mt-1">Feynman style</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/match">
              <Card className="hover-elevate-2 cursor-pointer transition-colors active:scale-[0.98] h-full">
                <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                  <div className="p-3 bg-muted text-foreground rounded-full">
                    <Grid3x3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Diagram Master</h3>
                    <p className="text-xs text-muted-foreground mt-1">Match terms</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/mnemonic">
              <Card className="hover-elevate-2 cursor-pointer transition-colors active:scale-[0.98] h-full">
                <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                  <div className="p-3 bg-muted text-foreground rounded-full">
                    <Link2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Mnemonic</h3>
                    <p className="text-xs text-muted-foreground mt-1">Story per fact</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Slide Progress</h2>
          <div className="space-y-3">
            {slideTitles.map((title, idx) => {
              const slideNum = idx + 1;
              const { mastered, total, percent } = getSlideProgress(slideNum);
              return (
                <div key={slideNum} className="p-4 rounded-xl border bg-card">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm text-foreground line-clamp-1 mr-4">Slide {slideNum}: {title}</span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{mastered} / {total}</span>
                  </div>
                  <Progress value={percent} className="h-2" />
                </div>
              );
            })}
          </div>
        </section>

        <section className="flex justify-center pt-8 border-t">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="text-muted-foreground">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Progress
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently erase your mastery history. You will start back at 0%.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetProgress} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Yes, reset progress
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>

        <footer className="text-center pt-4">
          <p className="text-xs text-muted-foreground">
            Made by <span className="font-semibold text-foreground">Clyde Bonita</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
