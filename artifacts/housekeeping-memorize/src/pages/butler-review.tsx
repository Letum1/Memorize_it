import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Settings2, Eye, EyeOff, RotateCcw, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

const STORAGE_KEY = "butler-names-v1";

interface ButlerNames {
  butlerName: string;
  guestName: string;
  guestCity: string;
  hotelName: string;
}

const DEFAULTS: ButlerNames = {
  butlerName: "Jessica",
  guestName: "Cresel",
  guestCity: "Taguig City",
  hotelName: "TMTC Hotel",
};

function loadNames(): ButlerNames {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

function saveNames(names: ButlerNames) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
  } catch {}
}

type Role = "butler" | "guest" | "note";

interface Line {
  role: Role;
  text: string;
}

interface Scene {
  title: string;
  lines: Line[];
}

function buildScript(n: ButlerNames): Scene[] {
  const B = n.butlerName.toUpperCase();
  const G = n.guestName.toUpperCase();
  const b = n.butlerName;
  const g = n.guestName;
  const city = n.guestCity;
  const hotel = n.hotelName;

  return [
    {
      title: "Arrival of the Guest",
      lines: [
        { role: "butler", text: `Good morning, Ma'am. Welcome to ${hotel}. My name is ${b}, your butler for today. May I assist you with your luggage?` },
        { role: "guest", text: "Yes, please." },
        { role: "butler", text: "Thank you, Ma'am. Please allow me to escort you to the front desk for your check-in." },
      ],
    },
    {
      title: "Front Desk Check-In",
      lines: [
        { role: "butler", text: `Good morning, Ma'am. Welcome to ${hotel}. How may I assist you?` },
        { role: "guest", text: "Good morning. I would like to check in." },
        { role: "butler", text: "Certainly, Ma'am. May I have your name, please?" },
        { role: "guest", text: `My name is ${g}${city ? ` from ${city}` : ""}.` },
        { role: "butler", text: `One moment, please… Mrs. ${g}, I can see your reservation here. You have booked one Junior Deluxe Room for tonight.` },
        { role: "guest", text: "Yes, that's correct." },
        { role: "butler", text: "May I please see a valid ID?" },
        { role: "guest", text: "Of course." },
        { role: "note", text: "(Hand ID to the receptionist)" },
        { role: "butler", text: "Thank you, Ma'am. Kindly sign here and write your contact number." },
        { role: "butler", text: `Mrs. ${g}, your room number is 106. Here is your key card, along with your ID and your breakfast voucher for two persons. Breakfast is served tomorrow morning. Is there anything else I may assist you with?` },
        { role: "guest", text: "No, thank you." },
        { role: "butler", text: `Our butler will now escort you to your room. We hope you enjoy your stay. Please dial 103 if you need any assistance.` },
      ],
    },
    {
      title: "Escorting to the Room",
      lines: [
        { role: "butler", text: "Ma'am, please allow me to escort you to your room." },
        { role: "butler", text: `Before we arrive, allow me to briefly introduce our hotel facilities. Breakfast is served from 6:00 AM to 10:00 AM at the lobby restaurant. The café and business center are located in the lobby, while the meeting rooms are on the 2nd floor. Our pool, spa, and gym are located on the 5th floor. Please let me know if you would like assistance with reservations.` },
        { role: "guest", text: "Thank you for the information. I appreciate it." },
      ],
    },
    {
      title: "Room Familiarization",
      lines: [
        { role: "butler", text: "We are now in front of your room, Ma'am. May I have your key card?" },
        { role: "note", text: "(Enters room, places luggage on rack)" },
        { role: "butler", text: "Please have a seat, Ma'am." },
        { role: "butler", text: "Allow me to introduce your room facilities. The room is equipped with a safety deposit box, minibar, television with remote control, telephone with a dedicated service line, air conditioning, and a bedside lamp. The bathroom includes hot and cold shower controls." },
        { role: "guest", text: "Thank you. That's very helpful." },
      ],
    },
    {
      title: "Unpacking of Clothes",
      lines: [
        { role: "butler", text: "Ma'am, would you like me to assist you with unpacking your clothes?" },
        { role: "guest", text: "Yes, please." },
        { role: "butler", text: "Your clothes have been neatly arranged in the wardrobe. Is there anything else I may assist you with?" },
        { role: "guest", text: "No, that's all." },
        { role: "butler", text: "Thank you, Ma'am. May I take my leave?" },
        { role: "guest", text: "Sure, you can leave now. Thank you!" },
      ],
    },
    {
      title: "Packing of Clothes (Upon Request)",
      lines: [
        { role: "note", text: "(Knocks the door 3×) Butler service." },
        { role: "guest", text: "Please come in." },
        { role: "butler", text: "Ma'am, I understand that you requested assistance with packing your belongings." },
        { role: "guest", text: "Yes, that's correct. I would appreciate your assistance." },
        { role: "butler", text: "Your belongings are now packed and ready. May I assist you to the front desk for check-out?" },
        { role: "guest", text: "Yes, please." },
      ],
    },
    {
      title: "Check-Out at the Front Desk",
      lines: [
        { role: "butler", text: "Ma'am, our guest is here for checking out." },
        { role: "butler", text: "Good morning, Ma'am. Are you checking out today?" },
        { role: "guest", text: "Yes, I am. I would like to check out, please." },
        { role: "butler", text: `Thank you for staying with us. We look forward to welcoming you again. Have a wonderful day!` },
        { role: "guest", text: "Thank you. I really enjoyed my stay. I'll definitely come back." },
      ],
    },
  ];
}

function SettingsPanel({ names, onChange, onClose }: {
  names: ButlerNames;
  onChange: (n: ButlerNames) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(names);

  function field(key: keyof ButlerNames, label: string, placeholder: string) {
    return (
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
        <input
          className="w-full border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          value={draft[key]}
          placeholder={placeholder}
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
      <h2 className="font-semibold text-foreground">Customize Names</h2>
      {field("butlerName", "Butler / Receptionist Name", "e.g. Jessica")}
      {field("guestName", "Guest Name", "e.g. Cresel")}
      {field("guestCity", "Guest's City", "e.g. Taguig City")}
      {field("hotelName", "Hotel Name", "e.g. TMTC Hotel")}
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
  guest: "bg-violet-50 dark:bg-violet-950/30 border-violet-200/70 dark:border-violet-700/40",
  note: "bg-muted/40 border-border",
};

const ROLE_LABEL_COLORS: Record<Role, string> = {
  butler: "text-sky-700 dark:text-sky-300",
  guest: "text-violet-700 dark:text-violet-300",
  note: "text-muted-foreground",
};

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
    const butlerIndices = scene.lines
      .map((l, i) => (l.role === "butler" ? i : -1))
      .filter((i) => i >= 0);
    setRevealed(new Set(butlerIndices));
    setAllDone(true);
  }

  const butlerLineCount = scene.lines.filter((l) => l.role === "butler").length;
  const revealedCount = [...revealed].filter((i) => scene.lines[i]?.role === "butler").length;

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
            <h1 className="text-xl font-bold tracking-tight">Butler Review</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {names.butlerName} · {names.hotelName}
            </p>
          </div>
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
              Butler lines are hidden — tap each line to reveal it. Recite it first, then check.
              <span className="font-semibold text-sky-700 dark:text-sky-300 ml-1">
                {revealedCount}/{butlerLineCount} revealed
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
              const isButlerLine = line.role === "butler";
              const isHidden = practiceMode && isButlerLine && !revealed.has(i);
              const roleLabel =
                line.role === "butler"
                  ? names.butlerName
                  : line.role === "guest"
                  ? names.guestName
                  : null;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`rounded-xl border px-4 py-3 ${ROLE_COLORS[line.role]} ${isButlerLine && practiceMode ? "cursor-pointer" : ""}`}
                  onClick={() => practiceMode && isButlerLine ? toggleReveal(i) : undefined}
                >
                  {roleLabel && (
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${ROLE_LABEL_COLORS[line.role]}`}>
                      {line.role === "butler" ? "🫡" : "🙋"} {roleLabel}
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

        {practiceMode && !allDone && revealedCount < butlerLineCount && (
          <button
            onClick={revealAll}
            className="w-full py-2.5 rounded-xl border border-sky-300/60 text-sky-700 dark:text-sky-300 text-sm font-semibold hover:bg-sky-50 dark:hover:bg-sky-950/20 transition-colors"
          >
            Reveal All Butler Lines
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
