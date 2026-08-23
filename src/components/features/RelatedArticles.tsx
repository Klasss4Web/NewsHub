import { Link } from 'react-router-dom'
import { Badge, Tooltip } from '@/components/common'
import { useRelatedArticles } from '@/hooks'
import { formatDate, truncate } from '@/utils'
import type { Article } from '@/types'

interface RelatedArticlesProps {
  article: Article
  variant?: 'inline' | 'sidebar'
}

export const RelatedArticles = ({
  article,
  variant = 'inline',
}: RelatedArticlesProps) => {
  const { related, loading, error } = useRelatedArticles(article)

  if (!loading && related.length === 0 && !error) {
    return null
  }

  const isSidebar = variant === 'sidebar'

  return (
    <section
      className={[
        isSidebar
          ? 'rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800'
          : 'mt-10 border-t border-gray-200 pt-8 dark:border-gray-700',
      ].join(' ')}
    >
      <h2
        className={[
          'font-bold text-gray-900 dark:text-white',
          isSidebar ? 'text-lg' : 'text-xl sm:text-2xl',
        ].join(' ')}
      >
        Related Articles
      </h2>

      {loading && (
        <div
          className={[
            'grid grid-cols-1 gap-4',
            isSidebar ? 'mt-3' : 'mt-4 sm:grid-cols-2',
          ].join(' ')}
        >
          {Array.from({ length: isSidebar ? 3 : 2 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
            />
          ))}
        </div>
      )}

      {error && !loading && (
        <p
          className={[
            'text-sm text-red-600 dark:text-red-400',
            isSidebar ? 'mt-3' : 'mt-4',
          ].join(' ')}
        >
          {error}
        </p>
      )}

      {!loading && related.length > 0 && (
        <ul
          className={[
            'grid grid-cols-1 gap-4',
            isSidebar ? 'mt-3' : 'mt-4 sm:grid-cols-2',
          ].join(' ')}
        >
          {related.map((relatedArticle) => (
            <li key={relatedArticle.id} className="flex">
              <Link
                to={`/article/${encodeURIComponent(relatedArticle.id)}`}
                state={{ article: relatedArticle }}
                className="group flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-500/50"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge text={relatedArticle.source} />
                  {relatedArticle.category && (
                    <Badge text={relatedArticle.category} />
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                    {relatedArticle.title}
                  </h3>
                  {relatedArticle.description && (
                    <Tooltip content={relatedArticle.description}>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {truncate(relatedArticle.description, 100)}
                      </p>
                    </Tooltip>
                  )}
                </div>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <time
                    dateTime={relatedArticle.publishedAt.toISOString()}
                    className="text-xs text-gray-500 dark:text-gray-400"
                  >
                    {formatDate(relatedArticle.publishedAt)}
                  </time>
                  {relatedArticle.imageUrl ? (
                    <img
                      src={relatedArticle.imageUrl}
                      alt=""
                      loading="lazy"
                      className="h-12 w-12 flex-shrink-0 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700">
                      <svg
                        className="h-5 w-5 text-gray-300 dark:text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
