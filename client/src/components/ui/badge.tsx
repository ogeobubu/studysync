import { cn } from "../../lib/utils"
import { HTMLAttributes, forwardRef } from "react"

type BadgeVariant = 
  | "default"
  | "secondary"
  | "destructive"
  | "success"
  | "warning"
  | "info"
  | "outline"

type BadgeSize = "sm" | "md" | "lg"

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant
  size?: BadgeSize
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const variantClasses = {
      default: "bg-primary border-transparent text-primary-foreground",
      secondary: "bg-secondary border-transparent text-secondary-foreground",
      destructive: "bg-destructive border-transparent text-destructive-foreground",
      success: "bg-green-100 border-transparent text-green-800",
      warning: "bg-yellow-100 border-transparent text-yellow-800",
      info: "bg-blue-100 border-transparent text-blue-800",
      outline: "border border-border text-foreground",
    }

    const sizeClasses = {
      sm: "text-xs px-2 py-0.5",
      md: "text-sm px-2.5 py-0.5",
      lg: "text-base px-3 py-1",
    }

    return (
      <div
        className={cn(
          "inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Badge.displayName = "Badge"

export { Badge }
export type { BadgeVariant, BadgeSize }