import List from '@/components/List'
import { Blog, Essay } from 'contentlayer/generated'
import styles from '@/app/page.module.css'

export default function Articles({blogList, type}: {blogList: (Blog|Essay)[], type: 'blog' | 'essay'}) {
  const map = {
    blog: ['前端探索', '代码不能比猫粑粑还臭啊！'],
    essay: ['灵感拾遗', '😄🙂☺️']
  }
  return (
    <div className={`flex h-screen ${styles['list-page']}`}>
      <section className={`${styles.intro} rounded-md px-4 py-2`}>
        <span className='text-lg font-semibold text-slate-600'>Kiera's {`${type}`}</span>
        <span className={styles['hide-on-widescreen']}>&nbsp;/&nbsp;</span>
        <br className={styles['hide-on-mobile']} />
        <span className='text-2xl font-black text-slate-700'>{map[type][0]}</span>
        <p className='text-md text-slate-400'>{map[type][1]}</p>
      </section>
      <List className={`${styles.list} rounded-md bg-teal-600/[.06] px-4 py-2`} data={blogList} />
    </div>
  )
}

// rgb(131 212 208 / 26%)