import { notFound } from 'next/navigation'
import { Blog, Essay } from 'contentlayer/generated'
import BackToTop from './BackToTop'
import MDX from '@/components/MDX'
import Footer from '@/components/Footer'

type Props = {
  params: { slug: string },
  articles: (Blog | Essay)[]
}


export default function Article({ params, articles }: Props) {
  const blog = articles.find((item) => item.slug === params.slug)

  if (!blog) {
    return notFound()
  }

  return (
    <>
      <div className="flex flex-col items-center px-2 pt-12 pb-8">
        <h1 className="font-medium text-2xl">{blog.title}</h1>
        <p className="mt-2 text-gray-500 text-sm">{blog.date}</p>
      </div>
      <article className="px-2 prose max-w-none">
        <MDX code={blog.body.code} />
      </article>
      <Footer slug={blog.slug} />
      <BackToTop />
    </>
  )
}