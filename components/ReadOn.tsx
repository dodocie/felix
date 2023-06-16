'use client'
import { useContext } from 'react'
import Link from 'next/link'
import styles from '@/app/page.module.css'
import ArrowRight from '@/icons/ArrowRight'
import { ReadingContext } from '@/hooks/Context'
import { allBlogs, allEssays } from '@/.contentlayer/generated'

export default function ReadOnBanner() {
  const { articleSlug } = useContext(ReadingContext) || {}
  if (!articleSlug) return null

  const article = [...allBlogs, ...allEssays].find(v => v.slug === articleSlug)
  if (!article) return null

  return (
    <dl className={styles.suggest}>
      <dd className='w-2/3 text-slate-100'>
        <h5 className='truncate text-lg font-medium'>{article.title}</h5>
        <p className='truncate'>{article.description}</p>
      </dd>
      <dt className='flex items-center text-slate-100'>
        <Link href={article.url}>
          <span className='text-sm font-medium'>继续阅读</span>
          <ArrowRight />
        </Link>
      </dt>
    </dl>
  )
}
