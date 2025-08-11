"use client"

import React, { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetTitle } from '../ui/sheet'
import { Button } from '../ui/button';
import { Check, X, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { format } from 'date-fns';
import type { IEvent } from '@/models/IEvent';

interface MeetingConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventConfirm?: (eventId: string) => void;
  onEventCancel?: (eventId: string) => void;
  events?: IEvent[];
}

export default function MeetingConfirmation({ 
  open, 
  onOpenChange, 
  onEventConfirm, 
  onEventCancel, 
  events = [] 
}: MeetingConfirmationProps) {
  const [timers, setTimers] = useState<Record<string, number>>({});

  // Get pending confirmation events
  const pendingEvents = events.filter(event => 
    event.IsConfirmed === false && 
    event.startTime > new Date()
  );

  // Initialize timers for pending events
  useEffect(() => {
    const newTimers: Record<string, number> = {};
    pendingEvents.forEach(event => {
      if (!timers[event.id]) {
        newTimers[event.id] = 20; // 20 seconds
      }
    });
    
    if (Object.keys(newTimers).length > 0) {
      setTimers(prev => ({ ...prev, ...newTimers }));
    }
  }, [pendingEvents.length]);

  // Timer countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const updated = { ...prev };
        let hasChanges = false;

        Object.keys(updated).forEach(eventId => {
          if (updated[eventId] > 0) {
            updated[eventId] -= 1;
            hasChanges = true;
          } else if (updated[eventId] === 0) {
            // Auto-cancel when timer reaches 0
            onEventCancel?.(eventId);
            delete updated[eventId];
            hasChanges = true;
          }
        });

        return hasChanges ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onEventCancel]);

  const handleConfirm = (eventId: string) => {
    onEventConfirm?.(eventId);
    setTimers(prev => {
      const updated = { ...prev };
      delete updated[eventId];
      return updated;
    });
  };

  const handleCancel = (eventId: string) => {
    onEventCancel?.(eventId);
    setTimers(prev => {
      const updated = { ...prev };
      delete updated[eventId];
      return updated;
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-96">
        <SheetTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Meeting Confirmations
          {pendingEvents.length > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {pendingEvents.length}
            </Badge>
          )}
        </SheetTitle>
        
        <div className="mt-6 space-y-4">
          {pendingEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Check className="h-12 w-12 mx-auto mb-4 opacity-50 text-green-500" />
              <p className="text-lg font-medium mb-2">All Meetings Confirmed</p>
              <p className="text-sm">No pending confirmations at this time.</p>
            </div>
          ) : (
            <>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {pendingEvents.length} meeting{pendingEvents.length > 1 ? 's' : ''} require confirmation
                  </span>
                </div>
                <p className="text-xs text-amber-700 mt-1">
                  Meetings will be automatically cancelled if not confirmed within 20 seconds.
                </p>
              </div>

              {pendingEvents.map((event) => (
                <div key={event.id} className="border rounded-lg p-4 space-y-3 bg-white shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${event.color.replace('text-', 'bg-').split(' ')[0]}`} />
                      <span className="font-medium text-sm">Confirmation Required</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3 text-red-500" />
                      <span className={`font-mono font-bold ${
                        (timers[event.id] || 0) <= 5 ? 'text-red-600' : 'text-amber-600'
                      }`}>
                        {timers[event.id] || 0}s
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    {event.description && (
                      <p className="text-sm text-gray-600">{event.description}</p>
                    )}
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <span>📍</span>
                        <span>{event.boardroom.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>🕒</span>
                        <span>{format(event.startTime, 'MMM dd, HH:mm')}</span>
                      </div>
                      {event.attendees && (
                        <div className="flex items-center gap-1">
                          <span>👥</span>
                          <span>{event.attendees} attendees</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <span>⏱️</span>
                        <span>
                          {Math.round((event.endTime.getTime() - event.startTime.getTime()) / (1000 * 60))} min
                        </span>
                      </div>
                    </div>
                    {event.organizer && (
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Organizer:</span> {event.organizer.fullName}
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleConfirm(event.id)}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Confirm Meeting
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancel(event.id)}
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
