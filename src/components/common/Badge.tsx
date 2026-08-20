import { getColourClass } from '@/utils'

interface BadgeProps {
  text: string
  className?: string
}

export const Badge = ({ text, className = '' }: BadgeProps) => {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        getColourClass(text),
        className,
      ].join(' ')}
    >
      {text}
    </span>
  )
}
