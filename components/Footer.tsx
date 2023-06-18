'use client'
import { useContext, useEffect, useRef } from 'react'
import { Divider } from '@mantine/core'
import { ReadingContext } from '@/hooks/Context'
import { observeIntersection } from '@/utils/intersection'

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null)
  const {titleHandler} = useContext(ReadingContext) || {}
  const update = () => {
    titleHandler?.('')
    localStorage.removeItem('slug')
  }

  useEffect(() => {
    observeIntersection({ref: footerRef, update})
  }, [])

  return (
      <Divider ref={footerRef} my="xs" label="到底啦" labelPosition="center" />
  )
}

