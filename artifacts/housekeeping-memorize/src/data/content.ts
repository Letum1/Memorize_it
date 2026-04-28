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
    question: 'Which of the following reports to the Public Area Superior?',
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
  }
];

export const totalQuestions = housekeepingContent.length;
export const slideTitles = Array.from(new Set(housekeepingContent.map(q => q.slideTitle)));
export const totalSlides = slideTitles.length;
