"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { format } from "date-fns"
import { Plus } from "lucide-react"
import type { IEvent } from "@/models/IEvent"
import type { IBoardroom } from "@/models/IBoardroom"

const HOUR_HEIGHT = 60 // pixels per hour
const SLOT_HEIGHT = 30 // pixels per 30-min slot

interface DailyViewProps {
  selectedDate: Date
  selectedBoardroom: IBoardroom
  filteredEvents: IEvent[]
  onEventClick: (event: IEvent) => void
  onSlotClick: (slotTime: Date) => void
}

export function DailyView({
  selectedDate,
  selectedBoardroom,
  filteredEvents,
  onEventClick,
  onSlotClick,
}: DailyViewProps) {
  // 48 slots for 24 hours, each 30 min
  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const minute = (i % 2) * 30
    return { hour, minute }
  })

  return (
    <ScrollArea className="h-[calc(100vh-215px)] rounded-3xl">
      <div className="grid grid-cols-[60px_1fr] h-full">
        {/* Time Labels */}
        <div className="sticky left-0 z-10 pr-2 text-right text-xs text-muted-foreground pt-[30px] select-none">
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
        {/* Time Lines and Events */}
        <div className="relative">
          {/* Background stripes */}
          {timeSlots.map((slot, idx) => (
            <div
              key={`line-bg-${idx}`}
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
          {/* Main hour lines */}
          {timeSlots.map((slot, idx) =>
            slot.minute === 0 ? (
              <div
                key={`line-${idx}`}
                className="absolute left-0 right-0 border-t border-gray-200"
                style={{
                  top: idx * SLOT_HEIGHT,
                  height: 0,
                  zIndex: 1,
                  opacity: 0.5,
                }}
              />
            ) : null,
          )}
          {/* 30-min interval lines, faintest */}
          {timeSlots.map((slot, idx) =>
            slot.minute === 30 ? (
              <div
                key={`half-line-${idx}`}
                className="absolute left-0 right-0 border-t border-gray-200"
                style={{
                  top: idx * SLOT_HEIGHT,
                  height: 0,
                  zIndex: 1,
                  opacity: 0.18,
                }}
                aria-hidden="true"
              />
            ) : null,
          )}
          {/* Events */}
          {filteredEvents.map((event) => {
            const startMinutes = event.startTime.getHours() * 60 + event.startTime.getMinutes()
            const endMinutes = event.endTime.getHours() * 60 + event.endTime.getMinutes()
            const durationMinutes = endMinutes - startMinutes

            // Calculate top position and height in 30-min slots
            const topPosition = (startMinutes / 30) * SLOT_HEIGHT
            const height = (durationMinutes / 30) * SLOT_HEIGHT

            return (
              <div
                key={event.id}
                className={`absolute left-2 right-2 rounded-md p-2 text-xs overflow-hidden cursor-pointer transition hover:brightness-95 active:scale-[0.98] ${event.color}`}
                style={{
                  top: topPosition,
                  height: height,
                  minHeight: "20px",
                }}
                onClick={() => onEventClick(event)}
              >
                <p className="font-semibold">{format(event.startTime, "h:mm a")}</p>
                <p className="font-medium">{event.title}</p>
                <p className="text-muted-foreground">{event.description}</p>
              </div>
            )
          })}
          {/* Overlay clickable empty slots */}
          <TooltipProvider>
            {timeSlots.map((slot, idx) => {
              // Mark slot as unavailable if it overlaps with any event
              const slotStart = slot.hour * 60 + slot.minute
              const slotEnd = slotStart + 30
              const hasEvent = filteredEvents.some((e) => {
                const eventStart = e.startTime.getHours() * 60 + e.startTime.getMinutes()
                const eventEnd = e.endTime.getHours() * 60 + e.endTime.getMinutes()
                // Slot overlaps with event if slotStart < eventEnd and slotEnd > eventStart
                return slotStart < eventEnd && slotEnd > eventStart
              })
              if (hasEvent) return null
              const slotDate = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
                slot.hour,
                slot.minute,
              )
              return (
                <div
                  key={`empty-slot-overlay-${idx}`}
                  className="absolute left-2 right-2"
                  style={{
                    top: idx * SLOT_HEIGHT,
                    height: SLOT_HEIGHT - 4,
                    zIndex: 3,
                  }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="group w-full h-full flex items-center justify-center rounded-lg focus:outline-none"
                        style={{
                          background: "transparent",
                          height: "100%",
                        }}
                        tabIndex={0}
                        aria-label={`Add event at ${format(slotDate, "h:mm a")}`}
                        onClick={() => onSlotClick(slotDate)}
                      >
                        <span
                          className="hidden group-hover:flex items-center justify-center w-full h-full border-2 border-dotted border-emerald-200 rounded-lg bg-white/70 transition"
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            height: "100%",
                            width: "100%",
                            zIndex: 4,
                          }}
                        >
                          <Plus className="w-5 h-5 text-emerald-400 opacity-70" />
                        </span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Add event at {format(slotDate, "h:mm a")}</span>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )
            })}
          </TooltipProvider>
        </div>
      </div>
    </ScrollArea>
  )
}
