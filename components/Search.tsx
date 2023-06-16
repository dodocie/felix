"use client"
import { Text } from "@mantine/core"
import {
  SpotlightProvider,
  spotlight,
  SpotlightActionProps,
} from "@mantine/spotlight"
import Link from "next/link"
import Magnifier from "@/icons/Magnifier"
import { fuzzySearch } from "@/utils/fuzzy"
import Title from "@/icons/Title"
import { allBlogs, allEssays } from "contentlayer/generated"

export default function Search() {
  const articles = [...allBlogs, ...allEssays].map((article) => ({
    ...article,
    searchVal: "",
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
        searchPlaceholder="Search..Blog."
        shortcut="mod + shift + 1"
        nothingFoundMessage="Nothing found..."
        closeOnActionTrigger={true}
        limit={5}
        filter={filterSpotlight}
        radius="md"
      >
        <div
          className="flex w-20 items-center justify-center py-1.5 border rounded border-slate-400 text-slate-600"
          onClick={() => spotlight.open()}
        >
          <Magnifier />
          <span className="font-medium ml-1">搜索</span>
        </div>
      </SpotlightProvider>
    </>
  )
}

function CustomAction({ action }: SpotlightActionProps) {
  return (
    <Link href={action.url}>
      <dl className="flex items-start mt-2">
        <dt className="mt-1 mr-1">
          <Title />
        </dt>
        <dd className="w-5/6">
          <Text size="md">{mapTitleNode(action.searchVal, action.title)}</Text>
          <Text size="sm" mt={4}>
            {mapContentNode(action.searchVal, action.body.raw)}
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
      return <span className="font-semibold text-sky-600">{v.text}</span>
    return v.text
  })
}

function genNode(val: string, text: string) {
  const len = text.length
  let flag = false,
    start = 0
  const arr = [{ text: "", tag: "" }]

  for (let i = 0; i < len; i++) {
    const isMatch = val.includes(text[i])
    if (isMatch === flag) {
      arr[start].text += text[i]
      continue
    }
    flag = isMatch
    const tag = isMatch ? "span" : ""
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
  let maxSpanIndex = -1
  let maxSpanLength = 0
  const len = arr.length
  const totalStrLen = 20

  for (let i = 0; i < len; i++) {
    if (arr[i].tag === "span" && arr[i].text.length > maxSpanLength) {
      maxSpanIndex = i
      maxSpanLength = arr[i].text.length
    }
  }

  if (maxSpanIndex !== -1) {
    const matchItem = arr[maxSpanIndex]
    const restLen = totalStrLen - matchItem.text.length

    if (restLen < 0) return [matchItem]

    let targetNabor = 0
    const nabor = { tag: "", text: "" }

    if (maxSpanIndex < len - 1) {
      targetNabor = maxSpanIndex + 1
      nabor.text = arr[targetNabor].text.substring(0, restLen)
      console.log('nabor', nabor)
      return [matchItem, nabor]
    }

    targetNabor = maxSpanIndex - 1
    nabor.text = arr[targetNabor].text.slice(-restLen)
    return [nabor, matchItem]
  }

  return result
}
