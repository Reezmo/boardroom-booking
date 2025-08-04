import { useState } from 'react'
// Import ShadCN UI components
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Calendar, DoorClosed, DoorOpen } from "lucide-react"
// Add ShadCN Tooltip
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BOARDROOMS, MEETINGS_COUNT } from "@/mock/mockData"
import { IBoardroom } from "@/models/IBoardroom"

export interface RoomSelectorProps {
  selectedBoardroom: IBoardroom | null
  onSelectBoardroom: (room: IBoardroom) => void
}

export default function RoomSelector({ selectedBoardroom, onSelectBoardroom }: RoomSelectorProps) {
  const [open, setOpen] = useState(false)

  const getStatus = (room: IBoardroom) => room.availability ? "Available" : "Occupied"
  const getIcon = (room: IBoardroom) => room.availability
    ? <DoorOpen className="w-5 h-5" />
    : <DoorClosed className="w-5 h-5" />

  return (
    <div className="relative mb-4">
      <div
        className="cursor-pointer"
        onClick={() => setOpen((v) => !v)}
      >
        <Card className="flex flex-row items-start justify-between px-2 py-1 rounded-full shadow-sm shadow-sky-200/60 transition-shadow transition-transform duration-200 hover:-translate-y-1 hover:scale-105 cursor-pointer">
          <div className="flex flex-row gap-2 items-center">
            <Badge className="rounded-full p-1 bg-sky-400 shadow-md shadow-sky-300/60 ">
              {selectedBoardroom && getIcon(selectedBoardroom)}
            </Badge>
            <div>
              <div className="font-medium text-sm">{selectedBoardroom?.name}</div>
              <div className="flex items-center gap-1">
                <span className={`text-xs ${selectedBoardroom?.availability ? "text-emerald-400" : "text-red-600"}`}>
                  {selectedBoardroom ? getStatus(selectedBoardroom) : ""}
                </span>
                <span
                  className={`inline-block w-2 h-2 rounded-full shadow ${selectedBoardroom?.availability
                    ? "bg-emerald-400 shadow-emerald-300/70"
                    : "bg-rose-400 shadow-rose-300/70"
                  }`}
                />
              </div>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="secondary"
                  className="mt-2 flex items-center justify-center gap-1 px-1 py-0.5 text-xs bg-emerald-50 text-emerald-400 shadow shadow-sky-100/60"
                >
                  <Calendar className="w-3 h-3" />
                  <span>{selectedBoardroom ? MEETINGS_COUNT[selectedBoardroom.id] ?? 0 : 0}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <span>
                  {selectedBoardroom ? MEETINGS_COUNT[selectedBoardroom.id] ?? 0 : 0} meeting
                  {(selectedBoardroom && MEETINGS_COUNT[selectedBoardroom.id] !== 1) ? "s" : ""} scheduled
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Card>
      </div>
      {open && (
        <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow shadow-sky-200/60 ">
          {BOARDROOMS
            .filter(room => room.id !== selectedBoardroom?.id)
            .map(room => (
              <div
                key={room.id}
                className="hover:bg-muted px-2 py-1 cursor-pointer flex flex-row items-center justify-between rounded-full transition-shadow duration-200"
                onClick={() => {
                  onSelectBoardroom(room)
                  setOpen(false)
                }}
              >
                <div className="flex flex-row gap-2 items-center">
                  <Badge className="rounded-full p-1 bg-teal-400 flex items-center justify-center shadow-md shadow-sky-100/60">
                    {getIcon(room)}
                  </Badge>
                  <div>
                    <div className="font-medium text-sm">{room.name}</div>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs ${room.availability ? "text-green-600" : "text-red-600"}`}>
                        {getStatus(room)}
                      </span>
                      <span
                        className={`inline-block w-2 h-2 rounded-full shadow ${room.availability
                          ? "bg-green-500 shadow-green-400/70"
                          : "bg-red-500 shadow-red-400/70"
                        }`}
                      />
                    </div>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="secondary"
                        className="flex items-center justify-center gap-1 px-1 py-0.5 text-xs bg-emerald-50 text-emerald-400 shadow shadow-sky-100/60"
                      >
                        <Calendar className="w-3 h-3" />
                        <span>{MEETINGS_COUNT[room.id] ?? 0}</span>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>{MEETINGS_COUNT[room.id] ?? 0} meeting{(MEETINGS_COUNT[room.id] ?? 0) !== 1 ? "s" : ""} scheduled</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
      