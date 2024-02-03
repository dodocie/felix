import { Metadata } from 'next'
import { compareDesc } from 'date-fns'
import Articles from '@/components/Articles'
import { allEssays } from 'contentlayer/generated'

export const metadata: Metadata = {
  title: `Kiera's Essay`,
}

export default async function Page() {
  const essayList = allEssays.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date)),
  )

  return <Articles blogList={essayList} type='essay' />
}
