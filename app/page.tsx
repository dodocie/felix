import Link from 'next/link'
import styles from './page.module.css'
import Social from '@/components/Social'
import Search from '@/components/Search'
import ReadOnBanner from '@/components/ReadOn'
import Paw from '@/icons/Paw'
import Flag from '@/icons/Flag'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className='fixed top-3 right-10'><Social /></div>        
      <div className='mt-4 ml-6'><Search /></div>

      <div className={`${styles.center} relative flex items-center justify-center`}>
        <div className='absolute -z-10 m-auto md:fixed md:bottom-1/4 transform-gpu md:scale-3 dark:invert'><Flag /></div>
        <div className='flex items-end'>
          <p className='text-3xl font-extrabold text-slate-800 dark:text-slate-100'>FELIX THE CAT</p>
          <Paw />
        </div>
      </div>

      <div className={styles.grid}>
        <div className={`${styles.card} mb-8`}>
          <Link href='/blog' className='text-lg font-semibold'>
            前端探索 <span>-&gt;</span>
          </Link>
          <p className='mt-2 text-base text-gray-500'>
            代码可不能比喵粑粑还臭
          </p>
        </div>
        <div className={`${styles.card} mb-8`}>
          <Link href='/essay' className='text-lg font-semibold'>
            灵感拾遗 <span>-&gt;</span>
          </Link>
          <p className='mt-2 text-base text-gray-500'>一些碎片化的知识和趣闻。</p>
        </div>
        <div className={`${styles.card} mb-8`}>
          <Link href='/' className='text-lg font-semibold'>
            AI 自习室 <span>-&gt;</span>
          </Link>
          <p className='mt-2 text-base text-gray-500'>还没想好怎么做~</p>
        </div>
      </div>
      <ReadOnBanner />
    </main>
  )
}
