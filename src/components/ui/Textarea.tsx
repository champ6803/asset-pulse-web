import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, showCount, className, maxLength, value, ...props }, ref) => {
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          value={value}
          maxLength={maxLength}
          className={cn(
            'block w-full px-4 py-3 border rounded-lg transition-colors resize-none',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            error ? 'border-red-500' : 'border-gray-300',
            className
          )}
          {...props}
        />
        <div className="flex justify-between items-center mt-2">
          {error && <p className="text-sm text-red-600">{error}</p>}
          {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
          {showCount && maxLength && (
            <span className={cn(
              'text-sm ml-auto',
              currentLength > maxLength * 0.9 ? 'text-red-500' : 'text-gray-500'
            )}>
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;

