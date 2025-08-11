import { AlertCircle, Clock, Calendar } from "lucide-react"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardTitle } from "../ui/card"
import { format } from "date-fns"
import type { IEvent } from "@/models/IEvent"

interface ReminderProps {
  nextMeeting?: IEvent | null
}

export default function Reminder({ nextMeeting }: ReminderProps) {
  if (!nextMeeting) {
    return (
      <div className="mt-6 flex justify-center h-54">
        <Card className="p-2 shadow-lg shadow-gray rounded-xl w-full max-w-md bg-gradient-to-br from-gray-50 to-gray-100 border-0 relative">
          <div className="flex items-center gap-3 mt-6">
            <span className="inline-flex items-center justify-center bg-gray-100 text-gray-400 rounded-full w-10 h-10">
              <Calendar className="w-6 h-6" />
            </span>
            <CardTitle className="text-lg font-semibold text-gray-600">No Upcoming Meetings</CardTitle>
          </div>
          <CardContent className="">
            <p className="text-gray-500 text-base">You have no meetings scheduled for today.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const timeRange = `${format(nextMeeting.startTime, "HH:mm")} - ${format(nextMeeting.endTime, "HH:mm")}`
  const isToday = format(nextMeeting.startTime, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  const dateDisplay = isToday ? "Today" : format(nextMeeting.startTime, "MMM dd")

  return (
    <div className="mt-6 flex justify-center h-54">
      <Card className="p-2 shadow-lg shadow-gray rounded-xl w-full max-w-md bg-gradient-to-br from-emerald-50 to-teal-50 border-0 relative">
        {/* Time badge at top right with clock icon */}
        <Badge
          className="absolute top-2 right-4 bg-emerald-100 text-emerald-600 font-semibold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 border-0"
          variant="secondary"
        >
          <Clock className="w-4 h-4 mr-1 text-emerald-500" />
          {timeRange}
        </Badge>
        <div className="flex items-center gap-3 mt-6">
          {/* Alert icon */}
          <span className="inline-flex items-center justify-center bg-emerald-50 text-emerald-400 rounded-full w-10 h-10">
            <AlertCircle className="w-6 h-6" />
          </span>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Next Meeting {!isToday && `- ${dateDisplay}`}
          </CardTitle>
        </div>
        <CardContent className="">
          <p className="text-gray-600 text-base">
            <span className="font-semibold text-emerald-400">{nextMeeting.title}</span>
            {nextMeeting.description && (
              <>
                <br />
                <span className="text-sm text-gray-500">{nextMeeting.description}</span>
              </>
            )}
            <br />
            <span className="text-sm text-gray-500">📍 {nextMeeting.boardroom.name}</span>
          </p>
        </CardContent>
      
      </Card>
    </div>
  )
}
