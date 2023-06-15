import { Metadata } from 'next'
import { compareDesc } from 'date-fns'
import List from '@/components/List'
import { allBlogs } from 'contentlayer/generated'

export const metadata: Metadata = {
  title: `Kiera's Blog`,
}

export default async function Page() {
  const blogList = allBlogs.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  return (
    <>
      <List data={blogList} />
    </>
  )
}
