import Link from 'next/link'
import styles from './page.module.css'
import Social from '@/components/Social'
import Search from '@/components/Search'
import ReadOnBanner from '@/components/ReadOn'
import Paw from '@/icons/Paw'
import { spawn } from 'child_process'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <Social />
        <div className={styles.search_bar}>
          <Search />
        </div>
        <ReadOnBanner />
      </div>

      <div className={styles.center}>
        <p className='text-3xl font-extrabold'>FELIX THE CAT</p>
        <Paw />
      </div>

      <div className={styles.grid}>
        <div className='mb-8'>
          <Link href='/blog' className={`font-semibold ${styles.card}`}>
            前端探索 <span>-&gt;</span>
          </Link>
          <p className='mt-2 text-base text-gray-500'>
            にゃ～(^._.^)ﾉ代码可不能比喵粑粑还臭
          </p>
        </div>
        <div className='mb-8'>
          <Link href='/essay' className={`font-semibold ${styles.card}`}>
            灵感拾遗 <span>-&gt;</span>
          </Link>
          <p className='mt-2 text-base text-gray-500'>一些碎片化的知识和趣闻。</p>
        </div>
        <div className='mb-8'>
          <Link href='/' className={`font-semibold ${styles.card}`}>
            AI 自习室 <span>-&gt;</span>
          </Link>
          <p className='mt-2 text-base text-gray-500'>还没想好怎么做~</p>
        </div>
      </div>
    </main>
  )
}
