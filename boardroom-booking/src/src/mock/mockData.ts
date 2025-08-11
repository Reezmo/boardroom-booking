import type { IBoardroom } from "@/models/IBoardroom"
import type { IEvent } from "@/models/IEvent"
import type { IOrganizer } from "@/models/IOrganizer"
import type { IUser } from "@/models/IUser"

// Boardrooms
export const BOARDROOMS: IBoardroom[] = [
  {
    id: "br-1",
    name: "Emerald Room",
    availability: true,
    capacity: 10,

  },
  {
    id: "br-2",
    name: "Boardroom B",
    availability: false,
    capacity: 8,
  },
]

// Organizer
export const DUMMY_ORGANIZER: IOrganizer = {
  id: "org-1",
  fullName: "Jane Doe",
  mail: "jane.doe@example.com",
}

// User
export const DUMMY_USER: IUser = {
  id: "user-1",
  fullName: "John Smith",
  mail: "john.smith@example.com",
}

// Helper function to get next 30-minute slot
const getNextSlot = (hoursFromNow: number, minutes: 0 | 30 = 0) => {
  const now = new Date()
  const futureDate = new Date()
  futureDate.setHours(now.getHours() + hoursFromNow, minutes, 0, 0)

  // If the calculated time is in the past, move to next day
  if (futureDate <= now) {
    futureDate.setDate(futureDate.getDate() + 1)
  }

  return futureDate
}

// Today's date at midnight
const today = new Date()
today.setHours(0, 0, 0, 0)

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
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 30),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30),
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
  // Future events with proper 30-minute alignment
  {
    id: "6",
    title: "Budget Planning",
    description: "Q2 budget review and planning session",
    color: "bg-emerald-100 text-emerald-800",
    startTime: getNextSlot(2, 0), // Next available :00 slot, 2+ hours from now
    endTime: getNextSlot(3, 0), // 1 hour duration
    boardroom: BOARDROOMS[0],
    organizer: DUMMY_ORGANIZER,
    attendees: 8,
    agenda: "Review Q1 expenses and plan Q2 budget",
  },
  {
    id: "7",
    title: "Client Presentation",
    description: "Present new product features to key client",
    color: "bg-blue-100 text-blue-800",
    startTime: getNextSlot(4, 30), // Next available :30 slot, 4+ hours from now
    endTime: getNextSlot(5, 30), // 1 hour duration
    boardroom: BOARDROOMS[1],
    organizer: DUMMY_ORGANIZER,
    attendees: 6,
    agenda: "Demo new features and gather feedback",
  },
  // Tomorrow's events
  {
    id: "8",
    title: "Morning Standup",
    description: "Daily team sync",
    color: "bg-teal-100 text-teal-800",
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 9, 0),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 9, 30),
    boardroom: BOARDROOMS[0],
    organizer: DUMMY_ORGANIZER,
    attendees: 12,
    agenda: "Sprint progress and blockers",
  },
  {
    id: "9",
    title: "Product Review",
    description: "Weekly product development review",
    color: "bg-indigo-100 text-indigo-800",
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 14, 30),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 15, 30),
    boardroom: BOARDROOMS[1],
    organizer: DUMMY_ORGANIZER,
    attendees: 10,
    agenda: "Review sprint deliverables and next steps",
  },
]

// Meetings count for UI (example)
export const MEETINGS_COUNT: Record<string, number> = {
  "br-1": 2,
  "br-2": 4,
}
