'use client'
import { useWindowScroll } from '@mantine/hooks'
import { Affix, Transition, rem } from '@mantine/core'
import ToTop from '@/icons/ToTop'

export default function BackToTop() {
  const [scroll, scrollTo] = useWindowScroll()

  return (
    <Affix position={{ bottom: rem(20), right: rem(20) }} className='rounded-full bg-teal-600/[.26] px-2.5 py-2.5'>
      <Transition transition='slide-up' mounted={scroll.y > 0}>
        {transitionStyles => <ToTop scrollHandler={scrollTo} style={transitionStyles} />}
      </Transition>
    </Affix>
  )
}
