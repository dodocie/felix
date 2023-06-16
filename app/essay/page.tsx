import { Metadata } from 'next'
import { Lato } from 'next/font/google'
import { compareDesc } from 'date-fns'
import List from '@/components/List'
import { allEssays } from 'contentlayer/generated'

const font = Lato({
  weight: '700',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: `Kiera's Essay`,
}

export default async function Page() {
  const essayList = allEssays.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  return (
    <>
      <div className="pt-10 pb-6 px-3">
        
      </div>
      <List data={essayList} />
    </>
  )
}
