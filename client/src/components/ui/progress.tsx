import { cn } from "../../lib/utils"
import { HTMLAttributes, forwardRef } from "react"

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  variant?: "default" | "success" | "warning" | "danger"
  showLabel?: boolean
  labelPosition?: "inside" | "outside"
  size?: "sm" | "md" | "lg"
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = 0,
      max = 100,
      variant = "default",
      showLabel = true,
      labelPosition = "outside",
      size = "md",
      className,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))
    
    const variantClasses = {
      default: "bg-blue-500",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      danger: "bg-red-500",
    }

    const sizeClasses = {
      sm: "h-1.5",
      md: "h-2.5",
      lg: "h-3.5",
    }

    return (
      <div className={cn("space-y-1 w-full", className)} {...props} ref={ref}>
        {showLabel && labelPosition === "outside" && (
          <div className="flex justify-between text-sm text-gray-600">
            <span>{value}/{max}</span>
            <span>{Math.round(percentage)}%</span>
          </div>
        )}
        
        <div className={cn(
          "w-full bg-gray-200 rounded-full overflow-hidden",
          sizeClasses[size]
        )}>
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              variantClasses[variant]
            )}
            style={{ width: `${percentage}%` }}
          >
            {showLabel && labelPosition === "inside" && (
              <div className="flex items-center justify-center h-full">
                <span className="text-xs font-medium text-white px-2">
                  {Math.round(percentage)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)

Progress.displayName = "Progress"

export { Progress }