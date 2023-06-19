import Link from 'next/link'
import styles from './page.module.css'
import Social from '@/components/Social'
import Search from '@/components/Search'
import ReadOnBanner from '@/components/ReadOn'
import Paw from '@/icons/Paw'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        {/* <Social /> */}
        <div className='mt-4 ml-6'><Search /></div>
        <ReadOnBanner />
      </div>

      <div className={`${styles.center} flex items-end justify-center relative`}>
        {/* <div className='absolute top-1/2 left-0 flex'>
        <p className=' w-72 h-72 -z-20 rounded-full blur-2xl bg-gradient-radial from-white to-transparent'></p>
        <p className=' w-72 h-44 -z-10 -ml-20 rounded-full blur-2xl bg-gradient-conic from-180deg from-yellow-300/20 from-0 via-yellow-300/20  via-160deg to-transparent'></p> 
        </div> */}
        <p className='absolute w-28 h-44 -z-20 rounded-full top-1/2 left-0 blur-2xl bg-gradient-radial from-white dark:from-slate-900 to-transparent'></p>
        <p className='absolute w-72 dark:w-40 h-44 -z-10 rounded-full top-1/2 left-20 blur-2xl bg-gradient-conic from-180deg from-lime-100/40 dark:from-sky-800 from-0 via-yellow-100/50 dark:via-sky-800  via-180deg to-yellow-50/20 dark:to-sky-700'></p>
        <p className='text-3xl font-extrabold text-slate-800 dark:text-slate-100'>FELIX THE CAT</p>
        <Paw />
      </div>

      <div className={styles.grid}>
        <div className={`${styles.card} mb-8`}>
          <Link href='/blog' className='font-semibold'>
            前端探索 <span>-&gt;</span>
          </Link>
          <p className='mt-2 text-base text-gray-500'>
            代码可不能比喵粑粑还臭
          </p>
        </div>
        <div className={`${styles.card} mb-8`}>
          <Link href='/essay' className='font-semibold'>
            灵感拾遗 <span>-&gt;</span>
          </Link>
          <p className='mt-2 text-base text-gray-500'>一些碎片化的知识和趣闻。</p>
        </div>
        <div className={`${styles.card} mb-8`}>
          <Link href='/' className='font-semibold'>
            AI 自习室 <span>-&gt;</span>
          </Link>
          <p className='mt-2 text-base text-gray-500'>还没想好怎么做~</p>
        </div>
      </div>
    </main>
  )
}
