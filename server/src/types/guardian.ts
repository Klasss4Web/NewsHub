export interface GuardianResponse {
  response: {
    status: string
    total: number
    pages: number
    currentPage: number
    results: Array<{
      id: string
      type: string
      sectionId: string
      sectionName: string
      webPublicationDate: string
      webTitle: string
      webUrl: string
      fields?: {
        trailText?: string
        thumbnail?: string
        byline?: string
      }
    }>
  }
}
