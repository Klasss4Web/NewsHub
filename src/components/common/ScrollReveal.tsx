import { useInView } from '@/hooks'
import type { ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  animation?: 'fade-in' | 'slide-up' | 'slide-in-right'
  delay?: number
}

export const ScrollReveal = ({
  children,
  className = '',
  animation = 'slide-up',
  delay = 0,
}: ScrollRevealProps) => {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 })

  const animationClass = isInView ? `animate-${animation}` : 'opacity-0'

  return (
    <div
      ref={ref}
      className={[`${animationClass} transition-opacity`, className].join(' ')}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
