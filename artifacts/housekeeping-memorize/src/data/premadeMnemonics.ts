export interface PremadeMnemonic {
  slideNum: number;
  title: string;
  story: string;
}

export const premadeMnemonics: PremadeMnemonic[] = [
  {
    slideNum: 1,
    title: "Definition of Housekeeping — 'House + Keep'",
    story:
      "Break the word in half: HOUSE + KEEP. You KEEP the HOUSE in good shape.\n" +
      "That means three things: upkeep, cleanliness, maintenance — the 'UCM trio.'\n" +
      "Picture a janitor wearing a crown labeled 'UCM' standing in a hotel, mall, school, food chain, and hospital all at once. Anywhere people gather, housekeeping shows up.",
  },
  {
    slideNum: 2,
    title: "Types of Housekeeping — 'Home vs Hotel'",
    story:
      "Two doors. One says HOME (Domestic — cleanliness in a house).\n" +
      "The other says HOTEL (Institutional — cleanliness in lodging establishments).\n" +
      "Trick: 'Domestic = Door of your house.' 'Institutional = Inn (lodging).' Same job, different building.",
  },
  {
    slideNum: 3,
    title: "Organizational Chart — 'The 3 Supervisors Tree'",
    story:
      "Imagine the Executive Manager as a tree trunk with 3 branches:\n" +
      "1. HOUSEKEEPING Supervisor → Room Attendant, Chambermaid/Roomboy, Minibar Attendant (anything inside the room).\n" +
      "2. PUBLIC AREA Supervisor → Gardener, Lobby Attendant, Pest Control (anything outside or shared).\n" +
      "3. LINEN Supervisor → Linen Attendant, Laundry Attendant, Iron/Steam Press (anything fabric).\n" +
      "Memory hook: Rooms / Public / Linens = R-P-L = 'Really Polished Lobby.'",
  },
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
    title: "Check-Out Procedures — 'LCAR-DBM-VDPR-MFCC'",
    story:
      "Walk through the room top-to-bottom in 4 chunks:\n" +
      "ENTER (LCAR): Lost items → Curtains → AC → Remove dishes.\n" +
      "TRASH & BATH (DBM): Dishes/ashtrays empty → Bathroom clean → Make glasses & jug fresh.\n" +
      "BED & FLOOR (VDPR): Strip & make bed → Vacuum → Dust → Polish mirrors.\n" +
      "FINISH (MFCC): Make-up bathroom → Fix curtains → Check condition → Close door.\n" +
      "Mantra: 'Look, Empty, Wash, Bed, Floor, Finish, Lock.'",
  },
  {
    slideNum: 6,
    title: "Room Services — 'Morning, Noon, Night'",
    story:
      "Picture a clock with three jobs:\n" +
      "MORNING (7-8 PM the night before? No — Make Up Room is around 7-8): MUR.\n" +
      "NOON (11-12): Check Out — guest leaves at lunchtime.\n" +
      "NIGHT (5-9 PM): Turn Down Service — focus on the BED so the guest can sleep.\n" +
      "Memory hook: 'MUR-CO-TDS' = 'My Cousin Talks Dreamily Slowly.'",
  },
  {
    slideNum: 7,
    title: "Turndown Service — 'Cart, Knock, Bed, Bathroom, Lights'",
    story:
      "Imagine the night-shift movie:\n" +
      "1) Push the CART. 2) KNOCK / ring doorbell. 3) Hang make-up sign.\n" +
      "4) Turn down BED & fold blanket corner. 5) Check curtains.\n" +
      "6) Refill JUG. 7) Remove dishes. 8) Replenish towels.\n" +
      "9) Garbage. 10) Empty/wash ashtrays. 11) Wash glasses.\n" +
      "12) Check BATHROOM. 13) Turn off LIGHTS — goodnight.\n" +
      "Mantra: 'Cart-Knock-Bed-Drinks-Trash-Bath-Lights.'",
  },
  {
    slideNum: 8,
    title: "Room Cleaning Status Codes — The 'V-O' Rule",
    story:
      "V starts Vacant. O starts Occupied. C = Clean. D = Dirty.\n" +
      "VC = Vacant Clean (ready to sell). VD = Vacant Dirty (guest left a mess).\n" +
      "OC = Occupied Clean. OD = Occupied Dirty.\n" +
      "OOO = the room yelling 'Ow! Ow! Ow!' because it's broken — Out of Order.\n" +
      "Inspected/Ready Room = the supervisor gave it a thumbs up.",
  },
  {
    slideNum: 9,
    title: "Occupancy Codes — 'Who's in the Room?'",
    story:
      "Think of the front desk asking, 'Is anyone in there?'\n" +
      "OCC = Occupied. VAC = Vacant. RES = Reserved (saved for someone).\n" +
      "SO = Stayover (guest is staying another night).\n" +
      "DO = Due Out (leaving today). CO = Check-Out (already left).\n" +
      "NS = No Show (booked but never arrived — 'Nope, See ya').",
  },
  {
    slideNum: 10,
    title: "Guest Privacy Codes — 'Leave Me Alone' Codes",
    story:
      "Three signs hanging on the doorknob:\n" +
      "DND = Do Not Disturb (guest is sleeping).\n" +
      "DL = Double Lock (guest locked it twice — extra privacy).\n" +
      "RS = Refused Service (guest waved you off — 'No cleaning today').",
  },
  {
    slideNum: 11,
    title: "Maintenance / Availability Codes — 'Out of...' Family",
    story:
      "Most start with 'OO' which sounds like 'Ow!' — something is wrong.\n" +
      "OOO = Out of Order (broken). OOS = Out of Service (temporarily unusable).\n" +
      "OUI / OOI = Out of Inventory (not for sale).\n" +
      "VC = Vacant Clean (ready). Blocked Room = held for VIP/group.\n" +
      "Trick: 'Two O's = Trouble. One V = Vacant.'",
  },
  {
    slideNum: 12,
    title: "Common Types of Rooms — 'STD-SDEFCS' (Sing-Double-Twin)",
    story:
      "Group them in pairs based on bed/people:\n" +
      "PEOPLE: Single (1), Double (1 big bed, 2 ppl), Twin (2 beds), Triple (3 ppl).\n" +
      "LUXURY: Suite (living area), Deluxe (upgraded), Executive (business perks).\n" +
      "GROUPS: Family (big), Connecting (door between rooms), Studio (open layout).\n" +
      "Memory chant: 'One-Two-Twin-Three / Suite-Deluxe-Exec / Family-Connect-Studio.'",
  },
  {
    slideNum: 13,
    title: "Housekeeping Cart — 'BCTLO' (Bath, Coffee, Trash, Linen, Other)",
    story:
      "Picture the cart with 5 shelves stacked top to bottom:\n" +
      "BATH supplies (Shampoo, Conditioner, Toothpaste/brush, Slippers, Tissue, Shower cap, Cotton buds, Soap).\n" +
      "CONSUMABLES (Coffee, Tea, Sugar, Cream, Water — the 'CTSCW morning kit').\n" +
      "TRASH & SOILED LINEN bags.\n" +
      "LAYERS (Towels, Linen, Comforter — top to bottom of a bed).\n" +
      "OTHER (Mop + Cleaning chemicals).\n" +
      "Mantra: 'Bath-Drink-Trash-Bed-Tools.'",
  },
  {
    slideNum: 14,
    title: "Common Room Amenities — 'Room vs Bathroom'",
    story:
      "Two zones, two lists.\n" +
      "ROOM (sit/sleep/work): Bed, AC/Heater, TV, Phone, Wi-Fi, Minibar, Kettle, Desk, Wardrobe, Lamps, Safe Box, Curtains, Trash Bin.\n" +
      "BATHROOM (clean/dry): Towels, Soap/Shampoo/Conditioner, Toilet Paper, Hair Dryer.\n" +
      "Trick: If you'd watch TV with it = Room. If you'd get wet with it = Bathroom.",
  },
  {
    slideNum: 15,
    title: "Parts of the Bed — The 'Bed Sandwich'",
    story:
      "Build the bed like a sandwich from the bottom up:\n" +
      "Bed Frame = the plate. Box Spring = the trampoline (shock absorber).\n" +
      "Mattress = the main bread. Bed Pad = the diaper (protects mattress).\n" +
      "Bed Skirt = the modesty curtain (hides the frame).\n" +
      "Headboard = the pillow-stopper. Footboard = decorative bumper at the feet.",
  },
  {
    slideNum: 16,
    title: "Cleaning Tools (Set 1) — 'Floor & High Places'",
    story:
      "Set 1 = the BIG tools you swing around the floor and ceiling.\n" +
      "Picture a janitor: Broom in one hand, Mop in the other, Mop Squeezer (Wringer) at his feet, a yellow Caution Sign next to him, a Squeegee on his belt, and a long Ceiling/Cobweb Broom on his back like a sword.\n" +
      "Mantra: 'Sweep-Mop-Squeeze-Sign-Squeegee-Cobweb.'",
  },
  {
    slideNum: 17,
    title: "Cleaning Tools (Set 2) — The 'Bubble Bath' Scene",
    story:
      "Set 2 = the SMALL tools for bathroom & detail cleaning.\n" +
      "Picture one giant character that wears every tool at once:\n" +
      "A giant Toilet Bowl Brush, wearing a Soft Sponge as a hat, holding a Spray Bottle like a gun, scrubbing with a Hand Brush, standing inside a Pail (Bucket) of Air Freshener.\n" +
      "One weird image = all six tools remembered together.",
  },
];

export function getPremadeMnemonic(slideNum: number): PremadeMnemonic | undefined {
  return premadeMnemonics.find(m => m.slideNum === slideNum);
}
