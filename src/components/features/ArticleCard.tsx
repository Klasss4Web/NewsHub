import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/common'
import { formatDate, truncate } from '@/utils'
import type { Article } from '@/types'

interface ArticleCardProps {
  article: Article
}

export const ArticleCard = memo(({ article }: ArticleCardProps) => {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 ease-spring hover:-translate-y-1.5 hover:shadow-lg focus-within:shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <Link
        to={`/article/${encodeURIComponent(article.id)}`}
        state={{ article }}
        className="block overflow-hidden"
        aria-label={`Read article: ${article.title}`}
      >
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt=""
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
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge text={article.source} />
          {article.category && <Badge text={article.category} />}
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
          <p className="mb-4 flex-1 text-sm text-gray-600 dark:text-gray-300">
            {truncate(article.description, 140)}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
          {article.author && <span>By {article.author}</span>}
          <time dateTime={article.publishedAt.toISOString()}>
            {formatDate(article.publishedAt)}
          </time>
        </div>
      </div>
    </article>
  )
})

ArticleCard.displayName = 'ArticleCard'
