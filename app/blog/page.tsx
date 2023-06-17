import { Metadata } from 'next'
import { compareDesc } from 'date-fns'
import { allBlogs } from 'contentlayer/generated'
import Articles from '@/components/Articles'

export const metadata: Metadata = {
  title: `Kiera's Blog`,
}

export default async function Page() {
  const blogList = allBlogs.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date)),
  )

  return <Articles blogList={blogList} type='blog' />
}
