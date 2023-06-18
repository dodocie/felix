'use client'
import { useContext, useEffect, useRef } from 'react'
import { Divider } from '@mantine/core'
import { ReadingContext } from '@/hooks/Context'

export default function Footer({slug}:  {slug: string}) {
  const footerRef = useRef<HTMLDivElement>(null)
  const {titleHandler} = useContext(ReadingContext) || {}
  const update = () => {
    titleHandler?.(slug)
    localStorage.setItem('slug', slug)
  }

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    }

    function handleIntersect(entries: IntersectionObserverEntry[]) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log('页脚进入可视区')
          update()
        } else {
          console.log('页脚离开可视区')
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, options)

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current)
      }
    }
  }, [])

  return (
      <Divider ref={footerRef} my="xs" label="到底啦" labelPosition="center" />
  )
}

