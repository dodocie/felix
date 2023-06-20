'use client'

import { Transition, SegmentedControl, Button } from '@mantine/core'
import { useClickOutside } from '@mantine/hooks'
import { useEffect, useRef, useState } from 'react'
import MenuMore from '@/icons/MenuMore'

const modeCssVarientMap = {
  '--tw-prose-headings': ['#111827', '#94a3b8'],
  '--tw-prose-code': ['#4d7c0f', '#84cc16'],
  '--tw-prose-links': ['#111827', '#79a6e4'],
  '--tw-prose-quotes': ['#111827', '#747483'],
}

const changeMode = (isDark: boolean) => {
  const doc = document

  const colorIndex = isDark ? 1 : 0
  console.log('color index', colorIndex, isDark)
  Object.entries(modeCssVarientMap)
    .forEach(([key, colors])=>{
      doc.documentElement.style.setProperty(key, colors[colorIndex])
      doc.querySelector('.prose')?.style.setProperty(key, colors[colorIndex])
    })

  if (isDark) {
    doc.documentElement.classList.add('dark')

  } else {
    doc.documentElement.classList.remove('dark')
  }
}
const scaleY = {
  in: { opacity: 1, transform: 'scaleY(1)' },
  out: { opacity: 0, transform: 'scaleY(0)' },
  common: { transformOrigin: 'top' },
  transitionProperty: 'transform, opacity',
}

export default function SwitchMode() {
  const [opened, setOpened] = useState(false)
  const clickOutsideRef = useClickOutside(() => setOpened(false))

  const [colorMode, setMode] = useState('light')
  const isChanged = useRef('')

  const changeModeHandler = (e: MediaQueryListEvent) => {
    //系统变成模式时候，如果用户手动选择了，且值不等于system，就不操作。
    if (isChanged.current === 'light' || isChanged.current === 'dark') return
    changeMode(e.matches)
  }
  useEffect(() => {
    const isMatches = window.matchMedia('(prefers-color-scheme: dark)').matches
    const mode = isMatches ? 'dark' : 'light'
    setMode(mode)
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', changeModeHandler)

    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', changeModeHandler)
    }
  }, [])

  const onChangeMode = (val: string) => {
    setMode(val)
    isChanged.current = val
    const isDark =
      val === 'dark' ||
      (val === 'auto' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    changeMode(isDark)
  }

  return (
    <div className='fixed top-3 right-0 z-10'>
      <section className='relative w-full'>
        <Button variant='subtle' onClick={() => setOpened(true)}><MenuMore /></Button>
        <Transition
          mounted={opened}
          transition={scaleY}
          duration={200}
          timingFunction='ease'>
          {() => (
            <SegmentedControl
              ref={clickOutsideRef}
              className='absolute top-0 right-2'
              size='xs'
              value={colorMode}
              onChange={onChangeMode}
              radius={8}
              data={[
                {
                  value: 'light',
                  label: <IconSun />,
                },
                {
                  value: 'dark',
                  label: <IconMoonStars />,
                },
                {
                  value: 'auto',
                  label: <IconSystem />,
                },
              ]}
            />
          )}
        </Transition>
      </section>
    </div>
  )
}

function IconMoonStars() {
  return (
    <svg
      viewBox='0 0 1024 1024'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      p-id='3820'
      width='24'
      height='24'>
      <path
        d='M735.108 50.52c-0.148 0.56-0.134 1.114 0.04 1.66 0.16 0.524 0.71 0.936 1.42 1.06a512.6 512.6 0 0 1 94.76 26.84c7.06 2.74 14.38 9.08 8.4 16.6-1.68 2.12-5.208 4.3-10.58 6.54-151 62.96-251.7 199.32-271.12 360.88a0.94 0.94 0 0 1-1.12 0.82c-30.468-6.12-60.8-6.954-91-2.5-46.42 6.84-84.1 26.34-129.94 21.96-7.268-0.694-16.94-2.76-29.02-6.2-4.6-1.32-46.7-12.12-46.92-12.74 12.866-117.106 60.926-215.914 144.18-296.42 75.22-72.72 177.46-116.52 283.6-118.98 12.94-0.3 31.4 1.22 47.3 0.48z'
        fill='#C8DAE5'
        p-id='3821'></path>
      <path
        d='M722.608 972.86c1.546-0.054 2.686-0.54 3.42-1.46 0.444-0.56 0.996-0.896 1.5-0.92 34.84-2.28 71.48-13.9 103.86-26.62 16.8-6.6 13.14-17.32-1.2-23.28-116.8-48.64-206.6-142.58-249.3-261.7a1.35 1.35 0 0 0-1.36-0.88c-14.014 0.8-24.994 2.254-32.94 4.36-49.42 13.06-81.2 23.58-122.84 19.28-15.64-1.62-30.58-6.76-47.66-11.64-14.828-4.24-31.828-7.906-51-11-15.86-2.54-13.22-23.36 6.6-19.82a653.15 653.15 0 0 1 69.14 16.32c28.02 8.24 54.44 8.52 82.88 1.5 29.54-7.28 58.42-15.98 88.8-19.28a1.188 1.188 0 0 0 0.862-0.528 1.232 1.232 0 0 0 0.158-1.012 467.086 467.086 0 0 1-13.98-65 2.3 2.3 0 0 0-1.78-1.94c-20.44-4.44-42.94-7.56-63.02-5.84-34.26 2.98-63.48 20.68-93.24 29.42-14.7 4.32-21.62-13.94-5.76-19.66 22.532-8.134 36.62-13.38 42.26-15.74 40.4-16.96 75.54-15.7 118-9.62 0.24 0.032 0.48-0.05 0.654-0.22a0.832 0.832 0 0 0 0.246-0.66 487.788 487.788 0 0 1-0.8-58.92 1.34 1.34 0 0 0-0.92-1.32c-25.86-8.6-60.18-7.7-86.68-3.88-20.72 2.98-46.02 10.62-68.74 16.48-31.14 8-62.84 8.84-93.8-0.06-15.84-4.56-31.76-8.7-47.76-12.42-28.7-7.16-59.14-10.28-87.5-3.46-21.8 5.24-48.02 17.64-71.44 26.06-14.7 5.28-22.88-13.54-5.28-19.96 17.8-6.494 35.6-12.974 53.4-19.44 36.54-13.28 73.2-12.08 110.72-4.1 0.72 0.146 1.36-0.006 1.92-0.46 0.22 0.62 42.32 11.42 46.92 12.74 12.08 3.44 21.752 5.506 29.02 6.2 45.84 4.38 83.52-15.12 129.94-21.96 30.2-4.454 60.532-3.62 91 2.5a0.94 0.94 0 0 0 1.12-0.82c19.42-161.56 120.12-297.92 271.12-360.88 5.372-2.24 8.9-4.42 10.58-6.54 5.98-7.52-1.34-13.86-8.4-16.6a512.6 512.6 0 0 0-94.76-26.84c-0.71-0.124-1.26-0.536-1.42-1.06a2.93 2.93 0 0 1-0.04-1.66c51.3-2.92 104.26 10.74 151.72 29.34 13.96 5.46 15.12 16.36 0.76 22.32-156.6 64.84-261.94 208.52-274.94 377.86a1.52 1.52 0 0 0 1.1 1.58c27.026 7.84 54.486 11.686 82.38 11.54 3.12-0.014 5.252 1.786 6.4 5.4 3.22 10.12-2.72 15.02-12.44 14.96a314.824 314.824 0 0 1-77.14-10.02 0.8 0.8 0 0 0-1 0.74c-0.72 18.454 0.146 37.534 2.6 57.24 0.144 1.132 0.96 2.06 2.06 2.34 44.98 11.32 83.96-2.16 127.18-13 29.72-7.466 59.78-9.646 90.18-6.54 18.1 1.84 15.36 22.32-1 20.54-47.32-5.16-84.8 5.72-128.28 17.44-28.36 7.64-57 8.78-85.92 3.42a0.7 0.7 0 0 0-0.82 0.8 416.112 416.112 0 0 0 12.08 51.14 1.592 1.592 0 0 0 1.28 1.12c29.12 4.02 58.46 15.28 87.02 22.74 20.32 5.294 42.906 8.14 67.76 8.54 12.92 0.22 14.6 20.58-1.94 20.54-31.068-0.066-60.92-4.44-89.56-13.12-23.56-7.134-42.214-12.526-55.96-16.18-0.654-0.174-0.868 0.054-0.64 0.68 43.38 117.82 132.32 211 248.32 258.64 12.32 5.08 18.9 16.26 2.7 22.66-53.26 21.12-108.82 33.26-166.4 29.62z'
        fill='#9EBED1'
        p-id='3822'></path>
      <path
        d='M903.568 219.16a3934.52 3934.52 0 0 1 33.14-9.54c14.6-4.12 22.16 1.9 16.06 16.8a1752.364 1752.364 0 0 0-13 32.74c-0.364 0.94-0.244 1.992 0.32 2.82a1827.186 1827.186 0 0 1 20.84 31.34c6.54 10.06 1.06 18.2-10.46 17.56-12.2-0.68-24.534-1.5-37-2.46a3.32 3.32 0 0 0-2.86 1.24 4670.448 4670.448 0 0 0-22.18 28.02c-9.14 11.62-18.48 8.9-21.92-4.86a3062.236 3062.236 0 0 0-8.96-35.04 1.932 1.932 0 0 0-1.2-1.34c-11.614-4.214-23.18-8.48-34.7-12.8-12.58-4.72-13.48-14.38-2.22-21.44 10.466-6.56 20.892-13.154 31.28-19.78a1.87 1.87 0 0 0 0.88-1.52c0.546-11.654 1.012-23.26 1.4-34.82 0.44-13.08 7.58-21.34 19.66-11.18a1507.86 1507.86 0 0 0 29.16 23.9c0.5 0.4 1.158 0.534 1.76 0.36zM86.548 354.72c-10.56-3.96-21.148-7.854-31.76-11.68-16.84-6.06-16.52-15.24-2.14-24.3 9.4-5.906 18.812-11.82 28.24-17.74a1.92 1.92 0 0 0 0.92-1.54c0.772-11.574 1.3-23.14 1.58-34.7 0.44-18.96 10.82-19.14 23.26-8.72 8.266 6.934 16.512 13.894 24.74 20.88a1.99 1.99 0 0 0 1.74 0.4 860.964 860.964 0 0 0 33.3-9.16c5.332-1.586 9.206-2.106 11.62-1.56 7.5 1.7 8.6 8.98 6 15.64a5535.418 5535.418 0 0 1-14.12 35.78 1.882 1.882 0 0 0 0.2 1.74c5.46 8.22 23.32 30.56 23.88 39.26 0.56 8.6-7.32 10.78-14.72 10.18a955.576 955.576 0 0 0-36.6-2.22 1.94 1.94 0 0 0-1.6 0.74c-6.868 8.734-13.7 17.42-20.5 26.06-3.574 4.546-6.46 7.354-8.66 8.42-7.5 3.62-12.74-2.28-14.52-9.42a1636.688 1636.688 0 0 0-9.66-36.78 1.91 1.91 0 0 0-1.2-1.28z'
        fill='#FEC872'
        p-id='3823'></path>
      <path
        d='M722.608 972.86c-95.788 6.054-182.548-17.04-260.28-69.28-86.88-58.4-149.92-146.9-181.8-246.64a1.18 1.18 0 0 0 0.08-0.52c-0.026-0.366 0.076-0.692 0.28-0.88 6.68-6.1 2.82-17.54-6.28-17.68-13.48-49.266-18.948-99.62-16.4-151.06 16 3.72 31.92 7.86 47.76 12.42 30.96 8.9 62.66 8.06 93.8 0.06 22.72-5.86 48.02-13.5 68.74-16.48 26.5-3.82 60.82-4.72 86.68 3.88a1.34 1.34 0 0 1 0.92 1.32c-0.92 19.706-0.654 39.346 0.8 58.92a0.832 0.832 0 0 1-0.246 0.66 0.788 0.788 0 0 1-0.654 0.22c-42.46-6.08-77.6-7.34-118 9.62-5.64 2.36-19.728 7.606-42.26 15.74-15.86 5.72-8.94 23.98 5.76 19.66 29.76-8.74 58.98-26.44 93.24-29.42 20.08-1.72 42.58 1.4 63.02 5.84 0.934 0.202 1.646 0.976 1.78 1.94a467.086 467.086 0 0 0 13.98 65 1.232 1.232 0 0 1-0.158 1.012 1.188 1.188 0 0 1-0.862 0.528c-30.38 3.3-59.26 12-88.8 19.28-28.44 7.02-54.86 6.74-82.88-1.5a653.15 653.15 0 0 0-69.14-16.32c-19.82-3.54-22.46 17.28-6.6 19.82 19.172 3.094 36.172 6.76 51 11 17.08 4.88 32.02 10.02 47.66 11.64 41.64 4.3 73.42-6.22 122.84-19.28 7.946-2.106 18.926-3.56 32.94-4.36 0.602-0.04 1.156 0.32 1.36 0.88 42.7 119.12 132.5 213.06 249.3 261.7 14.34 5.96 18 16.68 1.2 23.28-32.38 12.72-69.02 24.34-103.86 26.62-0.504 0.024-1.056 0.36-1.5 0.92-0.734 0.92-1.874 1.406-3.42 1.46z'
        fill='#C8DAE5'
        p-id='3824'></path>
      <path
        d='M876.968 571c-17.18-5.36-9.62-24.3 5.5-19.66a305.4 305.4 0 0 0 85.4 13.42c17.46 0.24 16.52 20.8-0.26 20.62-30.96-0.374-61.174-5.166-90.64-14.38zM274.608 637.86c9.1 0.14 12.96 11.58 6.28 17.68-0.204 0.188-0.306 0.514-0.28 0.88a1.18 1.18 0 0 1-0.08 0.52c-32.14 6.5-60.68 20.28-91.56 30.46-2.948 0.974-5.568 0.414-7.86-1.68-8.46-7.68-4.5-15.58 4.84-18.92 32.74-11.7 57.46-24.22 88.66-28.94z'
        fill='#9EBED1'
        p-id='3825'></path>
    </svg>
  )
}

function IconSun() {
  return (
    <svg
      viewBox='0 0 1024 1024'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      p-id='8469'
      width='24'
      height='24'>
      <path
        d='M270.387022 463.499421A226.484357 226.484357 0 1 1 496.871379 689.983778a226.484357 226.484357 0 0 1-226.484357-226.484357z'
        fill='#FFDA6A'
        p-id='8470'></path>
      <path
        d='M496.12978 823.76825a16.31518 16.31518 0 0 1-8.899189-2.966396L444.959444 790.396292a16.611819 16.611819 0 0 1-3.707996-22.989571 16.760139 16.760139 0 0 1 23.137892-3.856315l33.371958 24.176129 36.190035-22.247972a16.463499 16.463499 0 0 1 16.908458 28.329085l-46.127462 27.735805a16.611819 16.611819 0 0 1-8.602549 2.224797z m193.705678-88.10197a16.463499 16.463499 0 0 1-4.746234-32.482039l41.677868-10.382387 6.674391-40.19467a16.463499 16.463499 0 0 1 32.630359 5.339514l-8.454229 51.318655a16.908459 16.908459 0 0 1-12.310545 13.348784l-52.208574 13.052143zM311.471611 733.738123a12.013905 12.013905 0 0 1-3.263036 0l-51.318656-8.45423a16.463499 16.463499 0 0 1-13.348783-12.310544l-13.052144-52.060255a16.463499 16.463499 0 1 1 31.59212-8.30591l10.382387 41.826188 40.49131 6.526072a16.463499 16.463499 0 0 1-1.483198 32.778679z m187.772885-17.650058a251.253766 251.253766 0 1 1 250.660487-251.253766 251.253766 251.253766 0 0 1-251.105446 251.253766z m0-32.926999a218.326767 218.326767 0 1 0-218.771727-218.326767 218.326767 218.326767 0 0 0 218.326768 218.326767z m-312.954809-156.180765a16.01854 16.01854 0 0 1-14.831981-7.86095l-27.735806-46.275782a16.463499 16.463499 0 0 1 0.741599-18.095017l29.663963-42.271148a16.463499 16.463499 0 0 1 26.697567 19.281576L177.983778 465.279258l22.099652 36.783314a16.463499 16.463499 0 0 1-5.636153 22.544612 14.831981 14.831981 0 0 1-8.15759 2.373117z m625.019699 0a14.831981 14.831981 0 0 1-7.71263-2.373117 16.463499 16.463499 0 0 1-5.636153-22.544612l22.099652-36.783314-23.87949-33.520278a16.16686 16.16686 0 0 1 3.707995-22.841251 16.463499 16.463499 0 0 1 22.989571 3.559675l30.405562 42.271148a16.31518 16.31518 0 0 1 0 18.095017L826.141367 519.119351a16.01854 16.01854 0 0 1-14.831981 7.86095zM338.910776 470.173812a16.463499 16.463499 0 0 1-14.831981-17.501738c3.263036-50.577057 19.429896-90.030127 49.242178-117.469293a185.103129 185.103129 0 0 1 118.655852-43.012746 16.463499 16.463499 0 1 1 1.779838 32.926999c-44.495944 2.373117-76.533024 14.090382-98.780997 34.410197s-35.745075 50.577057-38.563152 95.221321a16.611819 16.611819 0 0 1-17.501738 15.42526zM749.015064 294.414832a16.611819 16.611819 0 0 1-14.831982-13.793743l-7.41599-40.639629-41.677868-10.382387a16.463499 16.463499 0 0 1 8.00927-32.03708l52.208574 13.052144a16.760139 16.760139 0 0 1 12.310545 13.348783l8.454229 51.318656a16.908459 16.908459 0 0 1-13.645423 18.984936z m-504.28737-1.928158a12.310545 12.310545 0 0 1-3.263036 0 16.31518 16.31518 0 0 1-12.013905-20.023175l13.052144-52.208574a16.760139 16.760139 0 0 1 13.348783-12.310545l51.318656-8.30591a16.463499 16.463499 0 1 1 5.191194 32.48204l-40.49131 6.674392-10.382387 41.677867a16.463499 16.463499 0 0 1-16.16686 12.013905z m209.872538-120.287369a16.463499 16.463499 0 0 1-10.234067-29.663963l42.271147-29.663963a16.463499 16.463499 0 0 1 18.095017 0l46.127462 27.735805a16.31518 16.31518 0 0 1 5.636153 22.544612 16.463499 16.463499 0 0 1-22.544611 5.784473l-36.783314-22.247972-32.778679 22.396292a17.056779 17.056779 0 0 1-9.195829 3.114716z'
        fill='#333333'
        p-id='8471'></path>
    </svg>
  )
}

function IconSystem() {
  return (
    <svg
      viewBox='0 0 1024 1024'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      p-id='9645'
      width='24'
      height='24'>
      <path
        d='M637.2864 619.9296m-341.5552 0a341.5552 341.5552 0 1 0 683.1104 0 341.5552 341.5552 0 1 0-683.1104 0Z'
        fill='#BCEA4B'
        p-id='9646'></path>
      <path
        d='M147.5584 436.3264c5.632 0 10.24-4.608 10.24-10.24v-46.6432c0-5.632-4.608-10.24-10.24-10.24s-10.24 4.608-10.24 10.24v46.6432a10.24 10.24 0 0 0 10.24 10.24zM769.792 649.472c22.2208 0 40.2944-18.0736 40.2944-40.2944V294.144c0-22.2208-18.0736-40.2944-40.2944-40.2944H256.0512c-22.2208 0-40.2944 18.0736-40.2944 40.2944v315.0336c0 22.2208 18.0736 40.2944 40.2944 40.2944h513.7408z m-533.6064-40.2944V294.144c0-10.9568 8.9088-19.8144 19.8144-19.8144h513.7408a19.8656 19.8656 0 0 1 19.8144 19.8144v315.0336c0 10.9568-8.9088 19.8144-19.8144 19.8144H256.0512c-10.9568 0-19.8656-8.9088-19.8656-19.8144z'
        fill='#4A5177'
        p-id='9647'></path>
      <path
        d='M968.4992 721.8176h-81.2544v-481.28c0-30.8736-25.1392-56.0128-56.0128-56.0128H193.28c-30.8736 0-56.0128 25.1392-56.0128 56.0128v65.6896c0 5.632 4.608 10.24 10.24 10.24s10.24-4.608 10.24-10.24V240.5376c0-19.5584 15.9232-35.5328 35.5328-35.5328h637.952c19.6096 0 35.5328 15.9232 35.5328 35.5328v481.28H157.7984V486.6048c0-5.632-4.608-10.24-10.24-10.24s-10.24 4.608-10.24 10.24v235.2128H57.344c-5.632 0-10.24 4.608-10.24 10.24 0 57.5488 46.7968 104.3456 104.3456 104.3456h722.8928c57.5488 0 104.3456-46.7968 104.3456-104.3456 0.0512-5.6832-4.5568-10.24-10.1888-10.24z m-383.1296 20.48v13.7728c0 10.8544-8.8064 19.6608-19.6608 19.6608H463.7184c-10.8544 0-19.6608-8.8064-19.6608-19.6608v-13.7728h141.312z m288.9728 73.6256H151.4496c-42.8032 0-78.1824-32.2048-83.2512-73.6256h355.4304v13.7728c0 22.1184 18.0224 40.1408 40.1408 40.1408h101.9392c22.1184 0 40.1408-18.0224 40.1408-40.1408v-13.7728H957.6448c-5.12 41.4208-40.4992 73.6256-83.3024 73.6256z'
        fill='#4A5177'
        p-id='9648'></path>
    </svg>
  )
}
