"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { Calendar, Clock, MapPin, Users, FileText, User, Edit, Trash2 } from "lucide-react"
import type { IEvent } from "@/models/IEvent"

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className={`w-4 h-4 rounded-full ${event.color.replace("text-", "bg-").split(" ")[0]}`} />
            {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Date and Time */}
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-emerald-500 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">{getDateDisplay()}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>
                  {format(event.startTime, "h:mm a")} - {format(event.endTime, "h:mm a")}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {durationText}
                </Badge>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="font-medium text-gray-900">{event.boardroom.name}</p>
              <p className="text-sm text-gray-600">Capacity: {event.boardroom.capacity} people</p>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <>
              <Separator />
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-emerald-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 mb-1">Description</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
                </div>
              </div>
            </>
          )}

          {/* Organizer */}
          {event.organizer && (
            <>
              <Separator />
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="font-medium text-gray-900">Organizer</p>
                  <p className="text-sm text-gray-600">{event.organizer.fullName}</p>
                  <p className="text-xs text-gray-500">{event.organizer.mail}</p>
                </div>
              </div>
            </>
          )}

          {/* Attendees */}
          {event.attendees && (
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="font-medium text-gray-900">Attendees</p>
                <p className="text-sm text-gray-600">{event.attendees} people</p>
              </div>
            </div>
          )}

          {/* Agenda */}
          {event.agenda && (
            <>
              <Separator />
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-emerald-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 mb-1">Agenda</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{event.agenda}</p>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Close
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onDelete(event.id)
              onOpenChange(false)
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <Button
            onClick={() => {
              onEdit(event)
              onOpenChange(false)
            }}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
