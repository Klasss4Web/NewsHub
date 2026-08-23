import { Link } from 'react-router-dom'

import type { Article } from '@/types'
import { formatDate, truncate } from '@/utils'
import { Badge, Tooltip } from '@/components/common'
import { usePreferences } from '@/stores/preferenceStore'

interface ArticleCardProps {
  article: Article
  category?: string
}

export const ArticleCard = ({ article, category }: ArticleCardProps) => {
  const { toggleAuthor, isPreferredAuthor } = usePreferences()
  const isPreferred = isPreferredAuthor(article.author)

  const handleToggleAuthor = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (article.author) {
      toggleAuthor(article.author)
    }
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 ease-spring hover:-translate-y-1.5 hover:shadow-lg focus-within:shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <Link
        to={`/article/${encodeURIComponent(article.id)}`}
        state={{ article }}
        className="block overflow-hidden bg-gray-100 dark:bg-gray-700"
        aria-label={`Read article: ${article.title}`}
      >
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            loading="lazy"
            className="h-44 w-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
          />
        ) : (
          <div className="flex h-44 w-full items-center justify-center bg-gray-100 dark:bg-gray-700">
            <svg
              className="h-12 w-12 text-gray-300 dark:text-gray-500"
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
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2 capitalize">
          <Badge text={article.source} />
          {(article.category || category) && (
            <Badge text={article.category || (category as string)} />
          )}
        </div>

        <h2 className="mb-2 text-lg font-semibold leading-snug text-gray-900 dark:text-white">
          <Link
            to={`/article/${encodeURIComponent(article.id)}`}
            state={{ article }}
            className="hover:text-primary-600 focus:outline-none focus-visible:underline dark:hover:text-primary-400"
          >
            {article.title}
          </Link>
        </h2>

        {article.description && (
          <Tooltip content={article.description}>
            <p className="mb-4 flex-1 text-sm text-gray-600 dark:text-gray-300">
              {truncate(article.description, 140)}
            </p>
          </Tooltip>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
          {article.author && (
            <div className="flex items-center gap-1.5">
              <span>By {article.author}</span>
              <button
                type="button"
                onClick={handleToggleAuthor}
                aria-pressed={isPreferred}
                aria-label={
                  isPreferred
                    ? `Remove ${article.author} from preferred authors`
                    : `Add ${article.author} to preferred authors`
                }
                className={[
                  'rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800',
                  isPreferred
                    ? 'text-yellow-500 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20'
                    : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300',
                ].join(' ')}
              >
                <svg
                  className="h-4 w-4"
                  fill={isPreferred ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </button>
            </div>
          )}
          <time dateTime={article.publishedAt.toISOString()}>
            {formatDate(article.publishedAt)}
          </time>
        </div>
      </div>
    </article>
  )
}
