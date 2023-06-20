'use client'
import { List, Drawer } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Link from 'next/link'
import styles from '@/app/page.module.css'
import Folder from '@/icons/Folder'
import Home from '@/icons/Home'
import Content from '@/icons/Content'
import Paw from '@/icons/PinkPaw'
import style from '@/app/page.module.css'
import { useEffect } from 'react'

export default function Directory({ html }: { html: string }) {
  const [opened, { open, close }] = useDisclosure(false)

  const directory = generateTree(html)

  useEffect(() => {
    const handler = (event: Event) => {
      if (event.target?.nodeName === 'A') {
        close()
      }
    }
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [close])

  return (
    <>
      <section className='fixed z-10 top-4 left-4 px-4 py-1 rounded-lg flex items-center bg-emerald-50 shadow-sm shadow-teal-800 dark:bg-slate-500 dark:shadow-slate-300'>
        <Link href='/'>
          <Home />
        </Link>
        <div className={`${styles['hide-on-widescreen']} ml-4`} onClick={open}>
          <Folder />
        </div>
      </section>
      <Drawer
        className={`${style['hide-on-widescreen']} dark:bg-slate-700`}
        position='right'
        size='75%'
        transitionProps={{
          transition: 'pop-top-right',
          duration: 150,
          timingFunction: 'linear',
        }}
        opened={opened}
        onClose={close}
        withCloseButton={false}>
        <div className='flex items-center mb-4 text-slate-600 dark:text-slate-300'>
          <Content />
          <p className='ml-4 text-2xl font-bold'>目录</p>
        </div>
        <div className='pl-3 text-slate-600 dark:text-slate-300'>{genNestNode(directory)}</div>
      </Drawer>
      <div className={`${style['hide-on-mobile']}`} style={{height: '600px', overflow: 'hidden'}}>
        <div className='mt-10 sticky top-4 text-slate-600 dark:text-slate-300'>
          <div className='flex items-center mb-4'>
            <Content />
            <p className='ml-4 text-2xl font-bold'>目录</p>
          </div>
          <div className='pl-3 border-l'>
            {genNestNode(directory)}
          </div>
        </div>
      </div>
    </>
  )
}

const sizeMap = ['xl', 'md', 'sm']

function genNestNode(nodes: MatchNode[], isPadding?: boolean) {
  if (!nodes?.length) return null
  return (
    <List
      withPadding={isPadding}
      size={sizeMap[nodes[0].level - 1]}
      icon={<Paw size={14} />}>
      {nodes.map(node => {
        return (
          <List.Item key={`d${node.value}_${node.level}`}>
            <a
              className={`directory-${node.level} text-base text-slate-600 dark:text-slate-300 block mb-2`}
              style={{ fontWeight: `${(9 - node.level) * 100}` }}
              href={`#${node.value.trim()}`}>
              {node.value}
            </a>
            {genNestNode(node.children, node.level > 1)}
          </List.Item>
        )
      })}
    </List>
  )
}

function findMatches(inputString: string) {
  const regex = /##[^\n]+/g
  const matches = inputString.match(regex)
  return matches || []
}

function generateTree(inputString: string) {
  const lines = findMatches(inputString)
  const root: MatchNode = { value: '', children: [], level: 0 }
  let currentNode = root

  for (let line of lines) {
    const hashCount = line.match(/^#+/)?.[0].length
    if (!hashCount) break
    const value = line.replace(/^#+/, '')

    while (currentNode.parent && hashCount <= currentNode.level) {
      currentNode = currentNode.parent
    }

    const newNode = {
      value,
      level: hashCount,
      children: [],
      parent: currentNode,
    }
    currentNode.children.push(newNode)
    currentNode = newNode
  }

  return root.children
}

type MatchNode = {
  value: string
  level: number
  children: MatchNode[]
  parent?: {
    value: string
    children: MatchNode[]
    level: number
    parent?: MatchNode
  }
}
