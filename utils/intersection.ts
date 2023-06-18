import { RefObject } from "react"

interface Props {
  ref: RefObject<HTMLDivElement>
  update: () => void
}

export function observeIntersection({ref, update}: Props){
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  }

  
  function handleIntersect(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        update()
      }
    })
  }

  const observer = new IntersectionObserver(handleIntersect, options)

  if (ref.current) {
    observer.observe(ref.current)
  }

  return () => {
    if (ref.current) {
      observer.unobserve(ref.current)
    }
  }
}