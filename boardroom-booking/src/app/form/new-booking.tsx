"use client"

import { DUMMY_EVENTS } from "@/mock/mockData"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  title: z.string().min(2, { message: "Title required." }),
  description: z.string().optional(),
  endTime: z.string().min(1, { message: "End time required." }),
})

export interface BookingFormProps { 
  slotTime: Date | null
  boardroom: { id: string; name: string; capacity: number; availability: boolean; isConfirmed: boolean }
}

export function BookingForm({ slotTime, boardroom }: BookingFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      endTime: "",
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
    const end = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
      endHour,
      endMinute
    )
    if (isNaN(end.getTime()) || end <= start) {
      setError("Invalid end time.")
      return
    }
    const conflicts = DUMMY_EVENTS.some(
      (event) =>
        event.boardroom.id === boardroom.id &&
        ((start >= event.startTime && start < event.endTime) ||
          (end > event.startTime && end <= event.endTime) ||
          (start <= event.startTime && end >= event.endTime))
    )
    if (conflicts) {
      setError("Time slot is already booked for this boardroom.")
      return
    }
    setSuccess("Booking successful!")
    console.log("Booked:", { ...values, startTime: start.toISOString(), boardroomId: boardroom.id })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
      {boardroom && (
        <div className="mb-2">
          <div className="font-medium">Boardroom: <span className="text-emerald-700">{boardroom.name}</span></div>
          <div className="text-sm text-gray-500">Capacity: {boardroom.capacity}</div>
        </div>
      )}
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          {...form.register("title")}
          className="border rounded px-2 py-1 w-full"
        />
        {form.formState.errors.title && (
          <span className="text-red-500 text-xs">
            {form.formState.errors.title.message}
          </span>
        )}
      </div>
      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          {...form.register("description")}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">End Time</label>
        <input
          type="time"
          {...form.register("endTime")}
          className="border rounded px-2 py-1 w-full"
        />
        {form.formState.errors.endTime && (
          <span className="text-red-500 text-xs">
            {form.formState.errors.endTime.message}
          </span>
        )}
      </div>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
      <button
        type="submit"
        className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
      >
        Book
      </button>
    </form>
  )
}