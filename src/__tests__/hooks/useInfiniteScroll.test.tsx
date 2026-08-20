import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, cleanup, act } from '@testing-library/react'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

const observers: IntersectionObserverMock[] = []

class IntersectionObserverMock {
  callback: (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void
  options?: IntersectionObserverInit
  targets = new Set<Element>()

  constructor(
    callback: (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void,
    options?: IntersectionObserverInit
  ) {
    this.callback = callback
    this.options = options
    observers.push(this)
  }

  observe(target: Element) {
    this.targets.add(target)
  }

  unobserve(target: Element) {
    this.targets.delete(target)
  }

  disconnect() {
    this.targets.clear()
    const index = observers.indexOf(this)
    if (index > -1) {
      observers.splice(index, 1)
    }
  }

  trigger(isIntersecting: boolean) {
    const entries = Array.from(this.targets).map((target) => ({
      isIntersecting,
      target,
      intersectionRatio: isIntersecting ? 1 : 0,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now(),
    })) as IntersectionObserverEntry[]

    this.callback(entries, this as unknown as IntersectionObserver)
  }
}

describe('useInfiniteScroll', () => {
  beforeEach(() => {
    observers.length = 0
    window.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver
  })

  afterEach(() => {
    cleanup()
    observers.length = 0
  })

  interface TestComponentProps {
    onLoadMore: () => void
    hasMore: boolean
    isLoading: boolean
    showSentinel?: boolean
  }

  const SentinelComponent = ({ onLoadMore, hasMore, isLoading }: TestComponentProps) => {
    const sentinelRef = useInfiniteScroll<HTMLDivElement>({
      onLoadMore,
      hasMore,
      isLoading,
    })
    return <div data-testid="sentinel" ref={sentinelRef} />
  }

  const ToggleSentinelComponent = ({ onLoadMore, hasMore, isLoading, showSentinel }: TestComponentProps) => {
    const sentinelRef = useInfiniteScroll<HTMLDivElement>({
      onLoadMore,
      hasMore,
      isLoading,
    })
    return showSentinel ? <div data-testid="sentinel" ref={sentinelRef} /> : <div />
  }

  it('does not attach an observer when no sentinel element is rendered', () => {
    render(<ToggleSentinelComponent onLoadMore={vi.fn()} hasMore isLoading={false} showSentinel={false} />)

    expect(observers.length).toBe(0)
  })

  it('attaches an observer once the sentinel element is mounted', () => {
    const { rerender } = render(
      <ToggleSentinelComponent onLoadMore={vi.fn()} hasMore isLoading={false} showSentinel={false} />
    )

    expect(observers.length).toBe(0)

    rerender(<ToggleSentinelComponent onLoadMore={vi.fn()} hasMore isLoading={false} showSentinel />)

    expect(observers.length).toBe(1)
    expect(observers[0].options?.rootMargin).toBe('200px')
  })

  it('calls onLoadMore when the sentinel enters the viewport', () => {
    const onLoadMore = vi.fn()
    render(<SentinelComponent onLoadMore={onLoadMore} hasMore isLoading={false} />)

    expect(observers.length).toBe(1)

    act(() => {
      observers[0].trigger(true)
    })

    expect(onLoadMore).toHaveBeenCalledTimes(1)
  })

  it('does not call onLoadMore while a page is already loading', () => {
    const onLoadMore = vi.fn()
    render(<SentinelComponent onLoadMore={onLoadMore} hasMore isLoading />)

    act(() => {
      observers[0].trigger(true)
    })

    expect(onLoadMore).not.toHaveBeenCalled()
  })

  it('does not call onLoadMore when there are no more pages', () => {
    const onLoadMore = vi.fn()
    render(<SentinelComponent onLoadMore={onLoadMore} hasMore={false} isLoading={false} />)

    expect(observers.length).toBe(0)
  })

  it('does not trigger multiple loads while the sentinel stays intersecting', () => {
    const onLoadMore = vi.fn()
    render(<SentinelComponent onLoadMore={onLoadMore} hasMore isLoading={false} />)

    act(() => {
      observers[0].trigger(true)
    })
    act(() => {
      observers[0].trigger(true)
    })
    act(() => {
      observers[0].trigger(true)
    })

    expect(onLoadMore).toHaveBeenCalledTimes(1)

    act(() => {
      observers[0].trigger(false)
    })
    act(() => {
      observers[0].trigger(true)
    })

    expect(onLoadMore).toHaveBeenCalledTimes(2)
  })

  it('disconnects the observer when the sentinel is unmounted', () => {
    const { unmount } = render(<SentinelComponent onLoadMore={vi.fn()} hasMore isLoading={false} />)

    expect(observers.length).toBe(1)

    unmount()

    expect(observers.length).toBe(0)
  })
})
