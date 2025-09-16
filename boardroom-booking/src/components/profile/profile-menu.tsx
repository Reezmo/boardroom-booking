"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Building, Calendar, LogOut, Settings, User } from 'lucide-react'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/app/firebase"
import { signOut, User as FirebaseUser } from "firebase/auth"

export default function ProfileMenu() {
  const router = useRouter()
  const [user, setUser] = useState<FirebaseUser | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser)
    })
    return () => unsubscribe()
  }, [])

  const handleProfileClick = () => {
    // Implement navigation to profile page if needed
  }

  const handleSettingsClick = () => {
    // Implement navigation to settings page if needed
  }

  const handleMyBookingsClick = () => {
    // Implement navigation to bookings page if needed
  }

  const handleLogoutClick = async () => {
    await signOut(auth)
    setUser(null)
  router.push("/auth")
  }

  // Generate initials from user displayName or email
  const getInitials = (displayName?: string, email?: string): string => {
    if (displayName) {
      return displayName
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    if (email) {
      return email.slice(0, 2).toUpperCase()
    }
    return "US"
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-sm shadow-cyan-200/60 transition duration-200 hover:-translate-y-1 hover:scale-105 cursor-pointer bg-transparent"
            aria-label="Profile"
          >
            <Avatar>
              <AvatarImage
                src={user?.photoURL || "/avatar.gif"}
                alt="Profile Picture"
                className="h-full w-full rounded-full object-cover"
              />
              <AvatarFallback className="bg-teal-100 text-teal-700 font-semibold">
                {getInitials(user?.displayName ?? undefined, user?.email ?? undefined)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.displayName || "User"}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email || "No email"}</p>
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
