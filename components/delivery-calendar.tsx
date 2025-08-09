"use client"

import "react-day-picker/dist/style.css"
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
   * Example: 2 => current week + 1 following week (2 weeks total)
   *          3 => current week + 2 following weeks (3 weeks total)
   *          4 => current week + 3 following weeks (4 weeks total)
   */
  allowedWeeks: number
  className?: string
}

/**
 * A self-contained, styled calendar optimized for selecting multiple delivery days.
 * - Weeks start on Monday (enGB locale)
 * - Dates outside the allowed window are disabled and greyed
 * - Selected dates are filled with Fitnest green (no blue rings)
 */
export function DeliveryCalendar({ value, onChange, allowedWeeks, className }: Props) {
  const today = new Date()
  const weekStartsOn = 1 as const // Monday
  const allowedStart = startOfWeek(today, { weekStartsOn })
  const allowedEnd = addDays(allowedStart, allowedWeeks * 7 - 1)
  const todayStart = startOfDay(today)

  return (
    <div className={cn("rounded-md border bg-white p-3", className)}>
      <DayPicker
        locale={enGB}
        mode="multiple"
        selected={value}
        onSelect={(days) => onChange(days || [])}
        showOutsideDays
        // Disable: past dates, and any date after the allowed window
        disabled={[{ before: todayStart }, { after: allowedEnd }]}
        numberOfMonths={allowedWeeks >= 4 ? 2 : 1}
        className={cn("p-2 rdp")}
        classNames={{
          // containers
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-6 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-base font-semibold",
          // navigation
          nav: "space-x-2 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100",
          ),
          nav_button_previous: "absolute left-2",
          nav_button_next: "absolute right-2",
          // grid
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-muted-foreground rounded-md w-10 font-medium text-[0.8rem] text-center",
          row: "flex w-full mt-1",
          cell: "h-10 w-10 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
          // day buttons
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-10 w-10 p-0 font-medium rounded-full aria-selected:opacity-100",
          ),
          // the fill color is enforced via globals.css overrides to avoid blue rings
          day_selected: "rounded-full text-white",
          day_today: "border border-gray-300 rounded-full",
          day_outside: "text-muted-foreground opacity-50",
          day_disabled: "text-gray-400 bg-gray-100/70 opacity-70 cursor-not-allowed rounded-full",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
        }}
        components={{
          IconLeft: () => <ChevronLeft className="h-4 w-4" />,
          IconRight: () => <ChevronRight className="h-4 w-4" />,
        }}
      />
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-600">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-fitnest-green" /> Selected
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-gray-200" /> Unavailable
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-gray-100 border" /> Today
        </span>
      </div>
    </div>
  )
}
