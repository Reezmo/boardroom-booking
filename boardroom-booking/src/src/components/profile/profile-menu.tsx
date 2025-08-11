import React from 'react'
import { Button } from '../ui/button'
import { Avatar } from '@radix-ui/react-avatar'
import { AvatarFallback, AvatarImage } from '../ui/avatar'

export default function ProfileMenu() {
    return (
        <div>
            <Button
                variant="outline"
                size="icon"
                className="rounded-full shadow-sm shadow-sky-200/60 transition-shadow transition-transform duration-200 hover:-translate-y-1 hover:scale-105 cursor-pointer"
                aria-label="Profile"
            // onClick={() => setIsProfileOpen(true)}
            >
                <Avatar>
                    <AvatarImage src="/avatar.gif" alt="Profile Picture" className="h-full w-full rounded-full object-cover" />
                    <AvatarFallback>RR</AvatarFallback>
                    <AvatarImage />
                </Avatar>
            </Button>
        </div>
    )
}
