"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, Calendar, Building } from 'lucide-react'
import type { IUser } from "../../models/IUser" // Adjusted path
import { DUMMY_USER } from "../../mock/mockData" // Adjusted path

export default function ProfileMenu() {
  const [user] = useState<IUser>(DUMMY_USER)

  const handleProfileClick = () => {
    console.log("Navigate to profile for user:", user.id)
  }

  const handleSettingsClick = () => {
    console.log("Navigate to settings")
  }

  const handleMyBookingsClick = () => {
    console.log("Navigate to my bookings for user:", user.id)
  }

  const handleLogoutClick = () => {
    console.log("Logout user:", user.id)
  }

  // Generate initials from user fullName
  const getInitials = (fullName: string): string => {
    return fullName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-sm shadow-sky-200/60 transition duration-200 hover:-translate-y-1 hover:scale-105 cursor-pointer bg-transparent"
            aria-label="Profile"
          >
            <Avatar>
              <AvatarImage
                src={user.profilePicture || "/avatar.gif"}
                alt="Profile Picture"
                className="h-full w-full rounded-full object-cover"
              />
              <AvatarFallback className="bg-teal-100 text-teal-700 font-semibold">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.fullName}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.mail}</p>
              {user.tenantId && (
                <div className="flex items-center text-xs leading-none text-muted-foreground">
                  <Building className="mr-1 h-3 w-3" />
                  <span>Tenant ID: {user.tenantId}</span>
                </div>
              )}
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleMyBookingsClick} className="cursor-pointer">
            <Calendar className="mr-2 h-4 w-4" />
            <span>My Bookings</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleLogoutClick} className="cursor-pointer text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
