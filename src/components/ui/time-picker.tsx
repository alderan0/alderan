
import React from 'react';
import { Input } from "@/components/ui/input";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const TimePickerDemo = ({ value, onChange, disabled }: TimePickerProps) => {
  return (
    <Input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  );
};
