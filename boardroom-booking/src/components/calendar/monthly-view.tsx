"use client"

import { format, startOfMonth, endOfMonth, isSameMonth, isToday, isSameDay, getDay } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Plus } from "lucide-react"
import type { IEvent } from "@/models/IEvent"
import type { IBoardroom } from "@/models/IBoardroom"

interface MonthlyViewProps {
  selectedDate: Date
  selectedBoardroom: IBoardroom
  events: IEvent[]
  onEventClick: (event: IEvent) => void
  onDayClick: (date: Date) => void
  onSlotClick: (slotTime: Date) => void
}

export function MonthlyView({
  selectedDate,
  selectedBoardroom,
  events,
  onEventClick,
  onDayClick,
  onSlotClick,
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

  // Filter events for the current month and boardroom
  const monthEvents = events.filter((event) => event.boardroom.id === selectedBoardroom.id)

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return monthEvents.filter((event) => isSameDay(event.startTime, day))
  }

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <div className="h-[calc(100vh-215px)] flex flex-col">
      {/* Month header with days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2 flex-shrink-0">
        {daysOfWeek.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-semibold text-gray-600 uppercase tracking-wide">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 flex-1 min-h-0">
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
                relative border border-gray-200 rounded-lg p-2 cursor-pointer transition-all hover:bg-gray-50 flex flex-col min-h-0
                ${!isCurrentMonth ? "bg-gray-50 opacity-60" : "bg-white"}
                ${isCurrentDay ? "ring-2 ring-emerald-400 bg-emerald-50" : ""}
                ${isSelected ? "ring-2 ring-blue-400 bg-blue-50" : ""}
              `}
              onClick={() => onDayClick(day)}
            >
              {/* Day number */}
              <div className="flex items-center justify-between mb-1 flex-shrink-0">
                <span
                  className={`
                    text-sm font-semibold
                    ${!isCurrentMonth ? "text-gray-400" : "text-gray-700"}
                    ${isCurrentDay ? "text-emerald-600" : ""}
                  `}
                >
                  {format(day, "d")}
                </span>

                {/* Event count badge for days with events */}
                {hasEvents && (
                  <Badge
                    variant="secondary"
                    className="h-5 w-5 p-0 text-xs bg-emerald-100 text-emerald-600 border-0 rounded-full flex items-center justify-center"
                  >
                    {dayEvents.length}
                  </Badge>
                )}
              </div>

              {/* Events */}
              <div className="space-y-1 flex-1 overflow-hidden">
                {dayEvents.slice(0, 2).map((event, eventIndex) => (
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
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{format(event.startTime, "h:mm")}</span>
                      <span className="truncate">{event.title}</span>
                    </div>
                  </div>
                ))}

                {/* Show "more events" indicator if there are more than 2 events */}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500 font-medium px-1">+{dayEvents.length - 2} more</div>
                )}
              </div>

              {/* Add event button - only show on hover */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-1 right-1 h-6 w-6 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Default to 9 AM for new events
                        const slotTime = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 9, 0)
                        onSlotClick(slotTime)
                      }}
                    >
                      <Plus className="h-3 w-3 text-emerald-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Add event on {format(day, "MMM d")}</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )
        })}
      </div>
    </div>
  )
}
