import { forwardRef, type InputHTMLAttributes } from 'react'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${label}`

    return (
      <label
        htmlFor={checkboxId}
        className={[
          'flex items-center gap-2 cursor-pointer select-none',
          className,
        ].join(' ')}
      >
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-primary-500"
          {...props}
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'
