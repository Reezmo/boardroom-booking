import React, { useState } from 'react'
import { Sheet, SheetContent, SheetTitle } from '../ui/sheet'
import { Button } from '../ui/button';
import { Bell } from 'lucide-react';



export default function Notifications() {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    return (
        <div>
            <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
                <SheetContent side="right">
                    <SheetTitle>Notifications</SheetTitle>
                </SheetContent>
            </Sheet>
            <Button
                variant="outline"
                size="icon"
                className="rounded-full shadow-sm shadow-sky-200/60 transition-shadow transition-transform duration-200 hover:-translate-y-1 hover:scale-105 cursor-pointer"
                aria-label="Notifications"
                onClick={() => setIsNotificationsOpen(true)}
            >
                <Bell className="h-5 w-5" />
            </Button>
        </div>
    )
}
