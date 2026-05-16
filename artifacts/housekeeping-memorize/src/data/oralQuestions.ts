export interface OralQuestion {
  id: number;
  question: string;
  answer: string[];
}

export const oralQuestions: OralQuestion[] = [
  {
    id: 1,
    question: "Which one will you prioritize: check out room or make up room?",
    answer: [
      "Make up room — because there is still a guest inside.",
      "Check out room — when the guest is already out.",
    ],
  },
  {
    id: 2,
    question: "How do you manage waste and garbage?",
    answer: [
      "Proper segregation: separate biodegradable, non-biodegradable, and recyclable.",
    ],
  },
  {
    id: 3,
    question: "How do you maintain housekeeping equipment?",
    answer: ["Clean before and after use."],
  },
  {
    id: 4,
    question: "What is PPE and what is its purpose?",
    answer: [
      "PPE stands for Personal Protective Equipment.",
      "Purpose: For safety and protection.",
      "Examples: Gloves, Apron, Hairnet, Face mask.",
    ],
  },
  {
    id: 5,
    question: "Explain the procedure in Ironing.",
    answer: [
      "Prepare the ironing board and iron.",
      "Check the iron's cord.",
      "Ensure the iron is clean and filled with water if using steam.",
      "Set the correct temperature based on the clothing's care label.",
      "Long Sleeve – Wrong side: 1st collar, 2nd shoulder (both), 3rd sleeve (both), 4th body (without button side → up to button side).",
      "Long Sleeve – Right side: same procedure, then hang immediately to prevent wrinkles.",
      "Slacks – Wrong side: 1st waist, 2nd pockets, 3rd hips, 4th hip lines.",
      "Slacks – Right side: 1st waist, 2nd button side and zipper, 3rd hips, 4th hip lines — then hang immediately.",
    ],
  },
  {
    id: 6,
    question: "How do you do Make Up Room, Check Out Room, and Turndown Service?",
    answer: [
      "MAKE UP ROOM: Place cart → knock → empty trash → wash glasses & refill thermos → replenish linen → make bed → clean/vacuum floor → dust furniture & polish mirror → replenish supplies → make up bathroom → check overall condition.",
      "CHECK OUT ROOM: Check for left items → pull curtains → adjust AC → remove soiled dishes → empty ashtrays & waste → clean bathroom → wash glasses → clean & refill thermos → strip bed → make bed → vacuum floor/carpet → dust furniture → polish mirror & metal fixtures → replenish supplies → make up bathroom → fix curtains → check overall condition → close door.",
      "TURNDOWN SERVICE: Place cart → doorbell/knock → hang make-up sign → turndown bed → fold right corner of blanket in triangular position → check curtains → refill jug → remove soiled dishes → replenish towels → check garbage → empty & wash ashtrays → wash glasses → check bathroom → turn off lights.",
    ],
  },
  {
    id: 7,
    question: "Explain the procedure in Bathroom Cleaning.",
    answer: [
      "1. Prepare materials.",
      "2. Put caution sign outside.",
      "3. Knock 3× and say 'Housekeeping', then open the door.",
      "4. Check ventilation — open window to avoid suffocation.",
      "5. Clean ceiling with ceiling broom to remove cobwebs.",
      "6. Get the trash/waste.",
      "7. Apply Toilet Bowl Cleaner (TBC) or Zonrox counter-clockwise, flush first, then apply again and set aside.",
      "8. Get pail and sponge — put half a pail of water in wash sink → clean walls with wet sponge → mix detergent/APC with water → clean floor with hand brush → rinse wall with clean water sponge → wipe dry.",
      "9. Spray glass cleaner on mirror → scrub with squeegee → wipe dry.",
      "10. Brush toilet from outside to inside → rinse with sponge → flush → wipe dry.",
      "11. Mop floor and dry thoroughly.",
      "12. Close window.",
      "13. Spray air freshener 3×.",
      "14. Close the door.",
    ],
  },
  {
    id: 8,
    question: "What are the characteristics of a Butler?",
    answer: [
      "Pleasing personality",
      "Well-groomed",
      "Good communication skills",
      "Good manners",
      "Knowledgeable",
    ],
  },
  {
    id: 9,
    question: "Discuss the proper loading of a trolley.",
    answer: [
      "Load heavier items at the bottom for stability.",
      "Place frequently used items within easy reach.",
      "Arrange supplies neatly so nothing falls off.",
      "Do not overload — keep weight balanced.",
    ],
  },
  {
    id: 10,
    question: "Explain the safety measures in bed making.",
    answer: [
      "1. Proper posture — to avoid back pain.",
      "2. Remove jewelry (such as a watch).",
      "3. Check the bed's stability.",
    ],
  },
  {
    id: 11,
    question: "What are the signs of intoxication?",
    answer: [
      "1. Redness of eyes.",
      "2. Smell of alcohol.",
      "3. Distorted speech.",
      "4. Unsteady body movement.",
    ],
  },
  {
    id: 12,
    question: "What are the parts of a Floor Polisher?",
    answer: [
      "3 colors of pad:",
      "Red – for stripping",
      "Brown – for scrubbing",
      "White – for polishing",
    ],
  },
  {
    id: 13,
    question: "How do you care for laundry equipment and supplies?",
    answer: ["Keep them clean, dry, and organized."],
  },
  {
    id: 14,
    question: "What is the importance of effective communication to a butler service?",
    answer: [
      "1. Professionalism",
      "2. Guest satisfaction",
      "3. Avoid misunderstanding",
      "4. Building rapport",
    ],
  },
  {
    id: 15,
    question: "How can you assure the guest about confidentiality of their transactions?",
    answer: [
      "After the guest signs the non-disclosure agreement, assure them that all information is strictly confidential.",
    ],
  },
  {
    id: 16,
    question: "What are the types of assistance that can be given to an intoxicated person?",
    answer: [
      "If the guest is checked in: (1) Assist the guest to the room, (2) Offer non-alcoholic drinks, (3) Assure them of assistance.",
      "If the guest is NOT checked in: (1) Assist the guest to the lobby, (2) Offer non-alcoholic drinks, (3) Call the immediate family/friends.",
    ],
  },
  {
    id: 17,
    question: "How will you perform make up room when there is a guest inside?",
    answer: [
      "1. Ask permission from the guest.",
      "2. Move quietly.",
      "3. Avoid distraction.",
    ],
  },
  {
    id: 18,
    question: "Why is it necessary to conduct post-laundry activity?",
    answer: [
      "To check if there is damage, stain, or discoloration that needs replacement.",
    ],
  },
  {
    id: 19,
    question: "Why is it important to record incidents involving intoxication?",
    answer: ["For security purposes and to keep a record of the intoxicated person."],
  },
  {
    id: 20,
    question: "How do you operate a washing machine?",
    answer: [
      "1. Check the wiring.",
      "2. Check the water supply.",
      "3. Check the raw materials (detergent, etc.).",
      "4. Sort the clothes from colored to white.",
    ],
  },
];
