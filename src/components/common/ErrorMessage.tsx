import { Button } from './Button'

interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
}

export const ErrorMessage = ({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorMessageProps) => {
  return (
    <div
      className="animate-fade-in rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-900/20"
      role="alert"
    >
      <svg
        className="mx-auto h-10 w-10 text-red-500 mb-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">{title}</h3>
      <p className="mt-1 text-sm text-red-700 dark:text-red-300">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <Button onClick={onRetry} variant="danger">
            Try Again
          </Button>
        </div>
      )}
    </div>
  )
}
