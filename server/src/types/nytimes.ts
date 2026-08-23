export interface NyTimesMultimediaItem {
  url: string
  subtype?: string
}

export interface NyTimesMultimediaObject {
  caption?: string
  credit?: string
  default?: { url: string; height?: number; width?: number }
  thumbnail?: { url: string; height?: number; width?: number }
}

export interface NyTimesResponse {
  status: string
  response: {
    docs: Array<{
      _id: string
      abstract: string
      web_url: string
      snippet: string
      lead_paragraph: string
      source: string
      multimedia: NyTimesMultimediaItem[] | NyTimesMultimediaObject
      headline: {
        main: string
      }
      byline: {
        original: string | null
        person: Array<{ firstname: string; lastname: string }>
      }
      pub_date: string
      news_desk: string
      section_name: string
    }>
    metadata: {
      hits: number
      offset: number
      time: number
    }
  }
}
