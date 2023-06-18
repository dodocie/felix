'use client'
import { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import styles from '@/app/page.module.css'
import ArrowRight from '@/icons/ArrowRight'
import { ReadingContext } from '@/hooks/Context'
import { allBlogs, allEssays } from '@/.contentlayer/generated'

export default function ReadOnBanner() {
  const [slug, setSlug] = useState('')
  const { articleSlug } = useContext(ReadingContext) || {}

  useEffect(()=>{
    const t = localStorage.getItem('slug')
    setSlug(t || '')
  }, [])

  if (!articleSlug && !slug) return null

  const article = [...allBlogs, ...allEssays].find(v => v.slug === (articleSlug || slug))
  if (!article) return null

  return (
    <dl className={styles.suggest}>
      <dd className='w-2/3 text-slate-100'>
        <h5 className='truncate text-lg font-medium'>{article.title}</h5>
        <p className='truncate text-base font-medium'>{article.description}</p>
      </dd>
      <dt className='flex items-center text-slate-100'>
        <Link href={article.url}>
          <span className='text-sm font-medium'>继续阅读</span>
        </Link>
        <ArrowRight />
      </dt>
    </dl>
  )
}
