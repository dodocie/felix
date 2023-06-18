import Link from 'next/link'
import Image from 'next/image'
import Home from '@/icons/Home'
import List from '@/components/List'
import ReadOn from '@/components/ReadOn'
import WoolBall from '@/components/WoolBall'
import IdeaBubble from '@/icons/IdeaBubble'
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
      <section className='fixed z-10 top-4 right-4 px-4 py-1 rounded-lg flex items-center bg-emerald-50 shadow-sm shadow-teal-800'>
        <Link href='/'>
          <Home />
        </Link>
      </section>
      <div className={`pb-16 ${styles['list-page']}`}>
        <section className={`${styles.intro} rounded-md px-4 py-2 relative`}>
          <span className='text-lg font-semibold text-slate-600'>
            Kiera’s {`${type}`}&nbsp;/&nbsp;
          </span>
          <span className='text-2xl font-black text-slate-700'>
            {map[type][0]}
          </span>
          <p className='text-md text-slate-400'>{map[type][1]}</p>
          <div
            className='absolute'
            style={{ bottom: '-300px', left: '-100px' }}
          >
            <div className={`relative -z-10 ${styles['hide-on-mobile']}`}>
              <Image
                width='300'
                height='276'
                src='/assets/cat_work.png'
                alt='cat work'
              ></Image>
              <div className='absolute -top-7 left-1/2'>
                <IdeaBubble />
              </div>
              <div className='absolute bottom-7 -right-1'>
                <WoolBall />
              </div>
            </div>
          </div>
        </section>
        <List
          className={`${styles.list} rounded-md bg-teal-600/[.06] px-4 py-2`}
          data={blogList}
        />
        <ReadOn />
      </div>
    </>
  )
}

// rgb(131 212 208 / 26%)
