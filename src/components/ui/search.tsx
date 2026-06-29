"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { ChangeEvent } from "react"

interface SearchInputProps {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

export default function SearchInput({ value, onChange, placeholder = "Search proposals..." }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input placeholder={placeholder} value={value} onChange={onChange} className="pl-10 w-[300px]" />
    </div>
  )
}