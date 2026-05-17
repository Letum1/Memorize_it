import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Settings2, Eye, EyeOff, RotateCcw, Dumbbell } from "lucide-react";
import { loadNames, saveNames, buildScript, ButlerNames, Role } from "@/lib/butlerScript";

function SettingsPanel({ names, onChange, onClose }: {
  names: ButlerNames;
  onChange: (n: ButlerNames) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(names);

  function field(key: keyof ButlerNames, label: string, placeholder: string, disabled = false) {
    const val = draft[key];
    return (
      <div className="space-y-1">
        <label className={`text-xs font-semibold uppercase tracking-wider ${disabled ? "text-muted-foreground/60" : "text-muted-foreground"}`}>
          {label}
        </label>
        <input
          className={`w-full border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          value={typeof val === "string" ? val : ""}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => setDraft((prev) => ({ ...prev, [key]: e.target.value }))}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-2xl border bg-card shadow-lg p-5 space-y-4"
    >
      <h2 className="font-semibold text-foreground">Customize Script</h2>

      {/* Guest Gender */}
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Guest Gender</label>
        <div className="flex gap-2">
          <button
            onClick={() => setDraft((p) => ({ ...p, guestGender: "female" }))}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${draft.guestGender === "female" ? "bg-violet-600 text-white border-violet-600" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            Female 👩 (Ma'am / Mrs.)
          </button>
          <button
            onClick={() => setDraft((p) => ({ ...p, guestGender: "male" }))}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${draft.guestGender === "male" ? "bg-violet-600 text-white border-violet-600" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            Male 👨 (Sir / Mr.)
          </button>
        </div>
      </div>

      {/* Same Actor toggle */}
      <div className="flex items-center justify-between py-1">
        <div>
          <p className="text-sm font-semibold text-foreground">Same Actor for Butler & Receptionist</p>
          <p className="text-xs text-muted-foreground">
            {draft.sameActor ? "One person plays both roles (like the real assessment)." : "Different actors for Butler and Receptionist."}
          </p>
        </div>
        <button
          onClick={() => setDraft((p) => ({ ...p, sameActor: !p.sameActor }))}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${draft.sameActor ? "bg-primary" : "bg-muted"}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${draft.sameActor ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>

      {/* Name fields */}
      <div className="space-y-3">
        {field("butlerName", "Butler Name", "e.g. Clyde")}
        {field("receptionistName", "Receptionist Name", draft.sameActor ? "Same as Butler (auto)" : "e.g. Jessica", draft.sameActor)}
        {field("guestName", "Guest Name", "e.g. Cresel")}
        {field("guestCity", "Guest's City", "e.g. Taguig City")}
        {field("hotelName", "Hotel Name", "e.g. TMTC Hotel")}
      </div>

      <div className="flex gap-2 pt-1">
        <button
          className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          onClick={() => { saveNames(draft); onChange(draft); onClose(); }}
        >
          Save
        </button>
        <button
          className="px-4 py-2 rounded-xl border text-sm font-medium hover:bg-muted transition-colors"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

const ROLE_COLORS: Record<Role, string> = {
  butler: "bg-sky-50 dark:bg-sky-950/30 border-sky-200/70 dark:border-sky-700/40",
  receptionist: "bg-amber-50 dark:bg-amber-950/30 border-amber-200/70 dark:border-amber-700/40",
  guest: "bg-violet-50 dark:bg-violet-950/30 border-violet-200/70 dark:border-violet-700/40",
  note: "bg-muted/40 border-border",
};

const ROLE_LABEL_COLORS: Record<Role, string> = {
  butler: "text-sky-700 dark:text-sky-300",
  receptionist: "text-amber-700 dark:text-amber-300",
  guest: "text-violet-700 dark:text-violet-300",
  note: "text-muted-foreground",
};

function getRoleEmoji(role: Role): string {
  if (role === "butler") return "🫡";
  if (role === "receptionist") return "🗂️";
  if (role === "guest") return "🙋";
  return "";
}

function getActorName(role: Role, names: ButlerNames): string {
  if (role === "butler") return names.butlerName;
  if (role === "receptionist") return names.sameActor ? names.butlerName : names.receptionistName;
  return "";
}

export default function ButlerReview() {
  const [names, setNames] = useState<ButlerNames>(loadNames);
  const [showSettings, setShowSettings] = useState(false);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [practiceMode, setPracticeMode] = useState(false);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [allDone, setAllDone] = useState(false);

  const script = buildScript(names);
  const scene = script[sceneIdx];
  const totalScenes = script.length;

  function goScene(idx: number) {
    setSceneIdx(idx);
    setRevealed(new Set());
    setAllDone(false);
  }

  function toggleReveal(i: number) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  }

  function revealAll() {
    const actorIndices = scene.lines
      .map((l, i) => (l.role === "butler" || l.role === "receptionist" ? i : -1))
      .filter((i) => i >= 0);
    setRevealed(new Set(actorIndices));
    setAllDone(true);
  }

  const actorLineCount = scene.lines.filter((l) => l.role === "butler" || l.role === "receptionist").length;
  const revealedCount = [...revealed].filter((i) => {
    const r = scene.lines[i]?.role;
    return r === "butler" || r === "receptionist";
  }).length;

  return (
    <div className="min-h-[100dvh] bg-background pb-20">
      <div className="max-w-2xl mx-auto p-4 pt-8 space-y-4">

        <header className="flex items-center gap-3">
          <Link href="/">
            <button className="p-2 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight">Butler Service Review</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {names.guestGender === "male" ? "Sir" : "Ma'am"} · {names.hotelName}
              {names.sameActor ? " · Same Actor" : " · Different Actors"}
            </p>
          </div>
          <Link href="/butler-quiz">
            <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-sky-600 text-white hover:bg-sky-700 transition-colors">
              <Dumbbell className="w-3.5 h-3.5" />
              Quiz Me
            </button>
          </Link>
          <button
            onClick={() => setShowSettings((v) => !v)}
            className={`p-2 rounded-full transition-colors ${showSettings ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
          >
            <Settings2 className="w-5 h-5" />
          </button>
        </header>

        <AnimatePresence>
          {showSettings && (
            <SettingsPanel
              names={names}
              onChange={setNames}
              onClose={() => setShowSettings(false)}
            />
          )}
        </AnimatePresence>

        {/* Role legend */}
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/30 border border-sky-200/70 dark:border-sky-700/40 text-sky-700 dark:text-sky-300 font-semibold">
            {getRoleEmoji("butler")} {names.butlerName} (Butler)
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-700/40 text-amber-700 dark:text-amber-300 font-semibold">
            {getRoleEmoji("receptionist")} {names.sameActor ? names.butlerName : names.receptionistName} (Receptionist)
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-50 dark:bg-violet-950/30 border border-violet-200/70 dark:border-violet-700/40 text-violet-700 dark:text-violet-300 font-semibold">
            {getRoleEmoji("guest")} {names.guestName} (Guest)
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {script.map((s, i) => (
            <button
              key={i}
              onClick={() => goScene(i)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                i === sceneIdx
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {i + 1}. {s.title.split("(")[0].trim()}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <h2 className="font-bold text-foreground text-base">
            Scene {sceneIdx + 1} — {scene.title}
          </h2>
          <button
            onClick={() => { setPracticeMode((v) => !v); setRevealed(new Set()); setAllDone(false); }}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              practiceMode
                ? "bg-sky-600 text-white border-sky-600"
                : "border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            {practiceMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {practiceMode ? "Practice ON" : "Practice"}
          </button>
        </div>

        {practiceMode && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground bg-sky-50 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-800/40 rounded-xl px-4 py-2.5">
            <Eye className="w-4 h-4 text-sky-500 shrink-0" />
            <span>
              Actor lines are hidden — tap each to reveal. Recite it first, then check.
              <span className="font-semibold text-sky-700 dark:text-sky-300 ml-1">
                {revealedCount}/{actorLineCount} revealed
              </span>
            </span>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={sceneIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            {scene.lines.map((line, i) => {
              const isActorLine = line.role === "butler" || line.role === "receptionist";
              const isHidden = practiceMode && isActorLine && !revealed.has(i);

              const actorName = getActorName(line.role, names);
              const roleLabel =
                line.role === "butler"
                  ? `${actorName} (Butler)`
                  : line.role === "receptionist"
                  ? `${actorName} (Receptionist)`
                  : line.role === "guest"
                  ? `${names.guestName} (Guest)`
                  : null;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`rounded-xl border px-4 py-3 ${ROLE_COLORS[line.role]} ${isActorLine && practiceMode ? "cursor-pointer" : ""}`}
                  onClick={() => practiceMode && isActorLine ? toggleReveal(i) : undefined}
                >
                  {roleLabel && (
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${ROLE_LABEL_COLORS[line.role]}`}>
                      {getRoleEmoji(line.role)} {roleLabel}
                    </p>
                  )}
                  {isHidden ? (
                    <div className="flex items-center gap-2 py-0.5">
                      <div className="flex-1 h-2 rounded-full bg-sky-200/80 dark:bg-sky-700/40" />
                      <span className="text-xs text-sky-500 font-medium shrink-0">Tap to reveal</span>
                    </div>
                  ) : (
                    <p className={`text-sm leading-relaxed ${line.role === "note" ? "text-muted-foreground italic text-xs" : "text-foreground"}`}>
                      {line.text}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {practiceMode && !allDone && revealedCount < actorLineCount && (
          <button
            onClick={revealAll}
            className="w-full py-2.5 rounded-xl border border-sky-300/60 text-sky-700 dark:text-sky-300 text-sm font-semibold hover:bg-sky-50 dark:hover:bg-sky-950/20 transition-colors"
          >
            Reveal All Lines
          </button>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            disabled={sceneIdx === 0}
            onClick={() => goScene(sceneIdx - 1)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-semibold disabled:opacity-30 hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          <span className="text-xs text-muted-foreground">{sceneIdx + 1} / {totalScenes}</span>

          {sceneIdx < totalScenes - 1 ? (
            <button
              onClick={() => goScene(sceneIdx + 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => goScene(0)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <RotateCcw className="w-4 h-4" /> Restart
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
