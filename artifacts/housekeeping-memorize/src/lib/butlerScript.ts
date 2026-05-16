export const STORAGE_KEY_BUTLER = "butler-names-v1";

export interface ButlerNames {
  butlerName: string;
  guestName: string;
  guestCity: string;
  hotelName: string;
}

export const DEFAULTS: ButlerNames = {
  butlerName: "Clyde",
  guestName: "Cresel",
  guestCity: "Taguig City",
  hotelName: "TMTC Hotel",
};

export function loadNames(): ButlerNames {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BUTLER);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export function saveNames(names: ButlerNames) {
  try {
    localStorage.setItem(STORAGE_KEY_BUTLER, JSON.stringify(names));
  } catch {}
}

export type Role = "butler" | "receptionist" | "guest" | "note";

export interface Line {
  role: Role;
  text: string;
}

export interface Scene {
  title: string;
  lines: Line[];
}

export function buildScript(n: ButlerNames): Scene[] {
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
      // In this scene the actor switches to the Receptionist role at the front desk
      title: "Front Desk Check-In",
      lines: [
        { role: "receptionist", text: `Good morning, Ma'am. Welcome to ${hotel}. How may I assist you?` },
        { role: "guest", text: "Good morning. I would like to check in." },
        { role: "receptionist", text: "Certainly, Ma'am. May I have your name, please?" },
        { role: "guest", text: `My name is ${g}${city ? ` from ${city}` : ""}.` },
        { role: "receptionist", text: `One moment, please… Mrs. ${g}, I can see your reservation here. You have booked one Junior Deluxe Room for tonight.` },
        { role: "guest", text: "Yes, that's correct." },
        { role: "receptionist", text: "May I please see a valid ID?" },
        { role: "guest", text: "Of course." },
        { role: "note", text: "(Guest hands ID to the receptionist)" },
        { role: "receptionist", text: "Thank you, Ma'am. Kindly sign here and write your contact number." },
        { role: "receptionist", text: `Mrs. ${g}, your room number is 106. Here is your key card, along with your ID and your breakfast voucher for two persons. Breakfast is served tomorrow morning. Is there anything else I may assist you with?` },
        { role: "guest", text: "No, thank you." },
        { role: "receptionist", text: `Our butler will now escort you to your room. We hope you enjoy your stay. Please dial 103 if you need any assistance.` },
      ],
    },
    {
      title: "Escorting to the Room",
      lines: [
        { role: "butler", text: "Ma'am, please allow me to escort you to your room." },
        { role: "butler", text: "Before we arrive, allow me to briefly introduce our hotel facilities. Breakfast is served from 6:00 AM to 10:00 AM at the lobby restaurant. The café and business center are located in the lobby, while the meeting rooms are on the 2nd floor. Our pool, spa, and gym are located on the 5th floor. Please let me know if you would like assistance with reservations." },
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
      // Actor plays Butler first (escorts guest to desk), then switches to Receptionist role
      title: "Check-Out at the Front Desk",
      lines: [
        { role: "butler", text: "Ma'am, our guest is here for checking out." },
        { role: "receptionist", text: "Good morning, Ma'am. Are you checking out today?" },
        { role: "guest", text: "Yes, I am. I would like to check out, please." },
        { role: "receptionist", text: `Thank you for staying with us. We look forward to welcoming you again. Have a wonderful day!` },
        { role: "guest", text: "Thank you. I really enjoyed my stay. I'll definitely come back." },
      ],
    },
  ];
}

export interface QuizItem {
  sceneTitle: string;
  cueText: string;
  promptWords: string;
  fullLine: string;
  role: Role;
}

export function buildQuizItems(script: Scene[]): QuizItem[] {
  const items: QuizItem[] = [];
  for (const scene of script) {
    for (let i = 0; i < scene.lines.length; i++) {
      const line = scene.lines[i];
      if (line.role !== "butler" && line.role !== "receptionist") continue;
      const prev = scene.lines[i - 1];
      const cueText = prev
        ? prev.role === "guest"
          ? `Guest: "${prev.text}"`
          : prev.role === "note"
          ? prev.text
          : prev.role === "butler"
          ? `Butler: "${prev.text}"`
          : `Receptionist: "${prev.text}"`
        : "Start of scene";
      const words = line.text.split(" ");
      const promptWords = words.slice(0, Math.min(4, Math.ceil(words.length * 0.25))).join(" ");
      items.push({ sceneTitle: scene.title, cueText, promptWords, fullLine: line.text, role: line.role });
    }
  }
  return items;
}
