"use client"

import { BookingForm } from "@/app/form/new-booking"
import { DailyView } from "@/components/calendar/daily-view"
import { MonthlyView } from "@/components/calendar/monthly-view"
import { ViewEvent } from "@/components/calendar/view-event"
import { WeeklyView } from "@/components/calendar/weekly-view"
import Reminder from "@/components/panel/reminder"
import RoomSelector from "@/components/panel/room-selector"
import ProfileMenu from "@/components/profile/profile-menu"
import MeetingConfirmation from "@/components/sheet/meeting-confirmation"
import Notifications from "@/components/sheet/notifications"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BOARDROOMS, DUMMY_EVENTS } from "@/mock/mockData"
import type { IEvent } from "@/models/IEvent"
import { addMonths, endOfMonth, format, getDay, isSameDay, isToday, startOfMonth, subMonths } from "date-fns"
import { Calendar, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"

// Get today's date at midnight
const today = new Date()
today.setHours(0, 0, 0, 0)

// Set initial selectedDate/currentMonth to today and this month
const HOUR_HEIGHT = 60 // pixels per hour
const SLOT_HEIGHT = 30 // pixels per 30-min slot

export default function EventCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()))
  const [selectedBoardroom, setSelectedBoardroom] = useState(BOARDROOMS[0])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogSlotTime, setDialogSlotTime] = useState<Date | null>(null)

  const [events, setEvents] = useState<IEvent[]>(DUMMY_EVENTS)
  const [editingEvent, setEditingEvent] = useState<IEvent | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  // New state for view event dialog
  const [viewingEvent, setViewingEvent] = useState<IEvent | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  // State for meeting confirmation sheet
  const [confirmationSheetOpen, setConfirmationSheetOpen] = useState(false)

  // State for notifications
  const [notifications, setNotifications] = useState<
    Array<{
      id: string
      type: "info" | "warning" | "success" | "error"
      title: string
      message: string
      timestamp: Date
      read: boolean
    }>
  >([])

  // New state for active calendar tab
  const [activeTab, setActiveTab] = useState("day")

  // Update boardroom availability based on confirmed events
  const updatedBoardrooms = useMemo(() => {
    return BOARDROOMS.map((boardroom) => {
      const now = new Date()
      const hasActiveConfirmedMeeting = events.some(
        (event) =>
          event.boardroom.id === boardroom.id &&
          event.IsConfirmed === true &&
          now >= event.startTime &&
          now <= event.endTime,
      )

      return {
        ...boardroom,
        availability: !hasActiveConfirmedMeeting,
      }
    })
  }, [events])

  // Count pending confirmations
  const pendingConfirmationsCount = useMemo(() => {
    return events.filter((event) => event.IsConfirmed === false && event.startTime > new Date()).length
  }, [events])

  // Helper function to add notification
  const addNotification = (type: "info" | "warning" | "success" | "error", title: string, message: string) => {
    const notification = {
      id: Math.random().toString(36).slice(2),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
    }
    setNotifications((prev) => [notification, ...prev])
  }

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
    const days: Date[] = []
    const current = new Date(start)
    while (current <= end) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    const firstDayOfWeek = (getDay(start) + 6) % 7
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.unshift(new Date(start.getFullYear(), start.getMonth(), start.getDate() - (firstDayOfWeek - i)))
    }

    const lastDayOfWeek = (getDay(end) + 6) % 7
    for (let i = 0; i < 6 - lastDayOfWeek; i++) {
      days.push(new Date(end.getFullYear(), end.getMonth(), end.getDate() + (i + 1)))
    }

    return days
  }

  const days = useMemo(() => getDaysInMonth(currentMonth), [currentMonth])

  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const minute = (i % 2) * 30
    return { hour, minute }
  })

  const filteredEvents = useMemo(() => {
    return events.filter(
      (event) =>
        isSameDay(event.startTime, selectedDate) && (!selectedBoardroom || event.boardroom.id === selectedBoardroom.id),
    )
  }, [selectedDate, selectedBoardroom, events])

  // Find current meeting (meeting in progress right now)
  const currentMeeting = useMemo(() => {
    const now = new Date()

    const currentEvents = events.filter(
      (event) =>
        event.boardroom.id === selectedBoardroom.id &&
        event.IsConfirmed === true &&
        now >= event.startTime &&
        now <= event.endTime,
    )

    // Return the first current meeting (there should only be one per room)
    return currentEvents.length > 0 ? currentEvents[0] : null
  }, [events, selectedBoardroom])

  // Find next upcoming meeting (only if no current meeting)
  const nextMeeting = useMemo(() => {
    // If there's a current meeting, don't show upcoming
    if (currentMeeting) return null

    const now = new Date()

    const upcomingEvents = events.filter(
      (event) => event.startTime > now && event.boardroom.id === selectedBoardroom.id,
    )

    const sortedEvents = upcomingEvents.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())

    return sortedEvents.length > 0 ? sortedEvents[0] : null
  }, [events, selectedBoardroom, currentMeeting])

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
    toast.info("Navigated to today", {
      description: `Viewing ${format(today, "MMMM dd, yyyy")}`,
    })
    addNotification("info", "Calendar Navigation", `Navigated to today's date: ${format(today, "MMMM dd, yyyy")}`)
  }

  const handleBookingSuccess = (newEvent: IEvent) => {
    setEvents((prev) => [...prev, { ...newEvent, IsConfirmed: false }])
    setDialogOpen(false)

    toast.success("Meeting created successfully!", {
      description: `${newEvent.title} scheduled for ${format(newEvent.startTime, "MMM dd, h:mm a")} in ${newEvent.boardroom.name}`,
    })

    addNotification(
      "success",
      "Meeting Created",
      `${newEvent.title} has been scheduled for ${format(newEvent.startTime, "MMM dd, h:mm a")} in ${newEvent.boardroom.name}. Confirmation required.`,
    )
  }

  const handleEventClick = (event: IEvent) => {
    setViewingEvent(event)
    setViewDialogOpen(true)
  }

  const handleEventEdit = (event: IEvent) => {
    setEditingEvent(event)
    setEditDialogOpen(true)
  }

  const handleEventUpdate = (updatedEvent: IEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)))
    setEditDialogOpen(false)
    setEditingEvent(null)

    toast.success("Meeting updated successfully!", {
      description: `${updatedEvent.title} has been updated`,
    })

    addNotification(
      "success",
      "Meeting Updated",
      `${updatedEvent.title} scheduled for ${format(updatedEvent.startTime, "MMM dd, h:mm a")} has been updated.`,
    )
  }

  const handleEventDelete = (eventId: string) => {
    const eventToDelete = events.find((e) => e.id === eventId)
    setEvents((prev) => prev.filter((e) => e.id !== eventId))
    setEditDialogOpen(false)
    setEditingEvent(null)
    setViewDialogOpen(false)

    if (eventToDelete) {
      toast.success("Meeting deleted successfully!", {
        description: `${eventToDelete.title} has been removed from your calendar`,
      })

      addNotification(
        "info",
        "Meeting Deleted",
        `${eventToDelete.title} scheduled for ${format(eventToDelete.startTime, "MMM dd, h:mm a")} has been deleted.`,
      )
    }
  }

  // Handle event confirmation
  const handleEventConfirm = (eventId: string) => {
    const event = events.find((e) => e.id === eventId)
    setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, IsConfirmed: true } : event)))

    if (event) {
      toast.success("Meeting confirmed!", {
        description: `${event.title} on ${format(event.startTime, "MMM dd, h:mm a")} has been confirmed`,
      })

      addNotification(
        "success",
        "Meeting Confirmed",
        `${event.title} scheduled for ${format(event.startTime, "MMM dd, h:mm a")} in ${event.boardroom.name} has been confirmed.`,
      )
    }
  }

  // Handle event cancellation
  const handleEventCancel = (eventId: string) => {
    const event = events.find((e) => e.id === eventId)
    setEvents((prev) => prev.filter((e) => e.id !== eventId))

    if (event) {
      toast.error("Meeting cancelled", {
        description: `${event.title} on ${format(event.startTime, "MMM dd, h:mm a")} has been cancelled`,
      })

      addNotification(
        "warning",
        "Meeting Cancelled",
        `${event.title} scheduled for ${format(event.startTime, "MMM dd, h:mm a")} has been cancelled.`,
      )
    }
  }

  const handleRoomChange = (room: (typeof BOARDROOMS)[0]) => {
    setSelectedBoardroom(room)
    toast.info("Room changed", {
      description: `Now viewing ${room.name}`,
    })
    addNotification("info", "Room Selection", `Switched to viewing ${room.name}`)
  }

  return (
    <div className="flex flex-col p-4 h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-100 ">
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden py-2 ">
        {/* Left Panel: Mini Calendar */}
        <div className="w-80 ml-4 flex flex-col">
          {/* Boardroom Switch */}
          <RoomSelector
            selectedBoardroom={selectedBoardroom}
            onSelectBoardroom={handleRoomChange}
            boardrooms={updatedBoardrooms}
          />
          {/* Mini Calendar */}
          <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-cyan-100 via-white to-teal-100 flex-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevMonth}
                  className="rounded-full hover:bg-cyan-100 transition "
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="font-semibold text-cyan-400 tracking-wide text-lg drop-shadow">
                  {format(currentMonth, "MMMM yyyy")}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNextMonth}
                  className="rounded-full hover:bg-cyan-100 transition"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-7 text-center text-xs font-semibold text-cyan-400 mb-2 uppercase tracking-widest">
                {daysOfWeek.map((day, idx) => (
                  <div key={day.key + idx} className="py-1">
                    {day.label}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-sm">
                {days.map((day, index) => {
                  const isCurrentMonth = day.getMonth() === currentMonth.getMonth()
                  const isCurrentDay = isToday(day)
                  const isSelected = isSameDay(day, selectedDate)

                  const weekDay = day.getDay()
                  const weekStart = new Date(day)
                  weekStart.setDate(day.getDate() - ((weekDay + 6) % 7))
                  weekStart.setHours(0, 0, 0, 0)
                  const weekEnd = new Date(weekStart)
                  weekEnd.setDate(weekStart.getDate() + 6)
                  weekEnd.setHours(23, 59, 59, 999)

                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  const todayWeekDay = today.getDay()
                  const todayWeekStart = new Date(today)
                  todayWeekStart.setDate(today.getDate() - ((todayWeekDay + 6) % 7))
                  todayWeekStart.setHours(0, 0, 0, 0)
                  const todayWeekEnd = new Date(todayWeekStart)
                  todayWeekEnd.setDate(todayWeekStart.getDate() + 6)
                  todayWeekEnd.setHours(23, 59, 59, 999)

                  const isCurrentWeek = weekStart.getTime() === todayWeekStart.getTime()

                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      className={`
                      h-9 w-9 rounded-full flex items-center justify-center font-semibold 
                      transition-all duration-150
                      ${!isCurrentMonth ? "text-muted-foreground opacity-40" : ""}
                      ${isCurrentWeek ? "bg-em-100" : ""}
                      ${isCurrentDay ? "ring-2 ring-cyan-400 ring-offset-2 text-cyan-700 bg-cyan-100" : ""}
                      ${isCurrentDay && isSelected ? "ring-2 ring-cyan-600" : ""}
                      hover:bg-cyan-50
                    `}
                      onClick={() => {
                        setSelectedDate(day)
                        if (!isSameDay(day, selectedDate)) {
                          toast.info("Date selected", {
                            description: `Viewing ${format(day, "MMMM dd, yyyy")}`,
                          })
                          addNotification("info", "Date Selection", `Selected ${format(day, "MMMM dd, yyyy")}`)
                        }
                      }}
                    >
                      {format(day, "d")}
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
          <Separator className="mt-4" />
          <Reminder nextMeeting={nextMeeting} currentMeeting={currentMeeting} selectedBoardroom={selectedBoardroom} />
        </div>
        <div className="w-6 flex-shrink-0" />
        {/* Right Panel: Header and Time Grid */}
        <div className="flex-1 relative">
          <Card className="p-2 rounded-3xl shadow-gray h-full shadow-lg">
            <CardContent className="p-0 h-full flex flex-col">
              {/* Header */}
              <div className="flex flex-col p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="rounded-full p-0 w-10 h-10 flex items-center justify-center  text-muted bg-cyan-400">
                      <CalendarDays className="w-7 h-7" />
                    </Badge>
                    <h2 className="text-2xl font-bold text-cyan-700">
                      {format(selectedDate, "MMMM dd, yyyy")}
                    </h2>
                  </div>

                  <div className="flex-1 flex justify-center">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-xs text-cyan-400 ">
                      <TabsList className="w-full flex justify-center border border-gray-200 rounded-full p-1 text-cyan-400">
                        <TabsTrigger
                          value="day"
                          className="hover: cursor-pointer flex-1 rounded-full px-4 py-1 data-[state=active]:bg-cyan-50 data-[state=active]:text-cyan-400 data-[state=inactive]:bg-white data-[state=inactive]:text-cyan-700 transition"
                        >
                          Day
                        </TabsTrigger>
                        <TabsTrigger
                          value="week"
                          className="hover: cursor-pointer flex-1 rounded-full px-4 py-1 data-[state=active]:bg-cyan-50 data-[state=active]:text-cyan-400 data-[state=inactive]:bg-white data-[state=inactive]:text-cyan-700 transition"
                        >
                          Week
                        </TabsTrigger>
                        <TabsTrigger
                          value="month"
                          className="hover: cursor-pointer flex-1 rounded-full px-4 py-1 data-[state=active]:bg-cyan-50 data-[state=active]:text-cyan-400 data-[state=inactive]:bg-white data-[state=inactive]:text-cyna-700 transition"
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
                      className=" rounded-full shadow-sm shadow-cyan-200/60 transition-shadow transition-transform duration-200 hover:-translate-y-1 hover:scale-105 cursor-pointer bg-transparent"
                      onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className=" rounded-full shadow-sm shadow-cyan-200/60 transition-shadow transition-transform duration-200 hover:-translate-y-1 hover:scale-105 cursor-pointer rounded-full px-4 bg-transparent"
                      onClick={handleTodayClick}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full shadow-sm shadow-cyan-200/60 transition-shadow transition-transform duration-200 hover:-translate-y-1 hover:scale-105 cursor-pointer bg-transparent"
                      onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
                    >
                      <ChevronRight className="h-4 w-4 " />
                    </Button>

                    {/* Meeting Confirmation Button */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full shadow-sm shadow-cyan-200/60 transition-shadow transition-transform duration-200 hover:-translate-y-1 hover:scale-105 cursor-pointer relative bg-transparent"
                      aria-label="Meeting Confirmations"
                      onClick={() => setConfirmationSheetOpen(true)}
                    >
                      <Calendar className="h-5 w-5" />
                      {pendingConfirmationsCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                          {pendingConfirmationsCount}
                        </Badge>
                      )}
                    </Button>

                    <Notifications
                      notifications={notifications}
                      onMarkAsRead={(id) => {
                        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
                      }}
                    />
                    <ProfileMenu />
                  </div>
                </div>
                {/* Week Card UI */}
                
              </div>
              {/* Time Grid and Events */}
              <ScrollArea className="flex-1 rounded-3xl">
                {activeTab === "day" && (
                  <DailyView
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    selectedBoardroom={selectedBoardroom}
                    filteredEvents={filteredEvents}
                    onEventClick={handleEventClick}
                    onSlotClick={(slotTime) => {
                      setDialogSlotTime(slotTime)
                      setDialogOpen(true)
                    }}
                  />
                )}

                {activeTab === "week" && (
                  <WeeklyView
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    selectedBoardroom={selectedBoardroom}
                    events={events} // WeeklyView filters events internally for the week
                    onEventClick={handleEventClick}
                    onSlotClick={(slotTime) => {
                      setDialogSlotTime(slotTime)
                      setDialogOpen(true)
                    }}
                  />
                )}

                {activeTab === "month" && (
                  <MonthlyView
                    selectedDate={selectedDate}
                    selectedBoardroom={selectedBoardroom}
                    events={events} // MonthlyView filters events internally for the month
                    onEventClick={handleEventClick}
                    onDayClick={(date) => {
                      setSelectedDate(date)
                      // Optionally switch to day view when a day is clicked in month view
                      setActiveTab("day")
                      toast.info("Date selected", {
                        description: `Viewing ${format(date, "MMMM dd, yyyy")}`,
                      })
                      addNotification("info", "Date Selection", `Selected ${format(date, "MMMM dd, yyyy")}`)
                    }}
                  />
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Meeting Confirmation Sheet */}
      <MeetingConfirmation
        open={confirmationSheetOpen}
        onOpenChange={setConfirmationSheetOpen}
        onEventConfirm={handleEventConfirm}
        onEventCancel={handleEventCancel}
        events={events}
      />

      {/* View Event Dialog */}
      <ViewEvent
        event={viewingEvent}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        onEdit={handleEventEdit}
        onDelete={handleEventDelete}
      />

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
            <BookingForm
              slotTime={dialogSlotTime}
              boardroom={selectedBoardroom}
              onBookingSuccess={handleBookingSuccess}
            />
          </div>
          {/* <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <div>
            {editingEvent && (
              <BookingForm
                slotTime={editingEvent.startTime}
                boardroom={editingEvent.boardroom}
                existingEvent={editingEvent}
                onBookingSuccess={handleEventUpdate}
                onEventDelete={handleEventDelete}
              />
            )}
          </div>
          {/* <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </div>
  )
}
