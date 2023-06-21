'use client'
import { Text } from '@mantine/core'
import {
  SpotlightProvider,
  spotlight,
  SpotlightActionProps,
} from '@mantine/spotlight'
import Link from 'next/link'
import Magnifier from '@/icons/Magnifier'
import { fuzzySearch } from '@/utils/fuzzy'
import Content from '@/icons/Content'
import { allBlogs, allEssays } from 'contentlayer/generated'

export default function Search() {
  const articles = [...allBlogs, ...allEssays].map((article) => ({
    ...article,
    searchVal: '',
    onTrigger: () => ({}),
  }))

  const filterSpotlight = (val: string, actions: typeof articles) => {
    if (!val) return actions
    return fuzzySearch(val, actions).map((article) => ({
      ...article,
      searchVal: val,
      onTrigger: () => ({}),
    }))
  }

  return (
    <>
      <SpotlightProvider
        actions={articles}
        searchIcon={<Magnifier />}
        actionComponent={CustomAction}
        searchPlaceholder='Search blog'
        shortcut='mod + k'
        transitionProps={{ duration: 300, transition: 'slide-down' }}
        nothingFoundMessage='Nothing found...'
        closeOnActionTrigger={true}
        limit={5}
        filter={filterSpotlight}
        radius='md'
      >
        <div
          className='flex w-20 items-center justify-between px-3 py-1.5 border rounded border-slate-400 text-slate-600 dark:text-slate-400'
          onClick={() => spotlight.open()}
        >
          <Magnifier />
          <span className='font-medium ml-1'>搜索</span>
        </div>
      </SpotlightProvider>
    </>
  )
}

function CustomAction({ action }: SpotlightActionProps) {
  const text = removeMDXCode(action.body.raw)
  return (
    <Link href={action.url}>
      <dl className='flex items-start mt-2 text-slate-800 dark:text-slate-400'>
        <dt className='mt-1 mr-1'>
          <Content size={16} />
        </dt>
        <dd className='w-5/6'>
          <Text size='md'>{mapTitleNode(action.searchVal, action.title)}</Text>
          <Text size='sm' mt={4}>
            {mapContentNode(action.searchVal, text)}
          </Text>
        </dd>
      </dl>
    </Link>
  )
}

function mapTitleNode(val: string, text: string) {
  return <>{genTextNode(genNode(val, text))}</>
}
function mapContentNode(val: string, text: string) {
  return <>{genTextNode(findBestMatchItem(val, text))}</>
}

function genTextNode(node: Item[]) {
  return node.map((v) => {
    if (v.tag)
      return <span className='font-semibold text-sky-600'>{v.text}</span>
    return v.text
  })
}

function genNode(val: string, text: string) {
  const len = text.length
  let flag = false,
    start = 0
  const arr = [{ text: '', tag: '' }]

  for (let i = 0; i < len; i++) {
    const isMatch = val.includes(text[i])
    if (isMatch === flag) {
      arr[start].text += text[i]
      continue
    }
    flag = isMatch
    const tag = isMatch ? 'span' : ''
    arr[++start] = { text: text[i], tag }
  }
  return arr
}

function findBestMatchItem(val: string, text: string) {
  const arr = genNode(val, text)
  return findMaxSpanWithNeighbors(arr)
}

interface Item {
  text: string
  tag: string
}

function findMaxSpanWithNeighbors(arr: Item[]): Item[] {
  const result: Item[] = []
  const len = arr.length
  const totalStrLen = 30

  const { maxSpanIndex, maxSpanLength } = arr.reduce(
    (obj, { text, tag }, i) => {
      if (tag === 'span' && text.length > obj.maxSpanLength) {
        obj.maxSpanIndex = i
        obj.maxSpanLength = text.length
      }
      return obj
    },
    { maxSpanIndex: -1, maxSpanLength: 0 },
  )

  if (maxSpanIndex !== -1) {
    const matchItem = arr[maxSpanIndex]
    let restLen = totalStrLen - maxSpanLength

    result.push(matchItem)

    let left = maxSpanIndex - 1,
      right = maxSpanIndex + 1
    while (restLen > 0 && (right < len || left >= 0)) {
      if (right < len) {
        const { text, tag } = arr[right]
        const newText = text.substring(0, restLen)
        result.push({ text: newText, tag })
        restLen -= newText.length
        right++
      }
      if (left >= 0) {
        if (restLen <= 0) {
          result.unshift({ text: '...', tag: '' })
        } else {
          const { text, tag } = arr[left]
          const newText = text.slice(-restLen)
          result.unshift({ text: newText, tag })
          restLen -= newText.length
          left--
        }
      }
    }
  }

  return result
}

function removeMDXCode(input: string): string {
  const regex = /(```[\s\S]+?```|\[[^\]]+?\]\)|#+[^#\s]+)[^`#\[\]]*/g
  const strippedString = input.replace(regex, '')
  return strippedString
}
