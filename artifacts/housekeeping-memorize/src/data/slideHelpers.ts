import { slideNotes, SlideNote } from "./slideNotes";

export interface SlideFact {
  id: string;
  label: string;
  detail: string;
}

export interface SlidePair {
  id: string;
  term: string;
  definition: string;
}

export interface FullSlide {
  slideNum: number;
  title: string;
  facts: SlideFact[];
  pairs: SlidePair[];
  rawText: string;
}

function buildSlide(note: SlideNote): FullSlide {
  const facts: SlideFact[] = [];
  const pairs: SlidePair[] = [];
  const rawLines: string[] = [];

  if (note.intro) {
    rawLines.push(note.intro);
  }

  if (note.items) {
    note.items.forEach((item, i) => {
      const id = `s${note.slideNum}-i${i}`;
      const detail = item.sub && item.sub.length > 0 ? item.sub.join(" ") : "";
      facts.push({ id, label: item.label, detail });
      rawLines.push(detail ? `${item.label} — ${detail}` : item.label);
      if (detail) {
        pairs.push({ id, term: item.label, definition: detail });
      }
    });
  }

  if (note.groups) {
    note.groups.forEach((group, gi) => {
      if (group.heading) rawLines.push(group.heading);
      group.items.forEach((item, i) => {
        const id = `s${note.slideNum}-g${gi}-i${i}`;
        const detail = item.sub && item.sub.length > 0 ? item.sub.join(" ") : (group.heading || "");
        facts.push({
          id,
          label: item.label,
          detail: item.sub && item.sub.length > 0 ? item.sub.join(" ") : "",
        });
        rawLines.push(item.sub && item.sub.length > 0 ? `${item.label} — ${item.sub.join(" ")}` : item.label);
        if (group.heading) {
          pairs.push({ id, term: item.label, definition: group.heading });
        } else if (item.sub && item.sub.length > 0) {
          pairs.push({ id, term: item.label, definition: item.sub.join(" ") });
        }
      });
    });
  }

  return {
    slideNum: note.slideNum,
    title: note.title,
    facts,
    pairs,
    rawText: rawLines.join("\n"),
  };
}

export function getAllFullSlides(): FullSlide[] {
  return slideNotes.map(buildSlide);
}

export function getFullSlide(slideNum: number): FullSlide | undefined {
  const note = slideNotes.find(s => s.slideNum === slideNum);
  return note ? buildSlide(note) : undefined;
}
