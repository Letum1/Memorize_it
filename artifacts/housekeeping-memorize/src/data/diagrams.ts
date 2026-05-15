export interface DiagramLabel {
  number: number;
  answer: string;
  hint?: string;
  synonyms?: string[];
}

export interface MaskRegion {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Diagram {
  id: string;
  title: string;
  imageUrl: string;
  labels: DiagramLabel[];
  maskRegions?: MaskRegion[];
}

export const diagrams: Diagram[] = [
  {
    id: "vacuum",
    title: "Vacuum",
    imageUrl: "/diagram-vacuum.jpeg",
    maskRegions: [
      { x: 0,  y: 6,  w: 32, h: 6 },
      { x: 0,  y: 16, w: 32, h: 6 },
      { x: 0,  y: 26, w: 32, h: 6 },
      { x: 0,  y: 38, w: 32, h: 6 },
      { x: 0,  y: 51, w: 32, h: 6 },
      { x: 0,  y: 63, w: 32, h: 6 },
      { x: 62, y: 5,  w: 38, h: 6 },
      { x: 62, y: 18, w: 38, h: 6 },
      { x: 62, y: 33, w: 38, h: 6 },
      { x: 62, y: 49, w: 38, h: 6 },
    ],
    labels: [
      { number: 1, answer: "Handle", hint: "Firm grip for carrying and moving" },
      { number: 2, answer: "Top Cover", hint: "Protects the motor and internal components" },
      { number: 3, answer: "Water Proof Switch", synonyms: ["Waterproof Switch", "Water-Proof Switch"], hint: "Dust and water proof switch for safe operation" },
      { number: 4, answer: "Middle Cover", hint: "Joins the top cover and barrel, houses the motor assembly" },
      { number: 5, answer: "Barrel Cover", hint: "Secures the top assembly to the barrel" },
      { number: 6, answer: "Stainless Steel Barrel", synonyms: ["Stainless Barrel"], hint: "Durable and rust resistant barrel for wet and dry collection" },
      { number: 7, answer: "Suction Port", hint: "Inlet where dust or liquid is sucked into the vacuum" },
      { number: 8, answer: "Floor Brush", hint: "Used to clean floors and large surface areas" },
      { number: 9, answer: "Horse & Wand Tube", synonyms: ["Hose & Wand Tube", "Hose and Wand Tube", "Horse and Wand Tube"], hint: "Flexible hose and metal wand tube for extended reach" },
      { number: 10, answer: "Universal Wheels", synonyms: ["Caster Wheels", "Universal Wheels (Caster Wheels)"], hint: "360° rotating wheels for easy movement" },
    ],
  },
  {
    id: "floor-polisher",
    title: "Floor Polisher",
    imageUrl: "/diagram-floor-polisher.jpeg",
    maskRegions: [
      { x: 50, y: 3,  w: 50, h: 14 },
      { x: 50, y: 20, w: 50, h: 8  },
      { x: 50, y: 31, w: 50, h: 13 },
      { x: 50, y: 47, w: 50, h: 9  },
      { x: 50, y: 59, w: 50, h: 9  },
      { x: 50, y: 70, w: 50, h: 9  },
      { x: 50, y: 81, w: 50, h: 8  },
    ],
    labels: [
      { number: 1, answer: "Operation Control", hint: "Controls the power ON/OFF and operating speed" },
      { number: 2, answer: "Handle Tube", hint: "Provides comfortable grip and control for maneuvering" },
      { number: 3, answer: "Power Cord", hint: "Supplies electrical power to the machine" },
      { number: 4, answer: "Sandpaper Driver", hint: "Rotates to hold and drive the sandpaper or polishing pad" },
      { number: 5, answer: "Transport Wheels", hint: "Used to tilt and move the machine easily" },
      { number: 6, answer: "All Metal Housing", hint: "Durable metal construction for strength and long service life" },
      { number: 7, answer: "Pad Diameter", hint: "Determines the cleaning or polishing coverage (13\", 17\", 20\")" },
    ],
  },
  {
    id: "bed",
    title: "The Bed and Its Parts",
    imageUrl: "/diagram-bed.jpeg",
    maskRegions: [
      { x: 55, y: 4,  w: 45, h: 8 },
      { x: 0,  y: 20, w: 40, h: 8 },
      { x: 55, y: 32, w: 45, h: 8 },
      { x: 0,  y: 55, w: 40, h: 8 },
      { x: 55, y: 70, w: 45, h: 8 },
      { x: 0,  y: 82, w: 40, h: 8 },
      { x: 55, y: 82, w: 45, h: 8 },
    ],
    labels: [
      { number: 1, answer: "Headboard", hint: "At the head of the bed; provides back support when sitting up" },
      { number: 2, answer: "Bed Pad", hint: "Extra layer of cushioning; protects the mattress" },
      { number: 3, answer: "Mattress", hint: "Main cushioned surface that supports your body while you sleep" },
      { number: 4, answer: "Bed Skirt", hint: "Hangs down from the sides; hides the space under the bed" },
      { number: 5, answer: "Footboard", hint: "At the foot of the bed; helps keep bedding in place" },
      { number: 6, answer: "Bed Frame", hint: "Provides structure and support for the mattress" },
      { number: 7, answer: "Bed Springs", hint: "Placed on the frame to absorb weight and provide flexibility" },
    ],
  },
  {
    id: "laundry-standard",
    title: "Standard Procedure in Laundry",
    imageUrl: "/diagram-laundry.jpeg",
    maskRegions: [
      { x: 5, y: 8,  w: 90, h: 12 },
      { x: 5, y: 27, w: 90, h: 12 },
      { x: 5, y: 46, w: 90, h: 12 },
      { x: 5, y: 63, w: 90, h: 12 },
      { x: 5, y: 80, w: 90, h: 12 },
    ],
    labels: [
      { number: 1, answer: "Sorting", hint: "First step — separate items before washing" },
      { number: 2, answer: "Pre-treating Stains", synonyms: ["Pretreating Stains", "Pre treating Stains"], hint: "Treat stains before loading" },
      { number: 3, answer: "Loading", hint: "Place items into the machine" },
      { number: 4, answer: "Selecting Detergent", hint: "Choose the right cleaning agent" },
      { number: 5, answer: "Drying and Finishing", synonyms: ["Drying & Finishing"], hint: "Final step — dry and finish the laundry" },
    ],
  },
];
