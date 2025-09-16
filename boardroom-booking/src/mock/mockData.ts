import type { IBoardroom } from "@/models/IBoardroom"
import type { IEvent } from "@/models/IEvent"
import type { IOrganizer } from "@/models/IOrganizer"
import type { IUser } from "@/models/IUser"

// Boardrooms
export const BOARDROOMS: IBoardroom[] = [
  {
    id: "br-1",
    name: "Cloud",
    availability: true,
    capacity: 10,
    isConfirmed: true,
  },
  {
    id: "br-2",
    name: "Zenith",
    availability: true,
    capacity: 12,
    isConfirmed: true,
  },
  {
    id: "br-3",
    name: "Meeting Room",
    availability: false,
    capacity: 6,
    isConfirmed: true,
  },
  {
    id: "br-4",
    name: "Powerhouse",
    availability: true,
    capacity: 5,
    isConfirmed: true,
  },
]

// Organizer
export const DUMMY_ORGANIZER: IOrganizer = {
  id: "org-1",
  fullName: "Jane Doe",
  mail: "jane.doe@example.com",
  uid: undefined
}

// User
export const DUMMY_USER: IUser = {
  id: "user-1",
  fullName: "John Smith",
  mail: "john.smith@example.com",
}

// Events
export const DUMMY_EVENTS: IEvent[] = []

// Meetings count for UI (example)
// This will now need to be fetched from your database.
