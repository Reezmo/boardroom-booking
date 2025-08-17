"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { IBoardroom } from "@/models/IBoardroom"
import type { IEvent } from "@/models/IEvent"
import { addDays, format, isSameDay, isToday, startOfWeek } from "date-fns"
import { Plus } from "lucide-react"

const HOUR_HEIGHT = 60 // pixels per hour
const SLOT_HEIGHT = 30 // pixels per 30-min slot

interface WeeklyViewProps {
  selectedDate: Date
  selectedBoardroom: IBoardroom
  events: IEvent[]
  onEventClick: (event: IEvent) => void
  onSlotClick: (slotTime: Date) => void
}

export function WeeklyView({ selectedDate, selectedBoardroom, events, onEventClick, onSlotClick }: WeeklyViewProps) {
  // 48 slots for 24 hours, each 30 min
  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const minute = (i % 2) * 30
    return { hour, minute }
  })

  // Get the week starting from Monday
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Filter events for the current week and boardroom
  const weekEvents = events.filter(
    (event) => event.boardroom.id === selectedBoardroom.id && weekDays.some((day) => isSameDay(event.startTime, day)),
  )

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return weekEvents.filter((event) => isSameDay(event.startTime, day))
  }

  return (
    <div className="h-[calc(100vh-155px)] flex flex-col ">
      {/* Week header */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-200 mb-2 flex-shrink-0 ">
        <div className="p-2"></div>
        {weekDays.map((day, index) => {
          const isCurrentDay = isToday(day)
          const isSelected = isSameDay(day, selectedDate)
          return (
            <div
              key={index}
              className={`p-2 text-center border-r border-gray-100 last:border-r-0 ${
                isCurrentDay
                  ? "bg-cyan-50 text-cyan-600 font-semibold"
                  : isSelected
                    ? "bg-teal-50 text-teal-600 font-semibold"
                    : "text-gray-600"
              }`}
            >
              <div className="text-xs uppercase font-medium">{format(day, "EEE")}</div>
              <div className="text-lg font-bold">{format(day, "d")}</div>
            </div>
          )
        })}
      </div>

      <ScrollArea className="flex-1 min-h-0 rounded-lg">
        <div className="grid grid-cols-[60px_repeat(7,1fr)] relative p-2">
          {/* Time Labels */}
          <div className="sticky left-0 z-10 pr-2 text-right text-xs text-muted-foreground select-none">
            {timeSlots.map((slot, idx) => (
              <div
                key={idx}
                style={{ height: SLOT_HEIGHT, lineHeight: `${SLOT_HEIGHT}px` }}
                className={`flex items-start justify-end ${
                  slot.minute === 0 && slot.hour % 6 === 0 ? "font-bold text-gray-700" : ""
                }`}
              >
                {/* Only show label on the hour */}
                {slot.minute === 0 ? (
                  <span>{format(new Date(2000, 0, 1, slot.hour, 0), "h a")}</span>
                ) : (
                  <span className="opacity-0 select-none">--</span>
                )}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, dayIndex) => {
            const dayEvents = getEventsForDay(day)

            return (
              <div key={dayIndex} className="relative border-r border-gray-100 last:border-r-0">
                {/* Background stripes */}
                {timeSlots.map((slot, idx) => (
                  <div
                    key={`bg-${dayIndex}-${idx}`}
                    className="absolute left-0 right-0 w-full"
                    style={{
                      top: idx * SLOT_HEIGHT,
                      height: SLOT_HEIGHT,
                      backgroundColor: idx % 2 === 0 ? "#ffffffff" : "#f6ffffff",
                      zIndex: 0,
                    }}
                    aria-hidden="true"
                  />
                ))}

                {/* Hour lines */}
                {timeSlots.map((slot, idx) =>
                  slot.minute === 0 ? (
                    <div
                      key={`line-${dayIndex}-${idx}`}
                      className="absolute left-0 right-0 border-t border-gray-200"
                      style={{
                        top: idx * SLOT_HEIGHT,
                        height: 0,
                        zIndex: 1,
                        opacity: 0.3,
                      }}
                    />
                  ) : null,
                )}

                {/* 30-min interval lines */}
                {timeSlots.map((slot, idx) =>
                  slot.minute === 30 ? (
                    <div
                      key={`half-line-${dayIndex}-${idx}`}
                      className="absolute left-0 right-0 border-t border-gray-200"
                      style={{
                        top: idx * SLOT_HEIGHT,
                        height: 0,
                        zIndex: 1,
                        opacity: 0.1,
                      }}
                      aria-hidden="true"
                    />
                  ) : null,
                )}

                {/* Events for this day */}
                {dayEvents.map((event) => {
                  const startMinutes = event.startTime.getHours() * 60 + event.startTime.getMinutes()
                  const endMinutes = event.endTime.getHours() * 60 + event.endTime.getMinutes()
                  const durationMinutes = endMinutes - startMinutes

                  // Calculate top position and height in 30-min slots
                  const topPosition = (startMinutes / 30) * SLOT_HEIGHT
                  const height = (durationMinutes / 30) * SLOT_HEIGHT

                  return (
                    <div
                      key={event.id}
                      className={`absolute left-1 right-1 rounded-md p-1 text-xs overflow-hidden cursor-pointer transition hover:brightness-95 active:scale-[0.98] ${event.color}`}
                      style={{
                        top: topPosition,
                        height: height,
                        minHeight: "20px",
                        zIndex: 2,
                      }}
                      onClick={() => onEventClick(event)}
                    >
                      <p className="font-semibold text-xs">{format(event.startTime, "h:mm")}</p>
                      <p className="font-medium text-xs truncate">{event.title}</p>
                      {height > 40 && <p className="text-muted-foreground text-xs truncate">{event.description}</p>}
                    </div>
                  )
                })}

                {/* Clickable empty slots */}
                <TooltipProvider>
                  {timeSlots.map((slot, idx) => {
                    // Mark slot as unavailable if it overlaps with any event
                    const slotStart = slot.hour * 60 + slot.minute
                    const slotEnd = slotStart + 30
                    const hasEvent = dayEvents.some((e) => {
                      const eventStart = e.startTime.getHours() * 60 + e.startTime.getMinutes()
                      const eventEnd = e.endTime.getHours() * 60 + e.endTime.getMinutes()
                      return slotStart < eventEnd && slotEnd > eventStart
                    })
                    if (hasEvent) return null

                    const slotDate = new Date(
                      day.getFullYear(),
                      day.getMonth(),
                      day.getDate(),
                      slot.hour,
                      slot.minute,
                    )

                    return (
                      <div
                        key={`empty-slot-${dayIndex}-${idx}`}
                        className="absolute left-1 right-1"
                        style={{
                          top: idx * SLOT_HEIGHT,
                          height: SLOT_HEIGHT - 2,
                          zIndex: 3,
                        }}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="group w-full h-full flex items-center justify-center rounded focus:outline-none"
                              style={{
                                background: "transparent",
                                height: "100%",
                              }}
                              tabIndex={0}
                              aria-label={`Add event on ${format(day, "MMM d")} at ${format(slotDate, "h:mm a")}`}
                              onClick={() => onSlotClick(slotDate)}
                            >
                              <span
                                className="hidden group-hover:flex items-center justify-center w-full h-full border border-dotted border-cyan-200 rounded bg-white/70 transition"
                                style={{
                                  position: "absolute",
                                  left: 0,
                                  top: 0,
                                  height: "100%",
                                  width: "100%",
                                  zIndex: 4,
                                }}
                              >
                                <Plus className="w-3 h-3 text-cyan-400 opacity-70" />
                              </span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <span>
                              Add event on {format(day, "MMM d")} at {format(slotDate, "h:mm a")}
                            </span>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    )
                  })}
                </TooltipProvider>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
  