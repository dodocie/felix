'use client'
import { useContext, useEffect, useRef } from 'react'
import { Divider } from '@mantine/core'
import { ReadingContext } from '@/hooks/Context'
import { useIntersectionObserver } from '@/hooks/IntersectionObserver'

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null)
  const {titleHandler} = useContext(ReadingContext) || {}
  const update = () => {
    titleHandler?.('')
    localStorage.removeItem('slug')
  }

  useEffect(() => {
    useIntersectionObserver({ref: footerRef, update})
  }, [])

  return (
      <Divider ref={footerRef} my="xs" label="到底啦" labelPosition="center" />
  )
}

