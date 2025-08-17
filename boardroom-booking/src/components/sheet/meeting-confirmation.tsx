"use client"

import type { IEvent } from '@/models/IEvent';
import { format } from 'date-fns';
import { AlertTriangle, Calendar, Check, Clock, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTitle } from '../ui/sheet';

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
      <SheetContent side="right" className="w-full sm:w-[400px] bg-gray-50 p-0">
        <div className="p-6">
          <SheetTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Meeting Confirmations
            {pendingEvents.length > 0 && (
              <Badge variant="destructive" className="ml-auto animate-pulse">
                {pendingEvents.length}
              </Badge>
            )}
          </SheetTitle>
        </div>
        
        <div className="mt-2 space-y-4 px-6 pb-6 h-[calc(100vh-80px)] overflow-y-auto">
          {pendingEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Check className="h-16 w-16 mx-auto mb-4 text-green-500/80" />
              <p className="text-lg font-semibold mb-2 text-gray-800">All Meetings Confirmed</p>
              <p className="text-sm">You have no pending meeting confirmations.</p>
            </div>
          ) : (
            <>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4" role="alert">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5" />
                  <div>
                    <p className="font-bold text-sm">
                      {pendingEvents.length} meeting{pendingEvents.length > 1 ? 's' : ''} require confirmation
                    </p>
                    <p className="text-xs mt-1">
                      Meetings will be automatically cancelled if not confirmed.
                    </p>
                  </div>
                </div>
              </div>

              {pendingEvents.map((event) => (
                <div key={event.id} className="border rounded-xl bg-white shadow-sm overflow-hidden transition-all hover:shadow-md">
                  <div className="p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${event.color.replace('text-', 'bg-').split(' ')[0]}`} />
                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <Clock className="h-3.5 w-3.5 text-red-500" />
                        <span className={`font-mono font-bold text-base ${
                          (timers[event.id] || 0) <= 5 ? 'text-red-600 animate-pulse' : 'text-gray-700'
                        }`}>
                          {timers[event.id] || 0}s
                        </span>
                      </div>
                    </div>
                    
                    {event.description && (
                      <p className="text-sm text-gray-600">{event.description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">📍</span>
                        <span>{event.boardroom.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">🕒</span>
                        <span>{format(event.startTime, 'MMM dd, HH:mm')}</span>
                      </div>
                      {event.attendees && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">👥</span>
                          <span>{event.attendees} attendees</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">⏱️</span>
                        <span>
                          {Math.round((event.endTime.getTime() - event.startTime.getTime()) / (1000 * 60))} min
                        </span>
                      </div>
                    </div>
                    {event.organizer && (
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        <span className="font-medium">Organizer:</span> {event.organizer.fullName}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 px-4 py-3 flex gap-3">
                    <Button
                      size="sm"
                      onClick={() => handleConfirm(event.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancel(event.id)}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                  <div className="h-1.5 bg-gray-200">
                    <div 
                      className={`h-full transition-all duration-1000 linear ${
                        (timers[event.id] || 0) <= 5 ? 'bg-red-500' : 'bg-yellow-400'
                      }`}
                      style={{ width: `${((timers[event.id] || 0) / 20) * 100}%` }}
                    />
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
