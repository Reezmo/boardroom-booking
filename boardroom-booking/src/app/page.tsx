"use client"

import Reminder from "@/components/panel/reminder"
import RoomSelector from "@/components/panel/room-selector"
import Notifications from "@/components/sheet/notifications"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BOARDROOMS, DUMMY_EVENTS } from "@/mock/mockData"
import { BookingForm } from "@/app/form/new-booking"
import {
  addMonths,
  // eachDayOfInterval, // Removed due to missing export
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isToday,
  startOfMonth,
  subMonths,
} from "date-fns"
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useMemo, useState } from "react"
import ProfileMenu from "@/components/profile/profile-menu"

// Get today's date at midnight
const today = new Date();
today.setHours(0, 0, 0, 0);

// Set initial selectedDate/currentMonth to today and this month
const HOUR_HEIGHT = 60 // pixels per hour
const SLOT_HEIGHT = 30 // pixels per 30-min slot

export default function EventCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [selectedBoardroom, setSelectedBoardroom] = useState(BOARDROOMS[0]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSlotTime, setDialogSlotTime] = useState<Date | null>(null);

  const daysOfWeek = [
    { label: "M", key: "mon" },
    { label: "T", key: "tue" },
    { label: "W", key: "wed" },
    { label: "T", key: "thu" },
    { label: "F", key: "fri" },
    { label: "S", key: "sat" },
    { label: "S", key: "sun" },
  ]

  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date)
    const end = endOfMonth(date)
    // Manually create array of days in interval since eachDayOfInterval is not available
    const days: Date[] = []
    const current = new Date(start)
    while (current <= end) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    // Add leading days from previous month to fill the first week (Monday as first day)
    const firstDayOfWeek = (getDay(start) + 6) % 7 // Adjust to make Monday=0, Sunday=6
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.unshift(new Date(start.getFullYear(), start.getMonth(), start.getDate() - (firstDayOfWeek - i)))
    }

    // Add trailing days from next month to fill the last week
    const lastDayOfWeek = (getDay(end) + 6) % 7 // Adjust to make Monday=0, Sunday=6
    for (let i = 0; i < 6 - lastDayOfWeek; i++) {
      days.push(new Date(end.getFullYear(), end.getMonth(), end.getDate() + (i + 1)))
    }

    return days
  }

  const days = useMemo(() => getDaysInMonth(currentMonth), [currentMonth])

  // 48 slots for 24 hours, each 30 min
  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const minute = (i % 2) * 30
    return { hour, minute }
  })

  const filteredEvents = useMemo(() => {
    return DUMMY_EVENTS.filter(
      (event) =>
        isSameDay(event.startTime, selectedDate) &&
        (!selectedBoardroom || event.boardroom.id === selectedBoardroom.id)
    );
  }, [selectedDate, selectedBoardroom]);

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleTodayClick = () => {
    const today = new Date()
    setSelectedDate(today)
    setCurrentMonth(startOfMonth(today))
  }

  return (
    <div className="flex flex-col p-4 h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-100">
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Mini Calendar */}
        <div className="w-80 ml-4 mt-2">
          {/* Boardroom Switch */}
          <RoomSelector
            selectedBoardroom={selectedBoardroom}
            onSelectBoardroom={setSelectedBoardroom}
          />
          {/* Mini Calendar */}
          <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-zinc-100 via-white to-teal-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevMonth}
                  className="rounded-full hover:bg-emerald-100 transition "
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="font-semibold text-emerald-400 tracking-wide text-lg drop-shadow">
                  {format(currentMonth, "MMMM yyyy")}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNextMonth}
                  className="rounded-full hover:bg-emerald-100 transition"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-7 text-center text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-widest">
                {daysOfWeek.map((day, idx) => (
                  <div key={day.key + idx} className="py-1">{day.label}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-sm">
                {days.map((day, index) => {
                  const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                  const isCurrentDay = isToday(day);
                  const isSelected = isSameDay(day, selectedDate);

                  // Highlight current week in the viewed month
                  const weekDay = day.getDay();
                  // Find the Monday of this week
                  const weekStart = new Date(day);
                  weekStart.setDate(day.getDate() - ((weekDay + 6) % 7));
                  weekStart.setHours(0, 0, 0, 0);
                  const weekEnd = new Date(weekStart);
                  weekEnd.setDate(weekStart.getDate() + 6);
                  weekEnd.setHours(23, 59, 59, 999);

                  // Is this day in the same week as today?
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const todayWeekDay = today.getDay();
                  const todayWeekStart = new Date(today);
                  todayWeekStart.setDate(today.getDate() - ((todayWeekDay + 6) % 7));
                  todayWeekStart.setHours(0, 0, 0, 0);
                  const todayWeekEnd = new Date(todayWeekStart);
                  todayWeekEnd.setDate(todayWeekStart.getDate() + 6);
                  todayWeekEnd.setHours(23, 59, 59, 999);

                  const isCurrentWeek =
                    weekStart.getTime() === todayWeekStart.getTime();

                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      className={`
                        h-9 w-9 rounded-full flex items-center justify-center font-semibold 
                        transition-all duration-150
                        ${!isCurrentMonth ? "text-muted-foreground opacity-40" : ""}
                        ${isCurrentWeek ? "bg-em-100" : ""}
                        ${isCurrentDay ? "ring-2 ring-emerald-400 ring-offset-2 text-emerald-700 bg-emerald-100" : ""}
                       n
                        ${isCurrentDay && isSelected ? "ring-2 ring-emerald-600" : ""}
                        hover:bg-emerald-50
                      `}
                      onClick={() => setSelectedDate(day)}
                    >
                      {format(day, "d")}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          <Separator className='mt-4'/>
          <Reminder />
        </div>
        <div className="w-6 flex-shrink-0" /> 
        {/* Right Panel: Header and Time Grid */}
        <div className="flex-1 relative">
          <Card className="p-2 rounded-3xl shadow-gray">
            <CardContent className="p-0 h-full">
              {/* Header */}
              <div className="flex flex-col mb-4 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="rounded-full p-0 w-10 h-10 flex items-center justify-center  text-muted bg-emerald-400">
                      <CalendarDays className="w-7 h-7" />
                    </Badge>
                    <h2 className="text-2xl font-bold text-muted-foreground">{format(selectedDate, "MMMM dd, yyyy")}</h2>
                  </div>
                  
                  <div className="flex-1 flex justify-center">
                    <Tabs defaultValue="day" className="w-full max-w-xs text-emerald-400">
                      <TabsList className="w-full flex justify-center border border-gray-200 rounded-full p-1 text-emerald-400">
                        <TabsTrigger
                          value="day"
                          className="flex-1 rounded-full px-4 py-1 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-400 data-[state=inactive]:bg-white data-[state=inactive]:text-zinc-400 transition"
                        >
                          Day
                        </TabsTrigger>
                        <TabsTrigger
                          value="week"
                          className="flex-1 rounded-full px-4 py-1 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-400 data-[state=inactive]:bg-white data-[state=inactive]:text-zinc-400 transition"
                        >
                          Week
                        </TabsTrigger>
                        <TabsTrigger
                          value="month"
                          className="flex-1 rounded-full px-4 py-1 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-400 data-[state=inactive]:bg-white data-[state=inactive]:text-zinc-400 transition"
                        >
                          Month
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className=" rounded-full shadow-sm shadow-sky-200/60 transition-shadow transition-transform duration-200 hover:-translate-y-1 hover:scale-105 cursor-pointer"
                      onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className=" rounded-full shadow-sm shadow-sky-200/60 transition-shadow transition-transform duration-200 hover:-translate-y-1 hover:scale-105 cursor-pointer rounded-full px-4"
                      onClick={handleTodayClick}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full shadow-sm shadow-sky-200/60 transition-shadow transition-transform duration-200 hover:-translate-y-1 hover:scale-105 cursor-pointer"
                      onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
                    >
                      <ChevronRight className="h-4 w-4 " />
                    </Button>
                   <Notifications />
                   <ProfileMenu />
                  </div>
                </div>
                {/* Week Card UI */}
                <div className="flex gap-2 w-full ">
                  {(() => {
                    // Calculate the start of the week (Monday)
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
                          className={`flex flex-col items-center justify-center flex-1 rounded-2xl px-0 py-2 cursor-pointer transition
                            ${
                              isCurrentDay
                                ? "bg-emerald-50 text-emerald-400 font-bold shadow rounded-2xl"
                                : isSelected
                                ? "bg-teal-100 text-emerald-400 font-bold shadow rounded-2xl"
                                : "bg-white text-zinc-400 font-bold shadow rounded-2xl"
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
              </div>
              {/* Time Grid and Events */}
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
                          <span>
                            {format(new Date(2000, 0, 1, slot.hour, 0), "h a")}
                          </span>
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
                      ) : null
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
                      ) : null
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
                          onClick={() => alert(`Event: ${event.title}`)}
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
                      const slotStart = slot.hour * 60 + slot.minute;
                      const slotEnd = slotStart + 30;
                      const hasEvent = filteredEvents.some(
                        (e) => {
                          const eventStart = e.startTime.getHours() * 60 + e.startTime.getMinutes();
                          const eventEnd = e.endTime.getHours() * 60 + e.endTime.getMinutes();
                          // Slot overlaps with event if slotStart < eventEnd and slotEnd > eventStart
                          return slotStart < eventEnd && slotEnd > eventStart;
                        }
                      );
                      if (hasEvent) return null;
                      const slotDate = new Date(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth(),
                        selectedDate.getDate(),
                        slot.hour,
                        slot.minute
                      );
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
                                onClick={() => {
                                  setDialogSlotTime(slotDate);
                                  setDialogOpen(true);
                                }}
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
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Add Event Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Event</DialogTitle>
          </DialogHeader>
          <div>
            {dialogSlotTime && (
              <div className="mb-4">
                <span className="font-medium">Time: </span>
                {format(dialogSlotTime, "MMMM dd, yyyy h:mm a")}
              </div>
            )}
            {/* Booking form inserted below */}
            <BookingForm slotTime={dialogSlotTime} boardroom={selectedBoardroom} />
          </div>
          <DialogFooter>
            <Button 
            variant="outline"
             onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}