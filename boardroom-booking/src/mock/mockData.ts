import { IBoardroom } from "@/models/IBoardroom";
import { IEvent } from "@/models/IEvent";
import { IOrganizer } from "@/models/IOrganizer";

// Boardrooms
export const BOARDROOMS: IBoardroom[] = [
  {
    id: "br-1",
    name: "Emerald Room",
    availability: true,
    capacity: 10,
    isConfirmed: true,
  },
  {
    id: "br-2",
    name: "Boardroom B",
    availability: false,
    capacity: 8,
    isConfirmed: true,
  },
];

// Organizer
export const DUMMY_ORGANIZER: IOrganizer = {
  id: "org-1",
  fullName: "Jane Doe",
  mail: "jane.doe@example.com",
};

// Today's date at midnight
const today = new Date();
today.setHours(0, 0, 0, 0);

// Events
export const DUMMY_EVENTS: IEvent[] = [
  {
    id: "1",
    title: "Breakfast",
    description: "",
    color: "bg-blue-100 text-blue-800",
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 6, 0),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 7, 0),
    boardroom: BOARDROOMS[0],
    organizer: DUMMY_ORGANIZER,
    attendees: 5,
    agenda: "Discuss project updates",
  },
  {
    id: "2",
    title: "Flight to Paris",
    description: "John F. Kennedy International Airport",
    color: "bg-pink-100 text-pink-800",
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 7, 30),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
    boardroom: BOARDROOMS[1],
    organizer: DUMMY_ORGANIZER,
  },
  {
    id: "3",
    title: "Team Meeting",
    description: "Discuss Q1 results",
    color: "bg-green-100 text-green-800",
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0),
    boardroom: BOARDROOMS[0],
    organizer: DUMMY_ORGANIZER,
  },
  {
    id: "4",
    title: "Lunch with Sarah",
    description: "Cafe on Main Street",
    color: "bg-yellow-100 text-yellow-800",
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 30),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 30),
    boardroom: BOARDROOMS[0],
    organizer: DUMMY_ORGANIZER,
  },
  {
    id: "5",
    title: "Dentist Appointment",
    description: "Annual check-up",
    color: "bg-purple-100 text-purple-800",
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
    boardroom: BOARDROOMS[0],
    organizer: DUMMY_ORGANIZER,
  },
];

// Meetings count for UI (example)
export const MEETINGS_COUNT: Record<string, number> = {
  "br-1": 2,
  "br-2": 4,
};

