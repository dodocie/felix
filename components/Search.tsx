'use client'
import { useDisclosure } from '@mantine/hooks'
import { Modal, useMantineTheme, TextInput } from '@mantine/core'
import { ChangeEvent, useState } from 'react'
import Magnifier from '@/icons/Magnifier'
import List from './List'
import { Article, fuzzySearch } from '@/utils/fuzzy'

export default function Search() {
  const [opened, { open, close }] = useDisclosure(false)
  const theme = useMantineTheme()

  const [matchArticles, setMatch] = useState<Article[]>([])
  const onTimelySearch = (event: ChangeEvent<HTMLInputElement>) => {
    const {value} = event.currentTarget
    
    const articles = fuzzySearch(value)
    console.log('articles', articles)
    setMatch(articles)
  }

  return (
    <>
      <div
        className='flex w-20 items-center justify-center py-1.5 border rounded border-slate-400 text-slate-600'
        onClick={open}>
        <Magnifier />
        <span className='font-medium ml-1'>搜索</span>
      </div>
      <Modal
        opened={opened}
        onClose={close}
        centered
        size='calc(100vw - 3rem)'
        withCloseButton={false}
        overlayProps={{
          color:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[9]
              : theme.colors.gray[2],
          opacity: 0.6,
          blur: 1,
        }}>
        <TextInput
          data-autofocus
          placeholder="找文章"
          icon={<Magnifier />}
          onChange={onTimelySearch}
        />
        <List className='mt-4' data={matchArticles} />
      </Modal>
    </>
  )
}
