"use client"

import { Badge } from "@/components/ui/badge"
import type { IBoardroom } from "@/models/IBoardroom"
import type { IEvent } from "@/models/IEvent"
import { endOfMonth, format, getDay, isSameDay, isSameMonth, isToday, startOfMonth } from "date-fns"

interface MonthlyViewProps {
  selectedDate: Date
  selectedBoardroom: IBoardroom
  events: IEvent[]
  onEventClick: (event: IEvent) => void
  onDayClick: (date: Date) => void
}

export function MonthlyView({
  selectedDate,
  selectedBoardroom,
  events,
  onEventClick,
  onDayClick,
}: MonthlyViewProps) {
  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)

  // Get all days to display (including leading/trailing days from adjacent months)
  const getDaysInMonth = () => {
    const days: Date[] = []
    const current = new Date(monthStart)

    // Add days from current month
    while (current <= monthEnd) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    // Add leading days from previous month to fill the first week (Monday as first day)
    const firstDayOfWeek = (getDay(monthStart) + 6) % 7 // Adjust to make Monday=0, Sunday=6
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.unshift(
        new Date(monthStart.getFullYear(), monthStart.getMonth(), monthStart.getDate() - (firstDayOfWeek - i)),
      )
    }

    // Add trailing days from next month to fill the last week
    const lastDayOfWeek = (getDay(monthEnd) + 6) % 7 // Adjust to make Monday=0, Sunday=6
    for (let i = 0; i < 6 - lastDayOfWeek; i++) {
      days.push(new Date(monthEnd.getFullYear(), monthEnd.getMonth(), monthEnd.getDate() + (i + 1)))
    }

    return days
  }

  const days = getDaysInMonth()
  const numRows = days.length / 7

  // Filter events for the current month and boardroom
  const monthEvents = events.filter((event) => event.boardroom.id === selectedBoardroom.id)

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return monthEvents.filter((event) => isSameDay(event.startTime, day))
  }

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <div className="h-[calc(100vh-215px)] flex flex-col p-2 bg-gray-50/50">
      {/* Month header with days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2 flex-shrink-0">
        {daysOfWeek.map((day) => (
          <div key={day} className="p-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        className={`grid grid-cols-7 gap-1 flex-1 min-h-0 ${
          numRows === 6 ? "grid-rows-6" : numRows === 5 ? "grid-rows-5" : "grid-rows-4"
        }`}
      >
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, selectedDate)
          const isCurrentDay = isToday(day)
          const isSelected = isSameDay(day, selectedDate)
          const dayEvents = getEventsForDay(day)
          const hasEvents = dayEvents.length > 0

          return (
            <div
              key={index}
              className={`
                relative bg-white rounded-lg p-2 cursor-pointer transition-colors hover:bg-gray-100 flex flex-col min-h-0
                ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : ""}
                ${isSelected && isCurrentMonth ? "bg-blue-50 ring-2 ring-blue-200" : ""}
              `}
              onClick={() => onDayClick(day)}
            >
              {/* Day number */}
              <div className="flex items-center justify-between mb-2 flex-shrink-0">
                <span
                  className={`
                    text-sm font-medium flex items-center justify-center h-7 w-7 rounded-full
                    ${!isCurrentMonth ? "text-gray-400" : "text-gray-600"}
                    ${isCurrentDay ? "bg-emerald-500 text-white font-semibold" : ""}
                    ${isSelected && !isCurrentDay ? "bg-blue-500 text-white" : ""}
                  `}
                >
                  {format(day, "d")}
                </span>

                {/* Event count badge for days with events */}
                {hasEvents && (
                  <Badge
                    variant="secondary"
                    className="h-5 w-5 p-0 text-xs bg-emerald-100 text-emerald-800 border-0 rounded-full flex items-center justify-center"
                  >
                    {dayEvents.length}
                  </Badge>
                )}
              </div>

              {/* Events */}
              <div className="space-y-1 flex-1 overflow-y-auto">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className={`
                      text-xs p-1 rounded truncate cursor-pointer transition-all hover:brightness-95
                      ${event.color}
                    `}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEventClick(event)
                    }}
                    title={`${format(event.startTime, "h:mm a")} - ${event.title}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold">{format(event.startTime, "h:mm")}</span>
                      <span className="truncate">{event.title}</span>
                    </div>
                  </div>
                ))}

                {/* Show "more events" indicator if there are more than 2 events */}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500 font-medium px-1 pt-1">+{dayEvents.length - 2} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
              
