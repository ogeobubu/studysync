import * as React from "react";
import { cn } from "../../lib/utils";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, onCheckedChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(e.target.checked);
      }
    };

    return (
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id={id}
          className={cn(
            "h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary",
            className
          )}
          ref={ref}
          onChange={handleChange}
          {...props}
        />
        {label && (
          <label htmlFor={id} className="text-sm font-medium leading-none">
            {label}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
