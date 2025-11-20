"use client"

import { Bell, Brush, ChevronRight, Lock, User } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet"
import { Switch } from "../ui/switch"

interface SettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function Settings({ open, onOpenChange }: SettingsProps) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
  })

  // Load settings from localStorage on initial component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("app-settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [settings.darkMode])

  const handleToggleChange = (id: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [id]: value }))
  }

  const handleSaveChanges = () => {
    console.log("Saving settings:", settings)
    localStorage.setItem("app-settings", JSON.stringify(settings))
    onOpenChange(false) // Close the sheet after saving
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[400px] bg-gray-50 p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b bg-white">
          <SheetTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Settings
          </SheetTitle>
          <SheetDescription>
            Manage your account settings and preferences.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-grow overflow-y-auto p-6 space-y-8">
          {/* Profile Settings */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Profile</h4>
            <div className="space-y-2">
              <SettingsItem icon={<User className="h-5 w-5 text-gray-500" />} label="Edit Profile" onClick={() => console.log("Edit Profile clicked")} />
              <SettingsItem icon={<Lock className="h-5 w-5 text-gray-500" />} label="Change Password" onClick={() => console.log("Change Password clicked")} />
            </div>
          </div>

          <Separator />

          {/* Notification Settings */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Notifications</h4>
            <div className="space-y-4">
              <SettingsToggle
                icon={<Bell className="h-5 w-5 text-gray-500" />}
                id="email-notifications"
                label="Email Notifications"
                description="Receive email notifications for bookings and reminders."
                checked={settings.emailNotifications}
                onCheckedChange={(value) => handleToggleChange("emailNotifications", value)}
              />
              <SettingsToggle
                icon={<Bell className="h-5 w-5 text-gray-500" />}
                id="push-notifications"
                label="Push Notifications"
                description="Receive push notifications on your devices."
                checked={settings.pushNotifications}
                onCheckedChange={(value) => handleToggleChange("pushNotifications", value)}
                disabled
              />
            </div>
          </div>

          <Separator />

          {/* Appearance Settings */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Appearance</h4>
            <div className="space-y-4">
              <SettingsToggle
                icon={<Brush className="h-5 w-5 text-gray-500" />}
                id="dark-mode"
                label="Dark Mode"
                description="Enable dark theme for the application."
                checked={settings.darkMode}
                onCheckedChange={(value) => handleToggleChange("darkMode", value)}
              />
            </div>
          </div>
        </div>
        <div className="p-6 border-t bg-gray-100">
            <Button className="w-full" onClick={handleSaveChanges}>Save Changes</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Helper components for settings items
const SettingsItem = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors">
    <div className="flex items-center gap-4">
      {icon}
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
    <ChevronRight className="h-5 w-5 text-gray-400" />
  </button>
)

const SettingsToggle = ({
  icon,
  id,
  label,
  description,
  disabled = false,
  checked,
  onCheckedChange,
}: {
  icon: React.ReactNode
  id: string
  label: string
  description: string
  disabled?: boolean
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) => (
  <div className={`flex items-start gap-4 p-3 rounded-lg ${disabled ? 'opacity-50' : ''}`}>
    {icon}
    <div className="flex-1">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700 cursor-pointer">
        {label}
      </Label>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
    <Switch id={id} disabled={disabled} checked={checked} onCheckedChange={onCheckedChange} />
  </div>
)
