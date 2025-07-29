import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TimePickerProps {
  value: string; // HH:MM format
  onChange: (time: string) => void;
  minTime?: string;
  maxTime?: string;
  className?: string;
  disabled?: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  minTime,
  maxTime,
  className,
  disabled = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Basic validation for HH:MM format
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <input
      type="time"
      value={value}
      onChange={handleChange}
      min={minTime}
      max={maxTime}
      disabled={disabled}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    />
  );
};

export default TimePicker;