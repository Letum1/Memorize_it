import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RotateCcw, Home } from "lucide-react";

export default function Results() {
  const sessionDataStr = sessionStorage.getItem('lastSessionScore');
  const sessionData = sessionDataStr ? JSON.parse(sessionDataStr) : { correct: 0, total: 15 };
  
  const score = Math.round((sessionData.correct / sessionData.total) * 100) || 0;
  const isPerfect = score === 100;

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-card border rounded-3xl p-8 text-center space-y-8 shadow-xl"
      >
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            {isPerfect ? (
              <CheckCircle2 className="w-12 h-12" />
            ) : (
              <span className="text-3xl font-bold">{score}%</span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {isPerfect ? "Flawless." : "Session Complete"}
          </h1>
          <p className="text-muted-foreground text-lg">
            You got {sessionData.correct} out of {sessionData.total} right.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Link href="/">
            <Button size="lg" className="w-full h-14 text-lg">
              <RotateCcw className="w-5 h-5 mr-2" />
              Keep Practicing
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" variant="outline" className="w-full h-14 text-lg">
              <Home className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
