import { addDays, startOfDay, isSameDay, isAfter, isBefore } from "date-fns"

export function getMinimumStartDate(): Date {
  // 48 hours from now
  const now = new Date()
  return startOfDay(addDays(now, 2))
}

export function getAvailableDateRange(durationWeeks: number): { start: Date; end: Date } {
  const start = getMinimumStartDate()
  const days = durationWeeks * 7
  const end = addDays(start, days - 1)
  
  return { start, end }
}

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  const dayStart = startOfDay(date)
  return (isSameDay(dayStart, start) || isAfter(dayStart, start)) && 
         (isSameDay(dayStart, end) || isBefore(dayStart, end))
}
