import { Metadata } from 'next'
import { Lato } from 'next/font/google'
import { compareDesc } from 'date-fns'
import Articles from '@/components/Articles'
import { allEssays } from 'contentlayer/generated'

const font = Lato({
  weight: '700',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: `Kiera's Essay`,
}

export default async function Page() {
  const essayList = allEssays.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date)),
  )

  return <Articles blogList={essayList} type='essay' />
}
