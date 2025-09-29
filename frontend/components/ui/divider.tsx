import { cn } from "@/lib/utils"

interface DividerProps {
  className?: string
  orientation?: "horizontal" | "vertical"
  decorative?: boolean
}

function Divider({ className, orientation = "horizontal", decorative = false }: DividerProps) {
  return (
    <div
      role={decorative ? "presentation" : "separator"}
      aria-orientation={orientation}
      className={cn(
        "shrink-0",
        orientation === "vertical" ? "size-px rotate-90" : "w-full",
        className
      )}
    />
  )
}

export { Divider }