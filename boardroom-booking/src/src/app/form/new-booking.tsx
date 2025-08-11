"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DUMMY_EVENTS } from "@/mock/mockData"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import type { IEvent } from "@/models/IEvent"

const formSchema = z.object({
  title: z.string().min(2, { message: "Title required." }),
  description: z.string().optional(),
  endTime: z.string().min(1, { message: "End time required." }),
})

export interface BookingFormProps {
  slotTime: Date | null
  boardroom: { id: string; name: string; capacity: number; availability: boolean; isConfirmed: boolean }
  onBookingSuccess?: (event: IEvent) => void
  existingEvent?: IEvent
  onEventDelete?: (eventId: string) => void
}

export function BookingForm({ slotTime, boardroom, onBookingSuccess, existingEvent, onEventDelete }: BookingFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const isEditing = !!existingEvent

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: existingEvent?.title || "",
      description: existingEvent?.description || "",
      endTime: existingEvent ? format(existingEvent.endTime, "HH:mm") : "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null)
    setSuccess(null)
    if (!slotTime || !boardroom) {
      setError("No start time or boardroom selected.")
      return
    }
    const start = slotTime
    const [endHour, endMinute] = values.endTime.split(":").map(Number)
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate(), endHour, endMinute)
    if (isNaN(end.getTime()) || end <= start) {
      setError("Invalid end time.")
      return
    }

    // Check for conflicts, but exclude the current event if editing
    const conflicts = DUMMY_EVENTS.some(
      (event) =>
        event.id !== existingEvent?.id &&
        event.boardroom.id === boardroom.id &&
        ((start >= event.startTime && start < event.endTime) ||
          (end > event.startTime && end <= event.endTime) ||
          (start <= event.startTime && end >= event.endTime)),
    )
    if (conflicts) {
      setError("Time slot is already booked for this boardroom.")
      return
    }

    setSuccess(isEditing ? "Event updated successfully!" : "Booking successful!")

    const eventData: IEvent = {
      id: existingEvent?.id || Math.random().toString(36).slice(2),
      title: values.title,
      description: values.description ?? "",
      startTime: start,
      endTime: end,
      boardroom,
      color: existingEvent?.color || "bg-emerald-200",
    }

    if (onBookingSuccess) {
      onBookingSuccess(eventData)
    }

    console.log(isEditing ? "Updated:" : "Booked:", {
      ...values,
      startTime: start.toISOString(),
      boardroomId: boardroom.id,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
        {boardroom && (
          <div className="mb-2">
            <div className="font-medium">
              Boardroom: <span className="text-emerald-700">{boardroom.name}</span>
            </div>
            <div className="text-sm text-gray-500">Capacity: {boardroom.capacity}</div>
          </div>
        )}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <div className="flex gap-2">
          <Button type="submit" className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 flex-1">
            {isEditing ? "Update" : "Book"}
          </Button>
          {isEditing && onEventDelete && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (existingEvent && onEventDelete) {
                  onEventDelete(existingEvent.id)
                }
              }}
              className="px-4 py-2 rounded"
            >
              Delete
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
