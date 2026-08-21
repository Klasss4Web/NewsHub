import { useEffect } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { Button, Badge } from '@/components/common'
import { formatDate } from '@/utils'
import type { Article } from '@/types'

const getArticleFromStorage = (id: string): Article | null => {
  try {
    const raw = sessionStorage.getItem(`article-${id}`)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Article
    parsed.publishedAt = new Date(parsed.publishedAt)
    return parsed
  } catch {
    return null
  }
}

const setArticleInStorage = (id: string, article: Article) => {
  try {
    sessionStorage.setItem(`article-${id}`, JSON.stringify(article))
  } catch {
    // Ignore storage errors
  }
}

export const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  const locationArticle = location.state?.article as Article | undefined
  const storedArticle = id ? getArticleFromStorage(id) : null
  const article = locationArticle || storedArticle

  useEffect(() => {
    if (article && id) {
      setArticleInStorage(id, article)
    }
  }, [article, id])

  if (!article) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Article not found</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          The article you're looking for isn't available. It may have expired or
          been removed.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <article className="animate-slide-up mx-auto max-w-3xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      {article.imageUrl && (
        <div className="bg-gray-100 dark:bg-gray-700">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-64 w-full object-cover sm:h-80"
          />
        </div>
      )}

      <div className="p-6 sm:p-10">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge text={article.source} />
          {article.category && <Badge text={article.category} />}
        </div>

        <h1 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl">
          {article.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          {article.author && <span>By {article.author}</span>}
          <time dateTime={article.publishedAt.toISOString()}>
            {formatDate(article.publishedAt)}
          </time>
        </div>

        {article.description && (
          <p className="mt-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            {article.description}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read Full Story
            </a>
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    </article>
  )
}
