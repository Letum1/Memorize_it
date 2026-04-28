import { housekeepingContent, FlashcardQuestion, slideTitles, totalSlides } from "./content";

export interface SlideContent {
  slideNum: number;
  title: string;
  facts: { id: string; front: string; back: string }[];
}

export function getAllSlideContent(): SlideContent[] {
  const bySlide = new Map<number, SlideContent>();
  for (let i = 1; i <= totalSlides; i++) {
    bySlide.set(i, { slideNum: i, title: slideTitles[i - 1], facts: [] });
  }
  for (const q of housekeepingContent) {
    if (q.type !== 'flashcard') continue;
    const fc = q as FlashcardQuestion;
    const slide = bySlide.get(fc.slideNum);
    if (slide) {
      slide.facts.push({ id: fc.id, front: fc.front, back: fc.back });
    }
  }
  return Array.from(bySlide.values());
}

export function getSlide(slideNum: number): SlideContent | undefined {
  return getAllSlideContent().find(s => s.slideNum === slideNum);
}
