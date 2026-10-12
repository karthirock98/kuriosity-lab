export type GenderizeResponse = {
  count: number
  name: string
  gender: string
  probability: number
}


export type QuoteOfTheDayResponse = {
  author: {
    id: string
    imageUrl: string
    name: string
    slug: string
  }
  id: string
  text: string
}
