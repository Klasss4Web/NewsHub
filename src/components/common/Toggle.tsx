interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export const Toggle = ({ checked, onChange, label }: ToggleProps) => {
  return (
    <label className="flex items-center justify-between cursor-pointer select-none">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
          checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700',
        ].join(' ')}
      >
        <span
          className={[
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1',
          ].join(' ')}
        />
      </button>
    </label>
  )
}
