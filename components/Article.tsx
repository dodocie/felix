import { notFound } from 'next/navigation'
import { Blog, Essay } from 'contentlayer/generated'
import BackToTop from './BackToTop'
import MDX from '@/components/MDX'
import Title from '@/components/Title'
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
    <div className={`flex justify-between relative w-11/12 m-auto`}>
      <section className={style.article}>
        <Title blog={blog} />
        <article className='px-4 prose max-w-none'>
          <MDX code={blog.body.code} />
        </article>
        <Footer />
        <BackToTop />
      </section>
      <Directory html={blog.body.raw} />
    </div>
  )
}
