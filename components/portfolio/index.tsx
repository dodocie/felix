
import List from '@/components/List'

import styles from '@/app/page.module.css'

const artGroup = [
  { title: '一个小游戏', date: '2023-10-22', url: 'https://whisper.kiera.site/' },
]

export default function Page() {
  return <>
    <div className={`flex h-screen pt-8 ${styles['list-page']}`}>
      <section className={`${styles.intro} rounded-md px-4 py-2 relative`}>
        <span className='text-lg font-semibold text-slate-600'>
          Kiera’s Portfolio&nbsp;/&nbsp;
        </span>
        <span className='text-2xl font-black text-slate-700'>
          即是技术，也是艺术
        </span>
        <p className='text-md text-slate-400'>给俺💥</p>

      </section>
      <List
          className={`${styles.list} rounded-md px-4 py-2 bg-teal-600/[.06] dark:bg-slate-800/[.6]`}
          data={artGroup}
        />
    </div>
  </>
}