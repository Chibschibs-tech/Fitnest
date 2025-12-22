"use client"

import { useState } from "react"
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  isAfter,
  isBefore,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { isDateInRange } from "./utils/dates"

interface DeliveryCalendarProps {
  availableStart: Date
  availableEnd: Date
  selectedDays: Date[]
  onDaysChange: (days: Date[]) => void
  minDays?: number
}

export function DeliveryCalendar({ 
  availableStart, 
  availableEnd, 
  selectedDays,
  onDaysChange,
  minDays = 3
}: DeliveryCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(availableStart)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  
  const daysInCalendar = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const toggleDay = (day: Date) => {
    if (!isDateInRange(day, availableStart, availableEnd)) return

    const isSelected = selectedDays.some(d => isSameDay(d, day))
    
    if (isSelected) {
      onDaysChange(selectedDays.filter(d => !isSameDay(d, day)))
    } else {
      onDaysChange([...selectedDays, day])
    }
  }

  const canGoToPrevMonth = isAfter(startOfMonth(currentMonth), availableStart)
  const canGoToNextMonth = isBefore(endOfMonth(currentMonth), availableEnd)

  return (
    <div className="border rounded-lg p-4 bg-white max-w-md">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-sm">
          {format(currentMonth, 'MMMM yyyy')}
        </h4>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            disabled={!canGoToPrevMonth}
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            disabled={!canGoToNextMonth}
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Compact Selection Counter */}
      <div className="mb-3 text-xs">
        {selectedDays.length === 0 && (
          <p className="text-gray-500">Select at least {minDays} days</p>
        )}
        {selectedDays.length > 0 && selectedDays.length < minDays && (
          <p className="text-amber-600 font-medium">
            {selectedDays.length}/{minDays} days selected
          </p>
        )}
        {selectedDays.length >= minDays && (
          <p className="text-green-600 font-medium">
            ✓ {selectedDays.length} day{selectedDays.length !== 1 ? 's' : ''} selected
          </p>
        )}
      </div>

      {/* Compact Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
          <div key={idx} className="text-center text-[10px] font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Compact Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {daysInCalendar.map((day, idx) => {
          const isInCurrentMonth = isSameMonth(day, currentMonth)
          const isAvailable = isDateInRange(day, availableStart, availableEnd)
          const isSelected = selectedDays.some(d => isSameDay(d, day))
          const isToday = isSameDay(day, new Date())

          return (
            <button
              key={idx}
              onClick={() => toggleDay(day)}
              disabled={!isAvailable}
              className={cn(
                "aspect-square rounded text-xs font-medium transition-all",
                "hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-fitnest-green",
                !isInCurrentMonth && "text-gray-300",
                !isAvailable && "cursor-not-allowed opacity-30 hover:bg-transparent",
                isAvailable && isInCurrentMonth && "text-gray-700",
                isSelected && "bg-fitnest-green text-white hover:bg-fitnest-green/90 font-semibold",
                isToday && !isSelected && "ring-1 ring-fitnest-green ring-inset"
              )}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>

      {/* Compact Legend */}
      <div className="flex items-center gap-3 mt-3 pt-3 border-t text-[10px] text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded border border-fitnest-green" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-fitnest-green" />
          <span>Selected</span>
        </div>
      </div>
    </div>
  )
}
