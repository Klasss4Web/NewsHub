import { useEffect, useRef, useState, type RefCallback } from 'react'

interface UseInfiniteScrollOptions {
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
  rootMargin?: string
}

/**
 * Custom hook that triggers a callback when a sentinel element
 * enters the viewport. Used to implement infinite scroll.
 *
 * Best practices applied:
 * - Uses IntersectionObserver (no main-thread scroll listeners).
 * - Guards against duplicate triggers while a page is loading.
 * - Attaches the observer as soon as the sentinel DOM node is mounted,
 *   even if the sentinel is not rendered on the first paint.
 * - Disconnects the observer on cleanup to avoid memory leaks.
 */
export function useInfiniteScroll<T extends HTMLElement = HTMLDivElement>({
  onLoadMore,
  hasMore,
  isLoading,
  rootMargin = '200px',
}: UseInfiniteScrollOptions): RefCallback<T> {
  const callbackRef = useRef(onLoadMore)
  const isLoadingRef = useRef(isLoading)
  const hasMoreRef = useRef(hasMore)

  // Track the sentinel node in state so the effect re-runs when the node
  // is first mounted (e.g. after the initial skeleton loader is replaced).
  const [sentinel, setSentinel] = useState<T | null>(null)

  useEffect(() => {
    callbackRef.current = onLoadMore
  }, [onLoadMore])

  useEffect(() => {
    isLoadingRef.current = isLoading
  }, [isLoading])

  useEffect(() => {
    hasMoreRef.current = hasMore
  }, [hasMore])

  useEffect(() => {
    if (!sentinel || !hasMoreRef.current) return

    // Prevents calling onLoadMore multiple times while the sentinel stays
    // intersecting. Reset once the sentinel leaves the viewport so the next
    // scroll past the threshold can trigger another page.
    let triggered = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!isLoadingRef.current && hasMoreRef.current && !triggered) {
            triggered = true
            callbackRef.current()
          }
        } else {
          triggered = false
        }
      },
      { rootMargin, threshold: 0 }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [sentinel, rootMargin])

  return setSentinel
}
