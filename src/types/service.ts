export interface ServiceSection {
  type: 'h2' | 'h3' | 'paragraph' | 'bulletList' | 'cta'
  content: string | string[]
}

export interface ServiceMeta {
  title: string
  description: string
  keywords: string
}

export interface Service {
  slug: string
  title: string
  headline: string
  cardSummary: string
  image: string
  imageAlt: string
  icon: string
  contentReady: boolean
  fullContent?: ServiceSection[]
  meta: ServiceMeta
}
