import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useMastery } from "@/lib/mastery";
import { slideTitles, totalSlides } from "@/data/content";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, Layers, Type, Target, RotateCcw } from "lucide-react";
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
  const { getOverallMastery, getSlideProgress, resetProgress } = useMastery();
  const overall = getOverallMastery();

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

        <section className="grid grid-cols-2 gap-4">
          <Link href="/study/mixed">
            <Card className="hover-elevate-2 cursor-pointer transition-colors active:scale-[0.98] border-primary/20 bg-primary/5">
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
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
            <Card className="hover-elevate-2 cursor-pointer transition-colors active:scale-[0.98]">
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                <div className="p-3 bg-muted text-foreground rounded-full">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Flashcards</h3>
                  <p className="text-xs text-muted-foreground mt-1">Self-graded</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/study/fill-blank">
            <Card className="hover-elevate-2 cursor-pointer transition-colors active:scale-[0.98]">
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
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
            <Card className="hover-elevate-2 cursor-pointer transition-colors active:scale-[0.98]">
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
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
      </div>
    </div>
  );
}
