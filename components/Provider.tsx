'use client'
 
import { ReactNode, useState } from 'react'
import { ReadingContext } from '@/hooks/Context'
 
 
export default function ReadingProvider({ children }: {children: ReactNode}) {
  const [articleSlug, setArticleSlug] = useState('')

  const handleValueChange = (currTitle: string) => {
    setArticleSlug(currTitle)
  }
  return <ReadingContext.Provider value={{articleSlug, titleHandler: handleValueChange}}>{children}</ReadingContext.Provider>
}