"use client"
import React from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { IBoardroom } from "@/models/IBoardroom"
import type { IEvent } from "@/models/IEvent"
import { format, isSameDay, isToday } from "date-fns"
import { Plus } from "lucide-react"

const HOUR_HEIGHT = 60 // pixels per hour
const SLOT_HEIGHT = 30 // pixels per 30-min slot

interface DailyViewProps {
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  selectedBoardroom: IBoardroom
  events: IEvent[]
  onEventClick: (event: IEvent) => void
  onSlotClick: (slotTime: Date) => void
}

export function DailyView({
  selectedDate,
  setSelectedDate,
  selectedBoardroom,
  events,
  onEventClick,
  onSlotClick,
}: DailyViewProps) {
  // 48 slots for 24 hours, each 30 min
  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const minute = (i % 2) * 30
    return { hour, minute }
  })

  // Filter events for the current day and boardroom
  const dayEvents = events.filter((event: IEvent) => event.boardroom.id === selectedBoardroom.id && isSameDay(event.startTime, selectedDate))

  return (
    <>
      <div className="flex gap-2 w-full px-4 pb-4">
        {(() => {
          const weekStart = new Date(selectedDate)
          weekStart.setDate(selectedDate.getDate() - ((selectedDate.getDay() + 6) % 7))
          return Array.from({ length: 7 }).map((_, i) => {
            const day = new Date(weekStart)
            day.setDate(weekStart.getDate() + i)
            const isCurrentDay = isToday(day)
            const isSelected = isSameDay(day, selectedDate)
            return (
              <div
                key={i}
                className={`flex flex-col items-center justify-center flex-1 rounded-2xl px-0 py-2 cursor-pointer transition-all hover:shadow-md
                          ${
                            isCurrentDay
                              ? "bg-cyan-50 text-cyan-400 font-bold shadow rounded-2xl"
                              : isSelected
                                ? "bg-teal-100 text-cyan-400 font-bold shadow rounded-2xl"
                                : "bg-white text-cyan-700 font-bold shadow rounded-2xl"
                          }
                          border border-gray-200`}
                style={{ minWidth: 0 }}
                onClick={() => setSelectedDate(day)}
              >
                <span className="text-xs uppercase">{format(day, "EEE")}</span>
                <span className="text-lg">{format(day, "d")}</span>
              </div>
            )
          })
        })()}
      </div>
      <ScrollArea className="h-[calc(100vh-285px)] rounded-3xl">
        <div className="grid grid-cols-[60px_1fr] h-full">
          {/* Time Labels */}
          <div className="sticky left-0 z-10 pr-2 text-right text-xs text-cyan-700 pt-[30px] select-none">
            {timeSlots.map((slot, idx) => (
              <div
                key={idx}
                style={{ height: SLOT_HEIGHT, lineHeight: `${SLOT_HEIGHT}px` }}
                className={`flex items-start justify-end ${
                  slot.minute === 0 && slot.hour % 6 === 0 ? "font-bold text-cyan-700" : ""
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
            {dayEvents.map((event: IEvent) => {
              const startMinutes = new Date(event.startTime).getHours() * 60 + new Date(event.startTime).getMinutes()
              const endMinutes = new Date(event.endTime).getHours() * 60 + new Date(event.endTime).getMinutes()
              const durationMinutes = endMinutes - startMinutes

              // Calculate top position and height in 30-min slots
              const topPosition = (startMinutes / 30) * SLOT_HEIGHT
              const height = (durationMinutes / 30) * SLOT_HEIGHT

              return (
                <div
                  key={event.id}
                  className={`absolute left-2 right-2 rounded-lg shadow-md bg-white border border-cyan-100 p-2 text-xs overflow-hidden cursor-pointer transition hover:shadow-lg active:scale-[0.98] ${event.color}`}
                  style={{
                    top: topPosition,
                    height: height,
                    minHeight: "32px",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  onClick={() => onEventClick(event)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-cyan-700 text-xs">{format(new Date(event.startTime), "h:mm a")}</span>
                    <span className="font-semibold text-gray-800 text-xs truncate">{event.title}</span>
                  </div>
                  {event.description && (
                    <span className="text-xs text-gray-500 truncate">{event.description}</span>
                  )}
                </div>
              )
            })}
            {/* Overlay clickable empty slots */}
            <TooltipProvider>
              {timeSlots.map((slot, idx) => {
                // Mark slot as unavailable if it overlaps with any event
                const slotStart = slot.hour * 60 + slot.minute
                const slotEnd = slotStart + 30
                const hasEvent = dayEvents.some((e: IEvent) => {
                  const eventStart = new Date(e.startTime).getHours() * 60 + new Date(e.startTime).getMinutes();
                  const eventEnd = new Date(e.endTime).getHours() * 60 + new Date(e.endTime).getMinutes();
                  // Slot overlaps with event if slotStart < eventEnd and slotEnd > eventStart
                  return slotStart < eventEnd && slotEnd > eventStart;
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
                            className="hidden group-hover:flex items-center justify-center w-full h-full border-2 border-dotted border-cyan-200 rounded-lg bg-white/70 transition"
                            style={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              height: "100%",
                              width: "100%",
                              zIndex: 4,
                            }}
                          >
                            <Plus className="w-5 h-5 text-cyan-400 opacity-70" />
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
    </>
  )
}
