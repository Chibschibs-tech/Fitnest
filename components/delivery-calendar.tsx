"use client"

import "react-day-picker/dist/style.css"
import "./delivery-calendar.css"

import { DayPicker } from "react-day-picker"
import { enGB } from "date-fns/locale"
import { startOfWeek, startOfDay, addDays } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { useEffect, useState } from "react"

type Props = {
  value: Date[]
  onChange: (dates: Date[]) => void
  /**
   * Allowed window in weeks starting from the current week.
   * Example: 2 => current week + 1 following week (2 weeks total)
   *          3 => current week + 2 following weeks (3 weeks total)
   *          4 => current week + 3 following weeks (4 weeks total)
   */
  allowedWeeks: number
  className?: string
}

/**
 * DeliveryCalendar
 * - Monday-first (enGB)
 * - 48h rule: "today" and "tomorrow" are always disabled (unselectable)
 * - Past and out-of-range dates disabled/grey
 * - Two months displayed side-by-side on ≥640px; one month on small screens
 * - Selected dates are solid Fitnest green, no blue rings
 */
export function DeliveryCalendar({ value, onChange, allowedWeeks, className }: Props) {
  const today = new Date()

  // 48h rule: earliest selectable date is start of the day, 2 days from now
  const minSelectable = startOfDay(addDays(today, 2))

  // Window: current week start through N weeks ahead (inclusive)
  const weekStartsOn = 1 as const // Monday
  const allowedStart = startOfWeek(today, { weekStartsOn })
  const allowedEnd = addDays(allowedStart, allowedWeeks * 7 - 1)

  // Responsive: 2 months on md+, 1 month on small screens
  const [months, setMonths] = useState(2)
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)")
    const update = () => setMonths(mql.matches ? 1 : 2)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [])

  return (
    <div className={cn("rounded-xl border bg-white p-4", className)}>
      <DayPicker
        locale={enGB}
        mode="multiple"
        selected={value}
        onSelect={(days) => onChange(days || [])}
        // Disable everything before the 48h min OR after the allowed window
        disabled={[{ before: minSelectable }, { after: allowedEnd }]}
        // Clamp navigation and start users on the first selectable month
        defaultMonth={minSelectable}
        fromDate={minSelectable}
        toDate={allowedEnd}
        showOutsideDays
        numberOfMonths={months}
        className="rdp fitnest-calendar"
        classNames={{
          // Containers
          months: "flex w-full flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-between",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-base font-semibold",

          // Navigation
          nav: "space-x-2 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-8 w-8 bg-transparent p-0 opacity-80 hover:opacity-100",
          ),
          nav_button_previous: "absolute left-2",
          nav_button_next: "absolute right-2",

          // Grid
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-10 font-medium text-[0.8rem] text-center select-none tabular-nums",
          row: "flex w-full mt-1",
          cell: "h-10 w-10 text-center text-sm p-0 relative",

          // Day button (do NOT use buttonVariants to avoid rings)
          day_button:
            "h-10 w-10 p-0 rounded-full font-medium cursor-pointer " +
            "focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 border-0",

          // States
          day_outside: "text-muted-foreground opacity-40",
          day_disabled: "opacity-60 cursor-not-allowed",
          day_hidden: "invisible",
        }}
        components={{
          IconLeft: () => <ChevronLeft className="h-4 w-4" />,
          IconRight: () => <ChevronRight className="h-4 w-4" />,
        }}
        // Inline safety overrides
        styles={{
          day_button: {
            outline: "none",
            boxShadow: "none",
            border: "none",
            WebkitTapHighlightColor: "transparent",
            borderRadius: 9999,
          },
          day_selected: {
            backgroundColor: "#015033",
            color: "#ffffff",
            border: "none",
            boxShadow: "none",
            outline: "none",
          },
          day_today: {
            border: "1px solid #d1d5db", // gray-300
            borderRadius: 9999,
          },
          day_disabled: {
            color: "#9ca3af", // gray-400
            backgroundColor: "#f3f4f6", // gray-100
            borderRadius: 9999,
          },
        }}
      />

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: "#015033" }} />
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
