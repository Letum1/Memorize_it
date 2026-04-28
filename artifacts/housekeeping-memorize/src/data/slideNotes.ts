export interface NoteItem {
  label: string;
  sub?: string[];
}

export interface SlideNote {
  slideNum: number;
  title: string;
  intro?: string;
  groups?: { heading?: string; items: NoteItem[] }[];
  items?: NoteItem[];
}

export const slideNotes: SlideNote[] = [
  {
    slideNum: 1,
    title: "Definition of Housekeeping",
    items: [
      { label: "Refers to upkeep, cleanliness, and maintenance in houses or lodging establishments." },
      { label: "Examples: hotels, malls, schools, food chains, hospitals." },
    ],
  },
  {
    slideNum: 2,
    title: "Types of Housekeeping",
    items: [
      { label: "Domestic Housekeeping", sub: ["Cleanliness in a house."] },
      { label: "Institutional Housekeeping", sub: ["Cleanliness in lodging establishments."] },
    ],
  },
  {
    slideNum: 3,
    title: "Organizational Chart",
    intro: "Executive Manager",
    groups: [
      {
        heading: "Housekeeping Supervisor",
        items: [
          { label: "Room Attendant" },
          { label: "Chambermaid / Roomboy" },
          { label: "Minibar Attendant" },
        ],
      },
      {
        heading: "Public Area Superior",
        items: [
          { label: "Gardener" },
          { label: "Public Area Attendant (Lobby)" },
          { label: "Pest Control" },
        ],
      },
      {
        heading: "Linen Supervisor",
        items: [
          { label: "Linen Attendant" },
          { label: "Laundry Attendant" },
          { label: "Iron / Steam Pressed" },
        ],
      },
    ],
  },
  {
    slideNum: 4,
    title: "5S in Housekeeping",
    items: [
      { label: "Sort (Seiri)", sub: ["Remove unnecessary items."] },
      { label: "Set in Order (Seiton)", sub: ["Arrange items for easy use."] },
      { label: "Shine (Seiso)", sub: ["Clean regularly."] },
      { label: "Standardize (Seiketsu)", sub: ["Create rules and routines."] },
      { label: "Sustain (Shitsuke)", sub: ["Maintain discipline and habits."] },
    ],
  },
  {
    slideNum: 5,
    title: "Check-Out Room Procedures",
    items: [
      { label: "Check for lost items." },
      { label: "Pull curtains / blinds." },
      { label: "Adjust AC temperature." },
      { label: "Remove soiled dishes." },
      { label: "Empty ashtrays / waste." },
      { label: "Clean bathroom." },
      { label: "Wash glasses." },
      { label: "Clean / refill jug." },
      { label: "Strip bed linen." },
      { label: "Make bed." },
      { label: "Vacuum floor / carpet." },
      { label: "Dust furniture." },
      { label: "Polish mirrors / fixtures." },
      { label: "Replenish supplies." },
      { label: "Make up bathroom." },
      { label: "Fix curtains." },
      { label: "Check condition." },
      { label: "Close door." },
    ],
  },
  {
    slideNum: 6,
    title: "Room Services",
    items: [
      { label: "Make Up Room (MUR): 7-8 PM" },
      { label: "Check Out: 11 AM - 12 NN" },
      { label: "Turn Down Service: 5-9 PM (focus on bed)" },
    ],
  },
  {
    slideNum: 7,
    title: "Turndown Service Procedure",
    items: [
      { label: "Place cart." },
      { label: "Knock / activate doorbell." },
      { label: "Hang make-up sign." },
      { label: "Turn down bed." },
      { label: "Fold blanket corner." },
      { label: "Check curtains." },
      { label: "Refill jug." },
      { label: "Remove dishes." },
      { label: "Replenish towels." },
      { label: "Check garbage." },
      { label: "Empty / wash ashtrays." },
      { label: "Wash glasses." },
      { label: "Check bathroom." },
      { label: "Turn off lights." },
    ],
  },
  {
    slideNum: 8,
    title: "Room Cleaning Status Codes",
    items: [
      { label: "VC: Vacant Clean" },
      { label: "VD: Vacant Dirty" },
      { label: "OC: Occupied Clean" },
      { label: "OD: Occupied Dirty" },
      { label: "OOO: Out of Order" },
      { label: "Inspected / Ready Room" },
    ],
  },
  {
    slideNum: 9,
    title: "Occupancy Codes",
    items: [
      { label: "OCC: Occupied" },
      { label: "VAC: Vacant" },
      { label: "RES: Reserved" },
      { label: "SO: Stayover" },
      { label: "DO: Due Out" },
      { label: "CO: Check-Out" },
      { label: "NS: No Show" },
    ],
  },
  {
    slideNum: 10,
    title: "Guest Privacy Codes",
    items: [
      { label: "DND: Do Not Disturb" },
      { label: "DL: Double Lock" },
      { label: "RS: Refused Service" },
    ],
  },
  {
    slideNum: 11,
    title: "Maintenance / Availability Codes",
    items: [
      { label: "OOO: Out of Order" },
      { label: "OOS: Out of Service" },
      { label: "OUI: Out of Inventory" },
      { label: "OOI: Out of Inventory (Internal Use)" },
      { label: "VC: Vacant Clean" },
      { label: "Blocked Room" },
    ],
  },
  {
    slideNum: 12,
    title: "Common Types of Rooms",
    items: [
      { label: "Single Room" },
      { label: "Double Room" },
      { label: "Twin Room" },
      { label: "Triple Room" },
      { label: "Suite Room" },
      { label: "Deluxe Room" },
      { label: "Executive Room" },
      { label: "Family Room" },
      { label: "Connecting Room" },
      { label: "Studio Room" },
    ],
  },
  {
    slideNum: 13,
    title: "Housekeeping Cart",
    groups: [
      {
        heading: "Bath Supplies",
        items: [
          { label: "Shampoo" },
          { label: "Conditioner" },
          { label: "Toothpaste" },
          { label: "Toothbrush" },
          { label: "Slippers" },
          { label: "Tissue" },
          { label: "Shower cap" },
          { label: "Cotton buds" },
          { label: "Soap" },
        ],
      },
      {
        heading: "Consumables",
        items: [
          { label: "Coffee" },
          { label: "Tea" },
          { label: "Sugar" },
          { label: "Cream" },
          { label: "Water" },
        ],
      },
      {
        heading: "Trash & Soiled Linen",
        items: [{ label: "Trash bags" }, { label: "Soiled linen bags" }],
      },
      {
        heading: "Layers",
        items: [{ label: "Towels" }, { label: "Linen" }, { label: "Comforter" }],
      },
      {
        heading: "Other",
        items: [{ label: "Mop" }, { label: "Cleaning chemicals" }],
      },
    ],
  },
  {
    slideNum: 14,
    title: "Common Room Amenities",
    groups: [
      {
        heading: "Room",
        items: [
          { label: "Bed" },
          { label: "AC / heater" },
          { label: "TV" },
          { label: "Telephone" },
          { label: "Wi-Fi" },
          { label: "Minibar" },
          { label: "Kettle / coffee maker" },
          { label: "Desk" },
          { label: "Wardrobe" },
          { label: "Lamps" },
          { label: "Safe box" },
          { label: "Curtains" },
          { label: "Trash bin" },
        ],
      },
      {
        heading: "Bathroom",
        items: [
          { label: "Towels" },
          { label: "Soap / shampoo / conditioner" },
          { label: "Toilet paper" },
          { label: "Hair dryer" },
        ],
      },
    ],
  },
  {
    slideNum: 15,
    title: "Parts of the Bed",
    items: [
      { label: "Headboard", sub: ["Prevents pillows from sliding."] },
      { label: "Footboard", sub: ["Decorative, keeps linens in place."] },
      { label: "Bed Pad", sub: ["Protects mattress."] },
      { label: "Mattress", sub: ["Main support."] },
      { label: "Bed Skirt", sub: ["Hides frame / storage."] },
      { label: "Bed Frame", sub: ["Structural support."] },
      { label: "Bed Springs / Box Spring", sub: ["Shock absorption."] },
    ],
  },
  {
    slideNum: 16,
    title: "Cleaning Tools (Set 1)",
    items: [
      { label: "Mop Squeezer (Wringer)" },
      { label: "Caution Sign" },
      { label: "Mop" },
      { label: "Ceiling / Cobweb Broom" },
      { label: "Broom" },
      { label: "Squeegee" },
    ],
  },
  {
    slideNum: 17,
    title: "Cleaning Tools (Set 2)",
    items: [
      { label: "Spray Bottle" },
      { label: "Hand Brush" },
      { label: "Soft Sponge" },
      { label: "Toilet Bowl Brush" },
      { label: "Pail (Bucket)" },
      { label: "Air Freshener" },
    ],
  },
];
