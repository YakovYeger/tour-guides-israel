import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col",
        month: "space-y-4",
        month_caption: "flex justify-center relative items-center h-9",
        caption_label: "text-sm font-medium",
        nav: "flex items-center justify-between absolute inset-x-1 top-1/2 -translate-y-1/2",
        button_previous: "h-7 w-7 bg-transparent p-0 hover:opacity-100 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100",
        button_next: "h-7 w-7 bg-transparent p-0 hover:opacity-100 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "text-gray-500 w-9 font-normal text-[0.8rem] text-center",
        week: "flex w-full mt-1",
        day: "h-9 w-9 text-center text-sm p-0",
        day_button: "h-9 w-9 p-0 font-normal inline-flex items-center justify-center rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent",
        selected: "!bg-primary !text-white hover:!bg-primary",
        today: "bg-gray-100 text-gray-900",
        outside: "text-gray-400 opacity-50",
        disabled: "text-gray-300",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left"
            ? <ChevronLeft className="h-4 w-4" />
            : <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

