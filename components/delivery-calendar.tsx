"use client"

import "react-day-picker/dist/style.css" // base styles (v8 path). Safe to keep and then override.
import "./delivery-calendar.css"

import { DayPicker } from "react-day-picker"
import { enGB } from "date-fns/locale"
import { startOfWeek, startOfDay, addDays } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

type Props = {
  value: Date[]
  onChange: (dates: Date[]) => void
  /**
   * Allowed window in weeks starting from the current week.
   * 2 => current week + 1 following week (1 Week option)
   * 3 => current week + 2 following weeks (2 Weeks option)
   * 4 => current week + 3 following weeks (1 Month option)
   */
  allowedWeeks: number
  className?: string
}

/**
 * DeliveryCalendar
 * - Monday-first (enGB)
 * - Past and out-of-range dates disabled + grey
 * - Selected dates filled Fitnest green (no blue rings)
 * - Uses onSelect (no custom click handler) and strict disabled matchers
 * - Visuals are guaranteed via a tiny scoped CSS file (delivery-calendar.css)
 */
export function DeliveryCalendar({ value, onChange, allowedWeeks, className }: Props) {
  const today = new Date()
  const weekStartsOn = 1 as const // Monday
  const allowedStart = startOfWeek(today, { weekStartsOn })
  const allowedEnd = addDays(allowedStart, allowedWeeks * 7 - 1)
  const todayStart = startOfDay(today)

  return (
    <div className={cn("rounded-xl border bg-white p-4", className)}>
      <DayPicker
        locale={enGB}
        mode="multiple"
        selected={value}
        onSelect={(days) => onChange(days || [])}
        // Disable past dates and any date after the allowed window
        disabled={[{ before: todayStart }, { after: allowedEnd }]}
        // Clamp navigation so users can’t leave the valid window
        defaultMonth={allowedStart}
        fromDate={todayStart}
        toDate={allowedEnd}
        showOutsideDays
        numberOfMonths={allowedWeeks >= 4 ? 2 : 1}
        className="rdp fitnest-calendar"
        classNames={{
          // containers
          months: "flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-base font-semibold",
          // navigation
          nav: "space-x-2 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-8 w-8 bg-transparent p-0 opacity-80 hover:opacity-100",
          ),
          nav_button_previous: "absolute left-2",
          nav_button_next: "absolute right-2",
          // grid
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-muted-foreground rounded-md w-10 font-medium text-[0.8rem] text-center select-none",
          row: "flex w-full mt-1",
          cell: "h-10 w-10 text-center text-sm p-0 relative",
          // day buttons
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-10 w-10 p-0 font-medium rounded-full cursor-pointer focus-visible:ring-0 focus:ring-0 focus:outline-none",
          ),
          day_selected: "rounded-full text-white",
          day_outside: "text-muted-foreground opacity-40",
          day_disabled: "opacity-60 cursor-not-allowed",
          day_hidden: "invisible",
        }}
        components={{
          IconLeft: () => <ChevronLeft className="h-4 w-4" />,
          IconRight: () => <ChevronRight className="h-4 w-4" />,
        }}
      />

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-fitnest-green" />
          Selected
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-gray-200" />
          Unavailable
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full border border-gray-300 bg-white" />
          Today
        </span>
      </div>
    </div>
  )
}
