"use client"

import "react-day-picker/dist/style.css"
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
        disabled={[{ before: todayStart }, { after: allowedEnd }]}
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
          head_cell:
            "text-muted-foreground rounded-md w-10 font-medium text-[0.8rem] text-center select-none tabular-nums",
          row: "flex w-full mt-1",

          // cells (td)
          cell: "h-10 w-10 text-center text-sm p-0 relative",

          // day button (actual clickable element) — no buttonVariants here
          day_button:
            "h-10 w-10 p-0 rounded-full font-medium cursor-pointer " +
            "focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 border-0",

          // additional states (keep simple)
          day_outside: "text-muted-foreground opacity-40",
          day_disabled: "opacity-60 cursor-not-allowed",
          day_hidden: "invisible",
        }}
        components={{
          IconLeft: () => <ChevronLeft className="h-4 w-4" />,
          IconRight: () => <ChevronRight className="h-4 w-4" />,
        }}
        // Extra safety: inline styles to ensure no browser/UA rings and solid green selection
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
            border: "1px solid #d1d5db",
            borderRadius: 9999,
          },
          day_disabled: {
            color: "#9ca3af",
            backgroundColor: "#f3f4f6",
            borderRadius: 9999,
          },
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
