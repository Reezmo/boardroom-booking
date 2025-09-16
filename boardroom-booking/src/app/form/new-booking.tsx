"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DUMMY_EVENTS } from "@/mock/mockData"
import type { IEvent } from "@/models/IEvent"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useState } from "react"
import emailjs from '@emailjs/browser';
import { useForm } from "react-hook-form"
import { z } from "zod"

export interface BookingFormProps {
  slotTime: Date | null
  boardroom: { id: string; name: string; capacity: number; availability: boolean; isConfirmed: boolean }
  onBookingSuccess?: (event: IEvent) => void
  existingEvent?: IEvent
  onEventDelete?: (eventId: string) => void
  userEmail?: string
}

export function BookingForm({ slotTime, boardroom, onBookingSuccess, existingEvent, onEventDelete, userEmail }: BookingFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const isEditing = !!existingEvent

  // Create dynamic schema with boardroom capacity validation
  const formSchema = z.object({
    title: z.string().min(2, { message: "Title required." }),
    description: z.string().optional(),
    agenda: z.string().optional(),
    attendees: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true // Optional field, so empty is valid
          const num = Number.parseInt(val)
          if (isNaN(num) || num <= 0) return false
          return num <= boardroom.capacity
        },
        {
          message: `Number of attendees cannot exceed boardroom capacity (${boardroom.capacity}).`,
        },
      ),
    endTime: z.string().min(1, { message: "End time required." }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: existingEvent?.title || "",
      description: existingEvent?.description || "",
      endTime: existingEvent ? format(existingEvent.endTime, "HH:mm") : "",
      agenda: existingEvent?.agenda || "",
      attendees: existingEvent?.attendees?.toString() || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null)
    setSuccess(null)
    if (!slotTime || !boardroom) {
      setError("No start time or boardroom selected.")
      return
    }
    const start = slotTime
    const [endHour, endMinute] = values.endTime.split(":").map(Number)
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate(), endHour, endMinute)
    // Restrict booking times to working hours (09:00 to 18:00)
    const WORK_START = 9
    const WORK_END = 18
    if (
      start.getHours() < WORK_START ||
      start.getHours() >= WORK_END ||
      end.getHours() < WORK_START ||
      end.getHours() > WORK_END ||
      (end.getHours() === WORK_END && end.getMinutes() > 0) ||
      isNaN(end.getTime()) || end <= start
    ) {
      setError("Bookings are only allowed between 09:00 and 18:00.")
      return
    }

    // Create event object with IsConfirmed: true
    const newEvent: IEvent = {
      id: Math.random().toString(36).slice(2),
      title: values.title,
      description: values.description ?? "",
      agenda: values.agenda || undefined,
      attendees: values.attendees ? Number.parseInt(values.attendees) : undefined,
      startTime: start,
      endTime: end,
      boardroom,
      IsConfirmed: true, // Mark as confirmed immediately
      color: "text-cyan-400",
      organizer: undefined
    }

    // Block the time slot for other users (this logic assumes a backend or state management system is in place)
    if (onBookingSuccess) onBookingSuccess(newEvent)

    // Send confirmation email using EmailJS
    console.log('Sending email with EmailJS...');
    console.log('Email details:', {
      to_email: userEmail,
      event_title: newEvent.title,
      event_date: format(newEvent.startTime, 'MMMM dd, yyyy'),
      event_time: `${format(newEvent.startTime, 'h:mm a')} - ${format(newEvent.endTime, 'h:mm a')}`,
      boardroom: newEvent.boardroom.name,
    });

    // Add this line for debugging
    console.log('Attempting to send email to:', userEmail);

    emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      {
        to_email: userEmail, // Ensure this is a valid email address
        event_title: newEvent.title,
        event_date: format(newEvent.startTime, 'MMMM dd, yyyy'),
        event_time: `${format(newEvent.startTime, 'h:mm a')} - ${format(newEvent.endTime, 'h:mm a')}`,
        boardroom: newEvent.boardroom.name,
      },
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
    ).then(
      () => {
        console.log('Email sent successfully!');
        setSuccess('Meeting booked successfully! Confirmation email sent.');
      },
      (error) => {
        console.error('Failed to send email:', error);
        setError('Meeting booked, but failed to send confirmation email.');
      }
    );
  }

  async function handleDelete() {
    if (!existingEvent || !onEventDelete) return;

    setDeleteError(null);
    setDeleteSuccess(null);

    try {
      onEventDelete(existingEvent.id);

      // Send cancellation email
      emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_CANCELLATION_TEMPLATE_ID!, // Use the new cancellation template ID
        {
          to_email: userEmail,
          event_title: existingEvent.title,
          event_date: format(existingEvent.startTime, 'MMMM dd, yyyy'),
          event_time: `${format(existingEvent.startTime, 'h:mm a')} - ${format(existingEvent.endTime, 'h:mm a')}`,
          boardroom: existingEvent.boardroom.name,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      ).then(
        () => {
          console.log('Cancellation email sent successfully!');
          setDeleteSuccess('Booking deleted and cancellation email sent.');
        },
        (error) => {
          console.error('Failed to send cancellation email:', error);
          setDeleteError('Booking deleted, but failed to send cancellation email.');
        }
      );
    } catch (e) {
      console.error('Failed to delete booking', e);
      setDeleteError('Failed to delete booking.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => onSubmit(values))} className="space-y-4 max-w-md mx-auto">
        {boardroom && (
          <div className="mb-2">
            <div className="font-medium">
              Boardroom: <span className="text-cyan-700">{boardroom.name}</span>
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
          name="agenda"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agenda</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Meeting agenda..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="attendees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Attendees</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max={boardroom.capacity}
                  placeholder={`Max ${boardroom.capacity} attendees`}
                  {...field}
                />
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
        {deleteError && <div className="text-red-600">{deleteError}</div>}
        {deleteSuccess && <div className="text-green-600">{deleteSuccess}</div>}
        <div className="flex gap-2">
          <Button type="submit" className="px-4 py-2 roundedflex-1">
            {isEditing ? "Update" : "Book"}
          </Button>
          {isEditing && onEventDelete && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
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


// Updated the boardroom selection options to reflect the new names: 'Cloud', 'IdeaHub', and 'Intune'.
// Updated the boardroom selection options to reflect the new names: 'Cloud', 'IdeaHub', and 'Intune'.

/*
How to push changes to GitHub:

1. Open your terminal or command prompt.
2. Navigate to your project's root directory.
   cd c:\Users\olwet\Downloads\boardroom-booking\boardroom-booking

3. Stage the files you want to commit. To stage all changes, use:
   git add .

4. Commit your staged changes with a message describing what you've done:
   git commit -m "Your descriptive commit message here"

5. Push your committed changes to your remote repository on GitHub.
   If you are on a branch named 'main', you would use:
   git push origin main

   Replace 'main' with the name of your branch if it's different (e.g., 'master', 'develop').
*/
