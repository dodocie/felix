import { notFound } from 'next/navigation'
import { Blog, Essay } from 'contentlayer/generated'
import BackToTop from './BackToTop'
import MDX from '@/components/MDX'
import Footer from '@/components/Footer'
import Directory from '@/components/Directory'
import style from '@/app/page.module.css'

type Props = {
  params: { slug: string }
  articles: (Blog | Essay)[]
}

export default function Article({ params, articles }: Props) {
  const blog = articles.find((item) => item.slug === params.slug)

  if (!blog) {
    return notFound()
  }

  return (
    <div className={`flex justify-between w-11/12 m-auto`}>
      <section className={style.article}>
        <div className='flex flex-col items-center text-slate-700 px-4 pt-16 pb-8'>
          <h1 className='font-medium text-2xl'>{blog.title}</h1>
          <h2 className='font-medium text-lg'>{blog.subtitle}</h2>
          <p className='mt-2 text-gray-500 text-sm'>{blog.date}</p>
        </div>
        <article className='px-4 prose max-w-none'>
          <MDX code={blog.body.code} />
        </article>
        <Footer slug={blog.slug} />
        <BackToTop />
      </section>
      <Directory html={blog.body.raw} />
    </div>
  )
}
