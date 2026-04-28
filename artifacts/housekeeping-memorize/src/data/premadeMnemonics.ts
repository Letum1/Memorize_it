export interface PremadeMnemonic {
  slideNum: number;
  title: string;
  story: string;
}

export const premadeMnemonics: PremadeMnemonic[] = [
  {
    slideNum: 4,
    title: "The 5S System — The 'S-Train'",
    story:
      "Picture a messy room you have to fix in 5 stages.\n" +
      "1. Sort (Seiri — 'See-rye'): throw the trash out the window. Bye-bye trash.\n" +
      "2. Set in Order (Seiton — 'Stay-ton'): line up your shoes in a perfect row. Stay in your spot.\n" +
      "3. Shine (Seiso — 'Say-so'): scrub the floor until it's a mirror. So clean!\n" +
      "4. Standardize (Seiketsu — 'Stay-ketsu'): write a rulebook for the room. Keep the rules.\n" +
      "5. Sustain (Shitsuke — 'She-suke'): do a push-up to show discipline. She stays disciplined.",
  },
  {
    slideNum: 5,
    title: "Check-Out Procedures — 'GREET-CHECK-CLEAR-LOCK'",
    story:
      "Walk through it like a movie scene at the front desk.\n" +
      "GREET the guest with a smile and ask for the room key.\n" +
      "CHECK their bill (mini-bar, phone, extras) and confirm the charges.\n" +
      "CLEAR the room: notify housekeeping, get their luggage, and verify nothing is left behind.\n" +
      "LOCK it down: settle payment, return their card/ID, and wish them safe travels.\n" +
      "Mantra: Greet, Check, Clear, Lock — every guest, every time.",
  },
  {
    slideNum: 8,
    title: "Room Status Codes — The 'V-O' Rule",
    story:
      "V starts Vacant. O starts Occupied. C = Clean. D = Dirty.\n" +
      "VC = Vacant Clean (ready to sell). VD = Vacant Dirty (guest left a mess).\n" +
      "OC = Occupied Clean. OD = Occupied Dirty.\n" +
      "OOO = the room yelling 'Ow! Ow! Ow!' because it's broken — Out of Order.",
  },
  {
    slideNum: 9,
    title: "More Status Codes — V-O Rule continued",
    story:
      "Same V/O rule as Slide 8. Add these:\n" +
      "DND = Do Not Disturb (guest wants peace).\n" +
      "SO = Sleep Out (guest paid but slept elsewhere).\n" +
      "SLO = Slept Out — bed wasn't used.\n" +
      "Picture each code as a door sign you'd hang on the room.",
  },
  {
    slideNum: 15,
    title: "Parts of the Bed — The 'Bed Sandwich'",
    story:
      "Build the bed like a sandwich from the bottom up:\n" +
      "Bed Pad = the 'diaper' (protects the mattress).\n" +
      "Bed Skirt = the 'modesty' (hides the ugly legs/frame).\n" +
      "Box Spring = the 'trampoline' (shock absorber).\n" +
      "Headboard = the 'pillow-stopper.'",
  },
  {
    slideNum: 17,
    title: "Cleaning Tools — The 'Bubble Bath' Scene",
    story:
      "Picture one giant character that wears every tool at once:\n" +
      "A giant Toilet Brush, wearing a Soft Sponge as a hat, holding a Spray Bottle like a gun, standing inside a Pail of Air Freshener.\n" +
      "One weird image = all five tools remembered together.",
  },
];

export function getPremadeMnemonic(slideNum: number): PremadeMnemonic | undefined {
  return premadeMnemonics.find(m => m.slideNum === slideNum);
}
