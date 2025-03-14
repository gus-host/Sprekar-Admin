import * as React from 'react';
import { cn } from '@/lib/utils'; // Ensure you have a utility function for classNames

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean | string;
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, onChange, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          `flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-primary focus:outline-none ${
            error ? '' : 'focus:ring-1 focus:ring-primary'
          }`,
          className
        )}
        onChange={onChange}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
