import Link from 'next/link'
import Image from 'next/image'
import Home from '@/icons/Home'
import List from '@/components/List'
import ReadOn from '@/components/ReadOn'
import { Blog, Essay } from 'contentlayer/generated'
import styles from '@/app/page.module.css'

export default function Articles({
  blogList,
  type,
}: {
  blogList: (Blog | Essay)[]
  type: 'blog' | 'essay'
}) {
  const map = {
    blog: ['寻幽于前端', '代码不能比猫粑粑还臭啊！'],
    essay: ['灵感拾遗', '😄🙂☺️'],
  }
  return (
    <>
      <section className='fixed z-10 top-4 left-4 px-4 py-1 rounded-lg flex items-center bg-emerald-50 shadow-sm shadow-teal-800 dark:bg-slate-500 dark:shadow-slate-300'>
        <Link href='/'>
          <Home />
        </Link>
      </section>
      <div className={`flex h-screen pt-8 pb-16 ${styles['list-page']}`}>
        <section className={`${styles.intro} rounded-md px-4 py-2 relative`}>
          <span className='text-lg font-semibold text-slate-600'>
            Kiera’s {`${type}`}&nbsp;/&nbsp;
          </span>
          <span className='text-2xl font-black text-slate-700'>
            {map[type][0]}
          </span>
          <p className='text-md text-slate-400'>{map[type][1]}</p>
          <div
            className={`${styles.cat} absolute -z-10 dark:invert`}
          >
            <Image
                width='300'
                height='310'
                src='/assets/cat.png'
                alt='cat on rush'
              ></Image>
          </div>
        </section>
        <List
          className={`${styles.list} rounded-md px-4 py-2 bg-teal-600/[.06] dark:bg-slate-800/[.6]`}
          data={blogList}
        />
        <div className='fixed bottom-0 left-0 z-10 w-full'><ReadOn /></div>
      </div>
    </>
  )
}

// rgb(131 212 208 / 26%)
