import type { AdapterResult, Article, ArticleFilter } from '@/types'

const MOCK_ARTICLES: Article[] = [
  // Guardian samples
  {
    id: 'guardian-sport-live-2026-aug-20',
    title: 'England v Pakistan: first men’s Test, day two – live updates',
    description:
      'Over-by-over report: Join our writers for day two of England’s first Test against Pakistan, as the hosts aim to build on a strong start at Headingley',
    url: 'https://www.theguardian.com/sport/live/2026/aug/20/england-v-pakistan-first-test-day-two-live',
    imageUrl:
      'https://media.guim.co.uk/145c1de32711a1a159bdb9a4496a3dcb7b7b590c/839_0_4913_3930/500.jpg',
    source: 'The Guardian',
    sourceId: 'guardian',
    author: 'James Wallace at Headingley (earlier) and Tim de Lisle (now)',
    category: 'sport',
    publishedAt: new Date('2026-08-20T15:22:11Z'),
  },
  {
    id: 'guardian-business-2026-aug-20',
    title: '‘Starve the beast’? The $40tn cost of Republicans’ false promises to cut spending',
    description:
      'The enormous US debt under Trump will hobble the next Democratic administration – just as the GOP planned',
    url: 'https://www.theguardian.com/business/2026/aug/20/us-national-debt-republicans',
    imageUrl:
      'https://media.guim.co.uk/a616a971f8174c956a240adf080e40f025b22a3b/685_0_6847_5477/500.jpg',
    source: 'The Guardian',
    sourceId: 'guardian',
    author: 'Eduardo Porter',
    category: 'business',
    publishedAt: new Date('2026-08-20T15:21:38Z'),
  },
  {
    id: 'guardian-us-news-live-2026-aug-20',
    title: 'White House faces scrutiny over top Trump aide Natalie Harp – live',
    description:
      'Harp, a former One America News Network show host, has emerged as a key gatekeeper to the president',
    url: 'https://www.theguardian.com/us-news/live/2026/aug/20/donald-trump-national-debt-borrowing-record-michael-cohen-canada-iran-latest-news-updates',
    imageUrl:
      'https://media.guim.co.uk/ec78ebcda8b0738035dcb14328438c1fab93d3f8/223_0_4073_3260/500.jpg',
    source: 'The Guardian',
    sourceId: 'guardian',
    author: 'George Chidi (now) and Vivian Ho (earlier)',
    category: 'us-news',
    publishedAt: new Date('2026-08-20T15:12:07Z'),
  },
  {
    id: 'guardian-politics-live-2026-aug-20',
    title: 'Burnham says fly-tippers will be forced to pay for the clean-up when they dump waste illegally – UK politics live',
    description:
      'The prime minister plans to bring in the National Crime Agency to tackle the gangs behind dumps',
    url: 'https://www.theguardian.com/politics/live/2026/aug/20/andy-burnham-illegal-waste-dumps-labour-reform-conservatives-latest-news-updates',
    imageUrl:
      'https://media.guim.co.uk/4d10d26edc19776d319f958f2ba742ba7760a848/604_0_4410_3528/500.jpg',
    source: 'The Guardian',
    sourceId: 'guardian',
    author: 'Tom Ambrose (now) and Vivian Ho (earlier)',
    category: 'politics',
    publishedAt: new Date('2026-08-20T15:04:44Z'),
  },
  {
    id: 'guardian-technology-2026-aug-20',
    title: 'UK cinemas look at banning Meta smart glasses over piracy fears',
    description:
      'Trade body says local chains would have to balance concerns with potential benefits of AI-enabled technology',
    url: 'https://www.theguardian.com/technology/2026/aug/20/piracy-fears-prompt-calls-for-ban-on-meta-smart-glasses-in-uk-cinemas',
    imageUrl:
      'https://media.guim.co.uk/092980621b33770617e1cd5770cc6ae9ff39734f/121_0_4680_3744/500.jpg',
    source: 'The Guardian',
    sourceId: 'guardian',
    author: 'Kalyeena Makortoff',
    category: 'technology',
    publishedAt: new Date('2026-08-20T14:57:25Z'),
  },
  // NYT samples
  {
    id: 'nytimes-65c8c21b-0f89-5da8-8650-e2ce9d747c99',
    title: 'Today, In Short',
    description: '“House hang.” Data centers. And canned tuna.',
    url: 'https://www.nytimes.com/2026/08/20/briefing/today-in-short.html',
    imageUrl:
      'https://static01.nyt.com/images/2026/07/28/multimedia/20in-short-webmet-loneliness-cost-02-twkf-copy/met-loneliness-cost-02-twkf-articleLarge.jpg',
    source: 'The New York Times',
    sourceId: 'nytimes',
    author: 'Matt Yan',
    category: 'briefing',
    publishedAt: new Date('2026-08-20T15:00:13Z'),
  },
  {
    id: 'nytimes-247964cc-a3e8-574d-954d-813ecbe2c51e',
    title: 'State Dept. Declares U.S. Citizen in China Wrongfully Detained',
    description:
      'U Min Zin, a scholar who studied Myanmar, is one of two U.S. citizens the department has designated as wrongfully detained in China.',
    url: 'https://www.nytimes.com/2026/08/20/us/politics/scholar-china-wrongfully-detained.html',
    imageUrl:
      'https://static01.nyt.com/images/2026/08/20/multimedia/20dc-scholar-fjbl/20dc-scholar-fjbl-articleLarge.jpg',
    source: 'The New York Times',
    sourceId: 'nytimes',
    author: 'Karoun Demirjian',
    category: 'washington',
    publishedAt: new Date('2026-08-20T14:59:45Z'),
  },
  {
    id: 'nytimes-ee5125cd-3178-5987-a5a8-9719f6764eab',
    title: 'What to Know About Harry and Meghan’s Return to Britain',
    description:
      'The couple are moving back after six years in the United States. What they will do, and much else, are still unclear.',
    url: 'https://www.nytimes.com/2026/08/20/world/europe/prince-harry-meghan-uk-move-return.html',
    imageUrl:
      'https://static01.nyt.com/images/2026/08/20/multimedia/20int-harry-meghan-wtk-kcmv/20int-harry-meghan-wtk-kcmv-articleLarge.jpg',
    source: 'The New York Times',
    sourceId: 'nytimes',
    author: 'Amelia Nierenberg',
    category: 'foreign',
    publishedAt: new Date('2026-08-20T13:13:34Z'),
  },
  {
    id: 'nytimes-5e5ae737-a1be-5cb2-ac45-bd4660a0412f',
    title: 'How Moderna Nearly Tripled Its Stock Price in a Single Day',
    description:
      'The company’s fortunes cratered as demand for Covid-19 vaccines plummeted. But it was busy working on something else.',
    url: 'https://www.nytimes.com/2026/08/20/business/moderna-cancer-melanoma.html',
    imageUrl:
      'https://static01.nyt.com/images/2026/08/19/business/19biz-moderna-alt/19biz-moderna-alt-articleLarge.jpg',
    source: 'The New York Times',
    sourceId: 'nytimes',
    author: 'Rebecca Robbins',
    category: 'business',
    publishedAt: new Date('2026-08-20T09:04:12Z'),
  },
  // NewsAPI-style generic samples
  {
    id: 'newsapi-global-markets',
    title: 'Global Markets React to New Economic Policies',
    description:
      'Experts analyse the implications of recent policy changes on global financial markets and consumer behaviour.',
    url: 'https://example.com/global-markets',
    imageUrl: null,
    source: 'NewsAPI',
    sourceId: 'newsapi',
    author: 'Jane Smith',
    category: 'business',
    publishedAt: new Date('2026-08-20T08:00:00Z'),
  },
  {
    id: 'newsapi-renewable-energy',
    title: 'Breakthrough in Renewable Energy Technology',
    description:
      'Researchers announce a significant advancement that could accelerate clean energy adoption worldwide.',
    url: 'https://example.com/renewable-energy',
    imageUrl: null,
    source: 'NewsAPI',
    sourceId: 'newsapi',
    author: 'Michael Brown',
    category: 'science',
    publishedAt: new Date('2026-08-20T07:30:00Z'),
  },
  {
    id: 'newsapi-ai-healthcare',
    title: 'AI Revolution Transforms Healthcare Industry',
    description:
      'Machine learning models are being deployed in hospitals to improve diagnostics and patient outcomes.',
    url: 'https://example.com/ai-healthcare',
    imageUrl: null,
    source: 'NewsAPI',
    sourceId: 'newsapi',
    author: 'Emily Johnson',
    category: 'technology',
    publishedAt: new Date('2026-08-20T07:00:00Z'),
  },
]

const matchesFilter = (
  article: Article,
  filter: ArticleFilter,
  sourceId?: string
): boolean => {
  const keyword = filter.keyword.toLowerCase()
  const matchesKeyword =
    !keyword ||
    article.title.toLowerCase().includes(keyword) ||
    (article.description?.toLowerCase().includes(keyword) ?? false) ||
    (article.author?.toLowerCase().includes(keyword) ?? false)

  const matchesSource = !sourceId || article.sourceId === sourceId
  const matchesCategory =
    !filter.category || article.category === filter.category

  const matchesDateRange =
    (!filter.fromDate ||
      article.publishedAt.toISOString().slice(0, 10) >= filter.fromDate) &&
    (!filter.toDate ||
      article.publishedAt.toISOString().slice(0, 10) <= filter.toDate)

  return matchesKeyword && matchesSource && matchesCategory && matchesDateRange
}

const sortByDate = (articles: Article[]): Article[] =>
  [...articles].sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
  )

/**
 * Returns realistic mock data based on actual Guardian and NYTimes responses.
 * Useful for development without API keys and for avoiding rate limits.
 *
 * @param filter Search/filter criteria
 * @param page Page number (1-based)
 * @param pageSize Number of articles per page
 * @param sourceId Optional source ID to return only articles from that outlet
 */
export const fetchMockArticles = async (
  filter: ArticleFilter,
  page: number,
  pageSize: number,
  sourceId?: string
): Promise<AdapterResult> => {
  // Simulate network latency for realistic loading states
  await new Promise((resolve) => setTimeout(resolve, 300))

  const filtered = sortByDate(
    MOCK_ARTICLES.filter((a) => matchesFilter(a, filter, sourceId))
  )
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginated = filtered.slice(start, end)
  const hasMore = end < filtered.length

  return {
    articles: paginated,
    totalResults: filtered.length,
    currentPage: page,
    hasMore,
  }
}
