import {
  SkeletonCard,
  ErrorMessage,
  EmptyState,
  Button,
  ScrollReveal,
} from '@/components/common'
import type { Article } from '@/types'
import { useInfiniteScroll } from '@/hooks'
import { ArticleCard } from './ArticleCard'

interface ArticleListProps {
  articles: Article[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  hasMore: boolean
  category?: string
  onLoadMore: () => void
  onRetry: () => void
  emptyState?: {
    title: string
    description: string
  }
}

export const ArticleList = ({
  articles,
  loading,
  loadingMore,
  error,
  hasMore,
  onLoadMore,
  onRetry,
  category,
  emptyState,
}: ArticleListProps) => {
  const sentinelCallbackRef = useInfiniteScroll<HTMLDivElement>({
    onLoadMore,
    hasMore,
    isLoading: loadingMore,
  })

  if (loading && articles.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  if (error && articles.length === 0) {
    return <ErrorMessage message={error} onRetry={onRetry} />
  }

  if (!loading && articles.length === 0) {
    return (
      <EmptyState
        title={emptyState?.title || 'No articles found'}
        description={
          emptyState?.description ||
          "Try adjusting your search or filters to find what you're looking for."
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(articles) &&
          articles.map((article, index) => (
            <ScrollReveal
              key={article.id}
              animation="slide-up"
              delay={(index % 6) * 75}
            >
              <ArticleCard article={article} category={category} />
            </ScrollReveal>
          ))}
      </div>

      {loadingMore && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={`loading-more-${index}`} />
          ))}
        </div>
      )}

      {error && articles.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center dark:border-red-900/50 dark:bg-red-900/20">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          <Button onClick={onRetry} variant="ghost" size="sm" className="mt-2">
            Retry
          </Button>
        </div>
      )}

      {hasMore && articles.length > 0 && (
        <div ref={sentinelCallbackRef} className="h-4" aria-hidden="true" />
      )}

      {!hasMore && articles.length > 0 && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          You've reached the end of the feed.
        </p>
      )}
    </div>
  )
}
