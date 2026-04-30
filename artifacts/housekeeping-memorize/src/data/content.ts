export type QuestionType = 'flashcard' | 'multiple-choice' | 'fill-blank';

export interface BaseQuestion {
  id: string;
  slideNum: number;
  slideTitle: string;
  type: QuestionType;
}

export interface FlashcardQuestion extends BaseQuestion {
  type: 'flashcard';
  front: string;
  back: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface FillBlankQuestion extends BaseQuestion {
  type: 'fill-blank';
  question: string; // Use ___ for the blank
  correctAnswer: string;
  synonyms?: string[];
}

export type Question = FlashcardQuestion | MultipleChoiceQuestion | FillBlankQuestion;

export const housekeepingContent: Question[] = [
  // Slide 1
  {
    id: 's1-fc-1', type: 'flashcard', slideNum: 1, slideTitle: 'Definition of Housekeeping',
    front: 'What does housekeeping refer to?',
    back: 'Upkeep, cleanliness, and maintenance in houses or lodging establishments.'
  },
  {
    id: 's1-mc-1', type: 'multiple-choice', slideNum: 1, slideTitle: 'Definition of Housekeeping',
    question: 'Which of the following is NOT a typical example of an establishment that requires housekeeping?',
    options: ['Hotels', 'Hospitals', 'Virtual Servers', 'Malls'],
    correctAnswer: 'Virtual Servers'
  },
  {
    id: 's1-fb-1', type: 'fill-blank', slideNum: 1, slideTitle: 'Definition of Housekeeping',
    question: 'Housekeeping refers to upkeep, ___, and maintenance in houses or lodging establishments.',
    correctAnswer: 'cleanliness',
    synonyms: ['cleaning']
  },

  // Slide 2
  {
    id: 's2-fc-1', type: 'flashcard', slideNum: 2, slideTitle: 'Types of Housekeeping',
    front: 'What is Domestic Housekeeping?',
    back: 'Cleanliness in a house.'
  },
  {
    id: 's2-fc-2', type: 'flashcard', slideNum: 2, slideTitle: 'Types of Housekeeping',
    front: 'What is Institutional Housekeeping?',
    back: 'Cleanliness in lodging establishments.'
  },
  {
    id: 's2-mc-1', type: 'multiple-choice', slideNum: 2, slideTitle: 'Types of Housekeeping',
    question: 'Cleanliness in lodging establishments is referred to as:',
    options: ['Domestic Housekeeping', 'Institutional Housekeeping', 'Commercial Housekeeping', 'Public Housekeeping'],
    correctAnswer: 'Institutional Housekeeping'
  },
  {
    id: 's2-fb-1', type: 'fill-blank', slideNum: 2, slideTitle: 'Types of Housekeeping',
    question: '___ Housekeeping refers to cleanliness in a house.',
    correctAnswer: 'Domestic'
  },

  // Slide 3
  {
    id: 's3-fc-1', type: 'flashcard', slideNum: 3, slideTitle: 'Organizational Chart',
    front: 'Who does the Housekeeping Supervisor oversee?',
    back: 'Room Attendant, Chambermaid/Roomboy, Minibar Attendant'
  },
  {
    id: 's3-mc-1', type: 'multiple-choice', slideNum: 3, slideTitle: 'Organizational Chart',
    question: 'Which of the following reports to the Public Area Supervisor?',
    options: ['Room Attendant', 'Linen Attendant', 'Gardener', 'Minibar Attendant'],
    correctAnswer: 'Gardener'
  },
  {
    id: 's3-fb-1', type: 'fill-blank', slideNum: 3, slideTitle: 'Organizational Chart',
    question: 'The ___ Supervisor oversees the Linen Attendant, Laundry Attendant, and Iron/Steam Pressed.',
    correctAnswer: 'Linen'
  },

  // Slide 4
  {
    id: 's4-fc-1', type: 'flashcard', slideNum: 4, slideTitle: '5S in Housekeeping',
    front: 'What does "Sort" (Seiri) mean in 5S?',
    back: 'Remove unnecessary items.'
  },
  {
    id: 's4-fc-2', type: 'flashcard', slideNum: 4, slideTitle: '5S in Housekeeping',
    front: 'What does "Standardize" (Seiketsu) mean in 5S?',
    back: 'Create rules and routines.'
  },
  {
    id: 's4-mc-1', type: 'multiple-choice', slideNum: 4, slideTitle: '5S in Housekeeping',
    question: 'In 5S, what is the meaning of "Shine" (Seiso)?',
    options: ['Arrange items for easy use', 'Maintain discipline', 'Clean regularly', 'Remove unnecessary items'],
    correctAnswer: 'Clean regularly'
  },
  {
    id: 's4-fb-1', type: 'fill-blank', slideNum: 4, slideTitle: '5S in Housekeeping',
    question: 'In 5S, Set in Order (Seiton) means to arrange items for easy ___.',
    correctAnswer: 'use',
    synonyms: ['usage', 'access']
  },

  // Slide 5
  {
    id: 's5-fc-1', type: 'flashcard', slideNum: 5, slideTitle: 'Check-Out Room Procedures',
    front: 'What is the very first step in Check-Out Room Procedures?',
    back: 'Check for lost items.'
  },
  {
    id: 's5-mc-1', type: 'multiple-choice', slideNum: 5, slideTitle: 'Check-Out Room Procedures',
    question: 'According to the procedures, what should you do immediately after checking for lost items?',
    options: ['Adjust AC temperature', 'Pull curtains/blinds', 'Strip bed linen', 'Remove soiled dishes'],
    correctAnswer: 'Pull curtains/blinds'
  },
  {
    id: 's5-fb-1', type: 'fill-blank', slideNum: 5, slideTitle: 'Check-Out Room Procedures',
    question: 'The final step in Check-Out Room Procedures is to ___ the door.',
    correctAnswer: 'close',
    synonyms: ['shut']
  },

  // Slide 6
  {
    id: 's6-fc-1', type: 'flashcard', slideNum: 6, slideTitle: 'Room Services',
    front: 'When is Make Up Room (MUR) typically done?',
    back: '7-8 PM'
  },
  {
    id: 's6-mc-1', type: 'multiple-choice', slideNum: 6, slideTitle: 'Room Services',
    question: 'Turn Down Service is typically performed between:',
    options: ['11 AM - 12 NN', '2 PM - 4 PM', '5 PM - 9 PM', '7 PM - 8 PM'],
    correctAnswer: '5 PM - 9 PM'
  },
  {
    id: 's6-fb-1', type: 'fill-blank', slideNum: 6, slideTitle: 'Room Services',
    question: 'Turn Down Service primarily focuses on the ___.',
    correctAnswer: 'bed'
  },

  // Slide 7
  {
    id: 's7-fc-1', type: 'flashcard', slideNum: 7, slideTitle: 'Turndown Service Procedure',
    front: 'What is the first step in Turndown Service?',
    back: 'Place cart.'
  },
  {
    id: 's7-mc-1', type: 'multiple-choice', slideNum: 7, slideTitle: 'Turndown Service Procedure',
    question: 'Which of the following is part of the Turndown Service Procedure?',
    options: ['Vacuum floor/carpet', 'Fold blanket corner', 'Polish mirrors/fixtures', 'Clean/refill jug completely'],
    correctAnswer: 'Fold blanket corner'
  },
  {
    id: 's7-fb-1', type: 'fill-blank', slideNum: 7, slideTitle: 'Turndown Service Procedure',
    question: 'The final step of the Turndown Service Procedure is to turn off ___.',
    correctAnswer: 'lights',
    synonyms: ['the lights']
  },

  // Slide 8
  {
    id: 's8-fc-1', type: 'flashcard', slideNum: 8, slideTitle: 'Room Cleaning Status Codes',
    front: 'What does VD stand for?',
    back: 'Vacant Dirty'
  },
  {
    id: 's8-mc-1', type: 'multiple-choice', slideNum: 8, slideTitle: 'Room Cleaning Status Codes',
    question: 'What does OC stand for?',
    options: ['Occupied Clean', 'Out of Control', 'Occupied Check-out', 'Over Cleaned'],
    correctAnswer: 'Occupied Clean'
  },
  {
    id: 's8-fb-1', type: 'fill-blank', slideNum: 8, slideTitle: 'Room Cleaning Status Codes',
    question: '___ stands for Vacant Clean.',
    correctAnswer: 'VC',
    synonyms: ['vc']
  },

  // Slide 9
  {
    id: 's9-fc-1', type: 'flashcard', slideNum: 9, slideTitle: 'Occupancy Codes',
    front: 'What does SO stand for?',
    back: 'Stayover'
  },
  {
    id: 's9-mc-1', type: 'multiple-choice', slideNum: 9, slideTitle: 'Occupancy Codes',
    question: 'What does NS stand for in Occupancy Codes?',
    options: ['No Service', 'No Show', 'Not Swept', 'Next Stay'],
    correctAnswer: 'No Show'
  },
  {
    id: 's9-fb-1', type: 'fill-blank', slideNum: 9, slideTitle: 'Occupancy Codes',
    question: 'The occupancy code DO stands for Due ___.',
    correctAnswer: 'Out'
  },

  // Slide 10
  {
    id: 's10-fc-1', type: 'flashcard', slideNum: 10, slideTitle: 'Guest Privacy Codes',
    front: 'What does DND stand for?',
    back: 'Do Not Disturb'
  },
  {
    id: 's10-mc-1', type: 'multiple-choice', slideNum: 10, slideTitle: 'Guest Privacy Codes',
    question: 'What does DL stand for in Guest Privacy Codes?',
    options: ['Do Not Lock', 'Double Lock', 'Door Locked', 'Delayed Laundry'],
    correctAnswer: 'Double Lock'
  },
  {
    id: 's10-fb-1', type: 'fill-blank', slideNum: 10, slideTitle: 'Guest Privacy Codes',
    question: 'The guest privacy code RS stands for Refused ___.',
    correctAnswer: 'Service'
  },

  // Slide 11
  {
    id: 's11-fc-1', type: 'flashcard', slideNum: 11, slideTitle: 'Maintenance/Availability Codes',
    front: 'What does OOO stand for?',
    back: 'Out of Order'
  },
  {
    id: 's11-mc-1', type: 'multiple-choice', slideNum: 11, slideTitle: 'Maintenance/Availability Codes',
    question: 'What does OOI stand for?',
    options: ['Out of Order', 'Out of Service', 'Out of Inventory (Internal Use)', 'Occupied Or Incomplete'],
    correctAnswer: 'Out of Inventory (Internal Use)'
  },
  {
    id: 's11-fb-1', type: 'fill-blank', slideNum: 11, slideTitle: 'Maintenance/Availability Codes',
    question: 'OOS stands for Out of ___.',
    correctAnswer: 'Service'
  },

  // Slide 12
  {
    id: 's12-fc-1', type: 'flashcard', slideNum: 12, slideTitle: 'Common Types of Rooms',
    front: 'Name 5 common types of rooms.',
    back: 'Single, Double, Twin, Triple, Suite, Deluxe, Executive, Family, Connecting, Studio.'
  },
  {
    id: 's12-mc-1', type: 'multiple-choice', slideNum: 12, slideTitle: 'Common Types of Rooms',
    question: 'Which of these is a common type of hotel room?',
    options: ['Apartment', 'Studio', 'Villa', 'Condo'],
    correctAnswer: 'Studio'
  },
  {
    id: 's12-fb-1', type: 'fill-blank', slideNum: 12, slideTitle: 'Common Types of Rooms',
    question: 'Rooms with a door between them to allow guests to move back and forth without going into the hallway are called ___ rooms.',
    correctAnswer: 'Connecting'
  },

  // Slide 13
  {
    id: 's13-fc-1', type: 'flashcard', slideNum: 13, slideTitle: 'Housekeeping Cart',
    front: 'What consumables are typically kept on a housekeeping cart?',
    back: 'Coffee, tea, sugar, cream, water'
  },
  {
    id: 's13-mc-1', type: 'multiple-choice', slideNum: 13, slideTitle: 'Housekeeping Cart',
    question: 'Which of the following is NOT typically considered a "Bath supply" on the housekeeping cart?',
    options: ['Shower cap', 'Slippers', 'Water', 'Cotton buds'],
    correctAnswer: 'Water'
  },
  {
    id: 's13-fb-1', type: 'fill-blank', slideNum: 13, slideTitle: 'Housekeeping Cart',
    question: 'The housekeeping cart carries bags for trash and soiled ___.',
    correctAnswer: 'linen',
    synonyms: ['linens']
  },

  // Slide 14
  {
    id: 's14-fc-1', type: 'flashcard', slideNum: 14, slideTitle: 'Common Room Amenities',
    front: 'What are typical bathroom amenities?',
    back: 'Towels, soap/shampoo/conditioner, toilet paper, hair dryer.'
  },
  {
    id: 's14-mc-1', type: 'multiple-choice', slideNum: 14, slideTitle: 'Common Room Amenities',
    question: 'Which of these is a common room amenity?',
    options: ['Microwave', 'Safe box', 'Washing machine', 'Dishwasher'],
    correctAnswer: 'Safe box'
  },
  {
    id: 's14-fb-1', type: 'fill-blank', slideNum: 14, slideTitle: 'Common Room Amenities',
    question: 'The small refrigerator in a hotel room containing beverages and snacks is called a ___.',
    correctAnswer: 'minibar',
    synonyms: ['mini bar', 'mini-bar']
  },

  // Slide 15
  {
    id: 's15-fc-1', type: 'flashcard', slideNum: 15, slideTitle: 'Parts of the Bed',
    front: 'What is the purpose of a Bed Pad?',
    back: 'Protects the mattress.'
  },
  {
    id: 's15-mc-1', type: 'multiple-choice', slideNum: 15, slideTitle: 'Parts of the Bed',
    question: 'Which part of the bed hides the frame/storage?',
    options: ['Headboard', 'Footboard', 'Bed Skirt', 'Bed Pad'],
    correctAnswer: 'Bed Skirt'
  },
  {
    id: 's15-fb-1', type: 'fill-blank', slideNum: 15, slideTitle: 'Parts of the Bed',
    question: 'The ___ prevents pillows from sliding off the bed.',
    correctAnswer: 'Headboard',
    synonyms: ['head board']
  },

  // Slide 16
  {
    id: 's16-fc-1', type: 'flashcard', slideNum: 16, slideTitle: 'Cleaning Tools (Set 1)',
    front: 'What tool is used to wring out a mop?',
    back: 'Mop Squeezer (Wringer)'
  },
  {
    id: 's16-mc-1', type: 'multiple-choice', slideNum: 16, slideTitle: 'Cleaning Tools (Set 1)',
    question: 'Which of the following is included in Set 1 of Cleaning Tools?',
    options: ['Air Freshener', 'Spray Bottle', 'Caution Sign', 'Pail'],
    correctAnswer: 'Caution Sign'
  },
  {
    id: 's16-fb-1', type: 'fill-blank', slideNum: 16, slideTitle: 'Cleaning Tools (Set 1)',
    question: 'A Ceiling/___ Broom is used to reach high corners.',
    correctAnswer: 'Cobweb'
  },

  // Slide 17
  {
    id: 's17-fc-1', type: 'flashcard', slideNum: 17, slideTitle: 'Cleaning Tools (Set 2)',
    front: 'Name 3 tools from Cleaning Tools (Set 2).',
    back: 'Spray Bottle, Hand Brush, Soft Sponge, Toilet Bowl Brush, Pail (Bucket), Air Freshener.'
  },
  {
    id: 's17-mc-1', type: 'multiple-choice', slideNum: 17, slideTitle: 'Cleaning Tools (Set 2)',
    question: 'Which of these is NOT in Set 2 of Cleaning Tools?',
    options: ['Soft Sponge', 'Toilet Bowl Brush', 'Mop', 'Air Freshener'],
    correctAnswer: 'Mop'
  },
  {
    id: 's17-fb-1', type: 'fill-blank', slideNum: 17, slideTitle: 'Cleaning Tools (Set 2)',
    question: 'A Pail is also commonly known as a ___.',
    correctAnswer: 'Bucket'
  },
  {
    id: 's17-fb-2', type: 'fill-blank', slideNum: 17, slideTitle: 'Cleaning Tools (Set 2)',
    question: 'Toilet ___ Brush is used to clean the inside of the toilet.',
    correctAnswer: 'Bowl'
  },
  {
    id: 's17-fb-3', type: 'fill-blank', slideNum: 17, slideTitle: 'Cleaning Tools (Set 2)',
    question: 'A ___ Sponge is used for delicate surfaces in Set 2.',
    correctAnswer: 'Soft'
  },
  {
    id: 's17-fb-4', type: 'fill-blank', slideNum: 17, slideTitle: 'Cleaning Tools (Set 2)',
    question: 'A Spray ___ holds cleaning liquid for misting onto surfaces.',
    correctAnswer: 'Bottle'
  },
  {
    id: 's17-fb-5', type: 'fill-blank', slideNum: 17, slideTitle: 'Cleaning Tools (Set 2)',
    question: 'An Air ___ is sprayed to make the room smell pleasant.',
    correctAnswer: 'Freshener'
  },

  // Slide 18 — Floor Polisher Parts
  {
    id: 's18-fc-1', type: 'flashcard', slideNum: 18, slideTitle: 'Floor Polisher Parts',
    front: 'What does the Operation Control of the floor polisher do?',
    back: 'Dual lever on/off safety switch for left or right hand operation.'
  },
  {
    id: 's18-fc-2', type: 'flashcard', slideNum: 18, slideTitle: 'Floor Polisher Parts',
    front: 'How long is the floor polisher Power Cord?',
    back: '50 ft. UL listed 14/3 STW-A with cord strain relief.'
  },
  {
    id: 's18-mc-1', type: 'multiple-choice', slideNum: 18, slideTitle: 'Floor Polisher Parts',
    question: 'Which floor polisher part includes the 17" sanding block?',
    options: ['Handle Tube', 'Sandpaper Driver', 'Transport Wheels', 'Pad Diameter'],
    correctAnswer: 'Sandpaper Driver'
  },
  {
    id: 's18-mc-2', type: 'multiple-choice', slideNum: 18, slideTitle: 'Floor Polisher Parts',
    question: 'How big are the floor polisher transport wheels?',
    options: ['3 inch', '5 inch', '7 inch', '17 inch'],
    correctAnswer: '5 inch'
  },
  {
    id: 's18-fb-1', type: 'fill-blank', slideNum: 18, slideTitle: 'Floor Polisher Parts',
    question: 'The Handle Tube is all chrome and ___ inch wide.',
    correctAnswer: '1-1/2',
    synonyms: ['1.5', '1 1/2']
  },
  {
    id: 's18-fb-2', type: 'fill-blank', slideNum: 18, slideTitle: 'Floor Polisher Parts',
    question: 'The Pad Diameter of the floor polisher is ___ inches.',
    correctAnswer: '17'
  },
  {
    id: 's18-fb-3', type: 'fill-blank', slideNum: 18, slideTitle: 'Floor Polisher Parts',
    question: 'All Metal ___ provides long lasting durability.',
    correctAnswer: 'Housing'
  },

  // Slide 19 — Vacuum Cleaner Parts
  {
    id: 's19-fc-1', type: 'flashcard', slideNum: 19, slideTitle: 'Vacuum Cleaner Parts',
    front: 'Which part of the vacuum cleaner sucks dirt and debris in?',
    back: 'Suction Port'
  },
  {
    id: 's19-fc-2', type: 'flashcard', slideNum: 19, slideTitle: 'Vacuum Cleaner Parts',
    front: 'What does the Floor Brush do?',
    back: 'It is the head attached to the suction hose that sweeps and picks up dirt from the floor.'
  },
  {
    id: 's19-mc-1', type: 'multiple-choice', slideNum: 19, slideTitle: 'Vacuum Cleaner Parts',
    question: 'Which vacuum part allows it to roll in any direction?',
    options: ['Top Cover', 'Universal Wheel', 'Handle', 'Middle Cover'],
    correctAnswer: 'Universal Wheel'
  },
  {
    id: 's19-mc-2', type: 'multiple-choice', slideNum: 19, slideTitle: 'Vacuum Cleaner Parts',
    question: 'Which switch lets the vacuum operate safely with water?',
    options: ['Power Switch', 'Waterproof Switch', 'Suction Switch', 'Emergency Switch'],
    correctAnswer: 'Waterproof Switch'
  },
  {
    id: 's19-fb-1', type: 'fill-blank', slideNum: 19, slideTitle: 'Vacuum Cleaner Parts',
    question: 'The S/S ___ is the stainless steel container that holds debris and water.',
    correctAnswer: 'Barrel'
  },
  {
    id: 's19-fb-2', type: 'fill-blank', slideNum: 19, slideTitle: 'Vacuum Cleaner Parts',
    question: 'You hold the vacuum cleaner by the ___.',
    correctAnswer: 'Handle'
  },
  {
    id: 's19-fb-3', type: 'fill-blank', slideNum: 19, slideTitle: 'Vacuum Cleaner Parts',
    question: 'Floor ___ is the head that sweeps the floor.',
    correctAnswer: 'Brush'
  },

  // Slide 20 — Make Up Room Procedure (MUR)
  {
    id: 's20-fc-1', type: 'flashcard', slideNum: 20, slideTitle: 'Make Up Room Procedure (MUR)',
    front: 'What is step 1 of MUR?',
    back: 'Place the cart in front of the room and knock the door.'
  },
  {
    id: 's20-fc-2', type: 'flashcard', slideNum: 20, slideTitle: 'Make Up Room Procedure (MUR)',
    front: 'What is the LAST step of MUR?',
    back: 'Check overall condition of the room.'
  },
  {
    id: 's20-mc-1', type: 'multiple-choice', slideNum: 20, slideTitle: 'Make Up Room Procedure (MUR)',
    question: 'In MUR, after washing the drinking glasses you should refill the:',
    options: ['Coffee maker', 'Termo jug', 'Minibar', 'Ice bucket'],
    correctAnswer: 'Termo jug'
  },
  {
    id: 's20-mc-2', type: 'multiple-choice', slideNum: 20, slideTitle: 'Make Up Room Procedure (MUR)',
    question: 'Which MUR step comes immediately AFTER making the bed?',
    options: ['Empty trash cans', 'Clean / vacuum the floor', 'Make up the bathroom', 'Replenish soiled linen'],
    correctAnswer: 'Clean / vacuum the floor'
  },
  {
    id: 's20-fb-1', type: 'fill-blank', slideNum: 20, slideTitle: 'Make Up Room Procedure (MUR)',
    question: 'Place the cart in front of the room and ___ the door.',
    correctAnswer: 'knock'
  },
  {
    id: 's20-fb-2', type: 'fill-blank', slideNum: 20, slideTitle: 'Make Up Room Procedure (MUR)',
    question: 'Empty all trash ___ / basket.',
    correctAnswer: 'cans',
    synonyms: ['can']
  },
  {
    id: 's20-fb-3', type: 'fill-blank', slideNum: 20, slideTitle: 'Make Up Room Procedure (MUR)',
    question: 'Dust the furniture and the fixtures, then polish the ___.',
    correctAnswer: 'mirror',
    synonyms: ['mirrors']
  },
  {
    id: 's20-fb-4', type: 'fill-blank', slideNum: 20, slideTitle: 'Make Up Room Procedure (MUR)',
    question: 'Replenish other guestroom ___.',
    correctAnswer: 'supplies'
  },

  // Slide 21 — Ironing Long Sleeves
  {
    id: 's21-fc-1', type: 'flashcard', slideNum: 21, slideTitle: 'Ironing Long Sleeves',
    front: 'What is the FIRST step of ironing long sleeves on the wrong side?',
    back: 'Start with the collar.'
  },
  {
    id: 's21-fc-2', type: 'flashcard', slideNum: 21, slideTitle: 'Ironing Long Sleeves',
    front: 'What 2 DOs must you check before ironing long sleeves?',
    back: 'Check the wirings first to avoid harm/injury, and preheat the iron to the correct temperature for the fabric.'
  },
  {
    id: 's21-mc-1', type: 'multiple-choice', slideNum: 21, slideTitle: 'Ironing Long Sleeves',
    question: 'When ironing the body of the long sleeves, you should begin from the:',
    options: ['Button side', 'Buttonhole side', 'Collar', 'Cuff'],
    correctAnswer: 'Buttonhole side'
  },
  {
    id: 's21-mc-2', type: 'multiple-choice', slideNum: 21, slideTitle: 'Ironing Long Sleeves',
    question: 'Which mixture can be sprayed to soften light wrinkles?',
    options: ['Vinegar and salt', 'Baking soda and water', 'Lemon and bleach', 'Alcohol and starch'],
    correctAnswer: 'Baking soda and water'
  },
  {
    id: 's21-fb-1', type: 'fill-blank', slideNum: 21, slideTitle: 'Ironing Long Sleeves',
    question: 'Always check the ___ first to avoid harm or injury.',
    correctAnswer: 'wirings',
    synonyms: ['wiring']
  },
  {
    id: 's21-fb-2', type: 'fill-blank', slideNum: 21, slideTitle: 'Ironing Long Sleeves',
    question: 'After the collar, iron the ___ on both sides.',
    correctAnswer: 'shoulders',
    synonyms: ['shoulder']
  },
  {
    id: 's21-fb-3', type: 'fill-blank', slideNum: 21, slideTitle: 'Ironing Long Sleeves',
    question: 'Preheat the iron until it reaches the correct ___ for the fabric.',
    correctAnswer: 'temperature',
    synonyms: ['temp']
  },

  // Slide 22 — Ironing Slacks
  {
    id: 's22-fc-1', type: 'flashcard', slideNum: 22, slideTitle: 'Ironing Slacks',
    front: 'What is the FIRST step when ironing slacks (wrong side)?',
    back: 'Start ironing the waistband.'
  },
  {
    id: 's22-fc-2', type: 'flashcard', slideNum: 22, slideTitle: 'Ironing Slacks',
    front: 'What is the finishing step for ironing slacks?',
    back: 'Hang the slacks properly on a hanger to keep them wrinkle-free.'
  },
  {
    id: 's22-mc-1', type: 'multiple-choice', slideNum: 22, slideTitle: 'Ironing Slacks',
    question: 'After ironing the waistband on the wrong side, what should you iron next?',
    options: ['The leg opening', 'All the pockets carefully', 'The hemline', 'The hanger loop'],
    correctAnswer: 'All the pockets carefully'
  },
  {
    id: 's22-mc-2', type: 'multiple-choice', slideNum: 22, slideTitle: 'Ironing Slacks',
    question: 'After hip and legs, you continue ironing slacks down to the:',
    options: ['Waistband', 'Pockets', 'Leg opening / hemline', 'Belt loops'],
    correctAnswer: 'Leg opening / hemline'
  },
  {
    id: 's22-fb-1', type: 'fill-blank', slideNum: 22, slideTitle: 'Ironing Slacks',
    question: 'Start ironing the slacks at the ___.',
    correctAnswer: 'waistband'
  },
  {
    id: 's22-fb-2', type: 'fill-blank', slideNum: 22, slideTitle: 'Ironing Slacks',
    question: 'Hang the slacks properly on a ___ to keep them wrinkle-free.',
    correctAnswer: 'hanger'
  },
  {
    id: 's22-fb-3', type: 'fill-blank', slideNum: 22, slideTitle: 'Ironing Slacks',
    question: 'After the waistband, iron all the ___ carefully.',
    correctAnswer: 'pockets',
    synonyms: ['pocket']
  },

  // Slide 23 — Core Competencies
  {
    id: 's23-fc-1', type: 'flashcard', slideNum: 23, slideTitle: 'Core Competencies',
    front: 'Name the 6 housekeeping core competencies.',
    back: '1) Provide housekeeping services to guests, 2) Clean and prepare for incoming guests, 3) Provide valet/butler service, 4) Laundry linen and guests\' clothes, 5) Clean public area facilities and equipment, 6) Deal/handle intoxicated guests.'
  },
  {
    id: 's23-fc-2', type: 'flashcard', slideNum: 23, slideTitle: 'Core Competencies',
    front: 'Which core competency deals with drunk guests?',
    back: 'Deal / handle intoxicated guests.'
  },
  {
    id: 's23-mc-1', type: 'multiple-choice', slideNum: 23, slideTitle: 'Core Competencies',
    question: 'Which of these is a core competency in housekeeping?',
    options: ['Cooking guest meals', 'Provide valet / butler service', 'Driving the shuttle', 'Front-desk check-in'],
    correctAnswer: 'Provide valet / butler service'
  },
  {
    id: 's23-mc-2', type: 'multiple-choice', slideNum: 23, slideTitle: 'Core Competencies',
    question: 'Cleaning lobbies, hallways, and shared facilities falls under which core competency?',
    options: ['Provide housekeeping services to guests', 'Laundry linen and guests\' clothes', 'Clean public area facilities and equipment', 'Provide valet / butler service'],
    correctAnswer: 'Clean public area facilities and equipment'
  },
  {
    id: 's23-fb-1', type: 'fill-blank', slideNum: 23, slideTitle: 'Core Competencies',
    question: 'Deal / handle ___ guests.',
    correctAnswer: 'intoxicated',
    synonyms: ['drunk']
  },
  {
    id: 's23-fb-2', type: 'fill-blank', slideNum: 23, slideTitle: 'Core Competencies',
    question: 'Laundry linen and guests\' ___.',
    correctAnswer: 'clothes',
    synonyms: ['clothing']
  },
  {
    id: 's23-fb-3', type: 'fill-blank', slideNum: 23, slideTitle: 'Core Competencies',
    question: 'Clean and ___ for incoming guests.',
    correctAnswer: 'prepare'
  },

  // Slide 24 — Bathroom Cleaning Procedure
  {
    id: 's24-fc-1', type: 'flashcard', slideNum: 24, slideTitle: 'Bathroom Cleaning Procedure',
    front: 'What is the FIRST step of bathroom cleaning?',
    back: 'Put the caution sign.'
  },
  {
    id: 's24-fc-2', type: 'flashcard', slideNum: 24, slideTitle: 'Bathroom Cleaning Procedure',
    front: 'What is the LAST step of bathroom cleaning?',
    back: 'Close the window and spray air freshener.'
  },
  {
    id: 's24-fc-3', type: 'flashcard', slideNum: 24, slideTitle: 'Bathroom Cleaning Procedure',
    front: 'When using the toilet bowl brush, which side do you brush first?',
    back: 'The outside of the toilet first, then the inside.'
  },
  {
    id: 's24-fc-4', type: 'flashcard', slideNum: 24, slideTitle: 'Bathroom Cleaning Procedure',
    front: 'What tool is used for the wall vs the floor when cleaning?',
    back: 'Sponge for the wall, hand brush for the floor.'
  },
  {
    id: 's24-mc-1', type: 'multiple-choice', slideNum: 24, slideTitle: 'Bathroom Cleaning Procedure',
    question: 'How many times should you knock the bathroom door before entering?',
    options: ['1x', '2x', '3x', '4x'],
    correctAnswer: '3x'
  },
  {
    id: 's24-mc-2', type: 'multiple-choice', slideNum: 24, slideTitle: 'Bathroom Cleaning Procedure',
    question: 'After applying the toilet bowl cleaner inside, what should you do next?',
    options: ['Flush immediately', 'Close the toilet lid', 'Mop the floor', 'Open the window'],
    correctAnswer: 'Close the toilet lid'
  },
  {
    id: 's24-mc-3', type: 'multiple-choice', slideNum: 24, slideTitle: 'Bathroom Cleaning Procedure',
    question: 'Which tool is used to clean the mirror?',
    options: ['Sponge', 'Hand brush', 'Squeegee', 'Ceiling broom'],
    correctAnswer: 'Squeegee'
  },
  {
    id: 's24-mc-4', type: 'multiple-choice', slideNum: 24, slideTitle: 'Bathroom Cleaning Procedure',
    question: 'When cleaning the bathroom, you clean the wall and floor in what order?',
    options: ['Floor first, then wall', 'Wall first, then floor', 'Mirror first, then wall', 'Toilet first, then floor'],
    correctAnswer: 'Wall first, then floor'
  },
  {
    id: 's24-fb-1', type: 'fill-blank', slideNum: 24, slideTitle: 'Bathroom Cleaning Procedure',
    question: 'Put the ___ sign.',
    correctAnswer: 'caution',
    synonyms: ['warning']
  },
  {
    id: 's24-fb-2', type: 'fill-blank', slideNum: 24, slideTitle: 'Bathroom Cleaning Procedure',
    question: 'Knock the door ___ times.',
    correctAnswer: '3',
    synonyms: ['three', '3x']
  },
  {
    id: 's24-fb-3', type: 'fill-blank', slideNum: 24, slideTitle: 'Bathroom Cleaning Procedure',
    question: 'Get the ceiling ___.',
    correctAnswer: 'broom'
  },
  {
    id: 's24-fb-4', type: 'fill-blank', slideNum: 24, slideTitle: 'Bathroom Cleaning Procedure',
    question: 'Use the ___ for the wall and the hand brush for the floor.',
    correctAnswer: 'sponge'
  },
  {
    id: 's24-fb-5', type: 'fill-blank', slideNum: 24, slideTitle: 'Bathroom Cleaning Procedure',
    question: 'Get the toilet bowl ___ — brush the outside before the inside.',
    correctAnswer: 'brush'
  },
  {
    id: 's24-fb-6', type: 'fill-blank', slideNum: 24, slideTitle: 'Bathroom Cleaning Procedure',
    question: 'Get the ___ for the mirror.',
    correctAnswer: 'squeegee'
  },
  {
    id: 's24-fb-7', type: 'fill-blank', slideNum: 24, slideTitle: 'Bathroom Cleaning Procedure',
    question: 'Get a dry ___ for the wall.',
    correctAnswer: 'cloth',
    synonyms: ['rag', 'towel']
  },
  {
    id: 's24-fb-8', type: 'fill-blank', slideNum: 24, slideTitle: 'Bathroom Cleaning Procedure',
    question: 'Close the window and spray ___ freshener.',
    correctAnswer: 'air'
  },
  {
    id: 's24-fb-9', type: 'fill-blank', slideNum: 24, slideTitle: 'Bathroom Cleaning Procedure',
    question: 'Get the pail and fill with ___.',
    correctAnswer: 'water'
  },
  {
    id: 's24-fb-10', type: 'fill-blank', slideNum: 24, slideTitle: 'Bathroom Cleaning Procedure',
    question: 'Check the ___ or open the window.',
    correctAnswer: 'ventilation'
  }
];

export const totalQuestions = housekeepingContent.length;
export const slideTitles = Array.from(new Set(housekeepingContent.map(q => q.slideTitle)));
export const totalSlides = slideTitles.length;
