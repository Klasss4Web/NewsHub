import { forwardRef, type InputHTMLAttributes } from 'react'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  description?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className = '', id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${label}`

    return (
      <label
        htmlFor={checkboxId}
        className={[
          'group relative flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-all duration-200 ease-spring',
          'hover:border-primary-300 hover:shadow-sm',
          'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-500 has-[:focus-visible]:ring-offset-2',
          'dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-500/50 dark:has-[:focus-visible]:ring-offset-gray-900',
          props.checked || props.defaultChecked
            ? 'border-primary-500 bg-primary-50/60 dark:border-primary-500 dark:bg-primary-900/20'
            : '',
          className,
        ].join(' ')}
      >
        <div className="relative mt-0.5 flex-shrink-0">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className="peer sr-only"
            {...props}
          />
          <span
            className={[
              'flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all duration-200',
              'border-gray-300 bg-white group-hover:border-primary-400',
              'peer-checked:border-primary-600 peer-checked:bg-primary-600',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2',
              'dark:border-gray-600 dark:bg-gray-700 dark:group-hover:border-primary-500',
              'dark:peer-checked:border-primary-500 dark:peer-checked:bg-primary-500',
            ].join(' ')}
          >
            <svg
              className={[
                'h-3 w-3 transform text-white transition-all duration-200',
                props.checked || props.defaultChecked
                  ? 'scale-100 opacity-100'
                  : 'scale-0 opacity-0',
              ].join(' ')}
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </span>
        </div>

        <div className="flex flex-col">
          <span
            className={[
              'text-sm font-medium transition-colors duration-200',
              'text-gray-700 group-hover:text-gray-900',
              'dark:text-gray-200 dark:group-hover:text-white',
              props.checked || props.defaultChecked
                ? 'text-primary-900 dark:text-primary-100'
                : '',
            ].join(' ')}
          >
            {label}
          </span>
          {description && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {description}
            </span>
          )}
        </div>
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'
