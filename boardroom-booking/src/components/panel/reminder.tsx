import type { IEvent } from "@/models/IEvent"
import { format } from "date-fns"
import { AlertCircle, Calendar, CheckCircle, Clock, Play, Timer } from 'lucide-react'
import { Badge } from "../ui/badge"
import { Card, CardContent, CardTitle } from "../ui/card"

interface ReminderProps {
  nextMeeting?: IEvent | null
  currentMeeting?: IEvent | null
  selectedBoardroom: { id: string; name: string; capacity: number; availability: boolean; isConfirmed?: boolean }
}

export default function Reminder({ nextMeeting, currentMeeting, selectedBoardroom }: ReminderProps) {
  // If there's a current meeting in progress, show that instead of upcoming
  const displayMeeting = currentMeeting || nextMeeting
  const isCurrentMeeting = !!currentMeeting

  if (!displayMeeting) {
    return (
      <div className="flex justify-center h-auto">
        <Card className="p-3 shadow-lg rounded-2xl w-full max-w-xs bg-gradient-to-br from-gray-50 to-gray-100 border-0 relative flex flex-col items-center">
          <span className="inline-flex items-center justify-center bg-gray-100 text-gray-400 rounded-full w-12 h-12 mb-2 shadow">
            <Calendar className="w-7 h-7" />
          </span>
          <CardTitle className="text-base font-semibold text-gray-600 mb-1">
            {isCurrentMeeting ? "No Active Meeting" : "No Upcoming Meetings"}
          </CardTitle>
          <CardContent className="p-0 text-center h-full">
            <p className="text-gray-500 text-sm">
              {selectedBoardroom.name} is currently available for booking.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const timeRange = `${format(displayMeeting.startTime, "HH:mm")} - ${format(displayMeeting.endTime, "HH:mm")}`
  const isToday = format(displayMeeting.startTime, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  const dateDisplay = isToday ? "Today" : format(displayMeeting.startTime, "MMM dd")
  
  // Determine status and styling based on meeting state
  const getStatusInfo = () => {
    if (isCurrentMeeting) {
      return {
        text: "Meeting in Progress",
        icon: <Play className="w-3 h-3" />,
        className: "bg-blue-100 text-blue-700 border-blue-200",
        cardGradient: "from-blue-50 to-indigo-50",
        iconBg: "bg-blue-50 text-blue-400",
        titleColor: "text-blue-800"
      }
    } else if (displayMeeting.IsConfirmed === false) {
      return {
        text: "Pending Confirmation",
        icon: <Timer className="w-3 h-3" />,
        className: "bg-amber-100 text-amber-700 border-amber-200",
        cardGradient: "from-amber-50 to-yellow-50",
        iconBg: "bg-amber-50 text-amber-400",
        titleColor: "text-amber-800"
      }
    } else {
      return {
        text: "Confirmed",
        icon: <CheckCircle className="w-3 h-3" />,
        className: "bg-emerald-100 text-emerald-700 border-emerald-200",
        cardGradient: "from-emerald-50 to-teal-50",
        iconBg: "bg-emerald-50 text-emerald-400",
        titleColor: "text-emerald-800"
      }
    }
  }

  const statusInfo = getStatusInfo()

  // Calculate time remaining or elapsed for current meetings
  const getTimeInfo = () => {
    const now = new Date()
    if (isCurrentMeeting) {
      const timeRemaining = Math.max(0, Math.round((displayMeeting.endTime.getTime() - now.getTime()) / (1000 * 60)))
      return {
        label: "Time Remaining",
        value: timeRemaining > 0 ? `${timeRemaining} min` : "Ending soon"
      }
    } else {
      const timeUntil = Math.round((displayMeeting.startTime.getTime() - now.getTime()) / (1000 * 60))
      if (timeUntil <= 0) {
        return { label: "Starts in", value: "Starting now" }
      }
      if (timeUntil < 60) {
        return { label: "Starts in", value: `${timeUntil} min` }
      }
      const hours = Math.floor(timeUntil / 60)
      const minutes = timeUntil % 60
      if (minutes === 0) {
        return { label: "Starts in", value: `${hours}h` }
      }
      return { label: "Starts in", value: `${hours}h ${minutes}m` }
    }
  }

  const timeInfo = getTimeInfo()

  return (
    <div className="mt-4 flex justify-center h-auto">
      <Card className={`p-3 shadow-lg rounded-2xl w-full max-w-xs bg-gradient-to-br ${statusInfo.cardGradient} border-0 relative flex flex-col`}>
        {/* Top Row: Time & Status */}
        <div className="flex items-center justify-between mb-2">
          <Badge
            className="bg-white/90 text-gray-700 font-semibold px-2 py-1 rounded-full shadow-sm flex items-center gap-1 border-0"
            variant="secondary"
          >
            <Clock className="w-4 h-4 mr-1 text-gray-600" />
            {timeRange}
          </Badge>
          <Badge
            className={`px-2 py-1 rounded-full shadow-sm flex items-center gap-1 text-xs font-medium border ${statusInfo.className}`}
            variant="secondary"
          >
            {statusInfo.icon}
            {statusInfo.text}
          </Badge>
        </div>
        {/* Main Info */}
        <div className="flex items-center gap-3 mb-2">
          <span className={`inline-flex items-center justify-center ${statusInfo.iconBg} rounded-full w-11 h-11 shadow`}>
            {isCurrentMeeting ? (
              <Play className="w-6 h-6" />
            ) : (
              <AlertCircle className="w-6 h-6" />
            )}
          </span>
          <div>
            <CardTitle className={`text-base font-semibold ${statusInfo.titleColor}`}>
              {isCurrentMeeting ? "Current Meeting" : "Next Meeting"} {!isToday && <span className="text-xs text-gray-400 font-normal">- {dateDisplay}</span>}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className={`font-bold ${isCurrentMeeting ? "text-blue-600" : "text-emerald-500"} truncate`}>
                {displayMeeting.title}
              </span>
              {displayMeeting.IsConfirmed === false && (
                <span className="ml-1 text-amber-600 text-xs font-semibold animate-pulse">⏳</span>
              )}
            </div>
          </div>
        </div>
        {/* Description & Location */}
        <CardContent className="p-0">
          {displayMeeting.description && (
            <p className="text-xs text-gray-500 mb-1">{displayMeeting.description}</p>
          )}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span role="img" aria-label="location">📍</span>
            {displayMeeting.boardroom.name}
            {displayMeeting.attendees && (
              <>
                <span className="mx-1">|</span>
                <span role="img" aria-label="attendees">👥</span>
                {displayMeeting.attendees}
              </>
            )}
          </div>
        </CardContent>
        {/* Time Remaining/Until */}
        {(isCurrentMeeting || (!isCurrentMeeting && timeInfo.value !== "Starting now")) && (
          <Badge
            className="absolute bottom-2 left-2 px-2 py-1 rounded-full shadow-sm flex items-center gap-1.5 text-xs font-medium bg-white/90 text-gray-700 border border-gray-200"
            variant="secondary"
          >
            <Timer className="w-3.5 h-3.5 text-gray-500" />
            {timeInfo.label}: <span className="font-semibold">{timeInfo.value}</span>
          </Badge>
        )}
      </Card>
    </div>
  )
}
