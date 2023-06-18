'use client'
import { useContext, useEffect, useRef } from 'react'
import { ReadingContext } from '@/hooks/Context'
import { Blog, Essay } from 'contentlayer/generated'
import { observeIntersection } from '@/utils/intersection'

export default function Title({ blog }: { blog: Blog | Essay }) {
  const titleRef = useRef<HTMLDivElement>(null)
  const { titleHandler } = useContext(ReadingContext) || {}
  const update = () => {
    titleHandler?.(blog.slug)
    localStorage.setItem('slug', blog.slug)
  }

  useEffect(() => {
    observeIntersection({ref: titleRef, update})
  }, [])

  return (
    <div ref={titleRef} className='flex flex-col items-center text-slate-700 px-4 pt-16 pb-8'>
      <h1 className='font-medium text-2xl'>{blog.title}</h1>
      <h2 className='font-medium text-lg'>{blog.subtitle}</h2>
      <p className='mt-2 text-gray-500 text-sm'>{blog.date}</p>
    </div>
  )
}
