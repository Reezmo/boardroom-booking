"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { IEvent } from "@/models/IEvent"
import { format } from "date-fns"
import { Calendar, Clock, Edit, FileText, MapPin, Trash2, User, Users } from "lucide-react"

interface ViewEventProps {
  event: IEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (event: IEvent) => void
  onDelete: (eventId: string) => void
}

export function ViewEvent({ event, open, onOpenChange, onEdit, onDelete }: ViewEventProps) {
  if (!event) return null

  const duration = Math.round((event.endTime.getTime() - event.startTime.getTime()) / (1000 * 60))
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60
  const durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`

  const isToday = format(event.startTime, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  const isTomorrow =
    format(event.startTime, "yyyy-MM-dd") === format(new Date(Date.now() + 24 * 60 * 60 * 1000), "yyyy-MM-dd")

  const getDateDisplay = () => {
    if (isToday) return "Today"
    if (isTomorrow) return "Tomorrow"
    return format(event.startTime, "EEEE, MMMM dd, yyyy")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className={`w-5 h-5 rounded-full ${event.color.replace("text-", "bg-").split(" ")[0]}`} />
            {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-5">
          {/* Date and Time */}
          <div className="flex items-start gap-4">
            <Calendar className="w-5 h-5 text-gray-500 mt-1" />
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{getDateDisplay()}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Clock className="w-4 h-4" />
                <span>
                  {format(event.startTime, "h:mm a")} - {format(event.endTime, "h:mm a")}
                </span>
                <Badge variant="outline" className="text-xs font-medium">
                  {durationText}
                </Badge>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-4">
            <MapPin className="w-5 h-5 text-gray-500 mt-1" />
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{event.boardroom.name}</p>
              <p className="text-sm text-gray-500">Capacity: {event.boardroom.capacity} people</p>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <>
              <Separator />
              <div className="flex items-start gap-4">
                <FileText className="w-5 h-5 text-gray-500 mt-1" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 mb-1">Description</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
                </div>
              </div>
            </>
          )}

          {/* Organizer */}
          {event.organizer && (
            <>
              <Separator />
              <div className="flex items-start gap-4">
                <User className="w-5 h-5 text-gray-500 mt-1" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">Organizer</p>
                  <p className="text-sm text-gray-600">{event.organizer.fullName}</p>
                  <p className="text-xs text-gray-500">{event.organizer.mail}</p>
                </div>
              </div>
            </>
          )}

          {/* Attendees */}
          {event.attendees && (
            <div className="flex items-start gap-4">
              <Users className="w-5 h-5 text-gray-500 mt-1" />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Attendees</p>
                <p className="text-sm text-gray-600">{event.attendees} people</p>
              </div>
            </div>
          )}

          {/* Agenda */}
          {event.agenda && (
            <>
              <Separator />
              <div className="flex items-start gap-4">
                <FileText className="w-5 h-5 text-gray-500 mt-1" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 mb-1">Agenda</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{event.agenda}</p>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex-row justify-between items-center bg-gray-50 p-4 border-t">
          <Button
            variant="ghost"
            onClick={() => {
              onDelete(event.id)
              onOpenChange(false)
            }}
            className="text-red-600 hover:text-red-600 hover:bg-red-100"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                onEdit(event)
                onOpenChange(false)
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
