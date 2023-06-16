import { createContext } from 'react'

type Context = {
  articleSlug: string
  titleHandler: (val: string) => void
}
export const ReadingContext = createContext<null | Context>(null)