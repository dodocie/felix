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
        <Link href="/blog"
          className={styles.card}
        >
          <h2>
            前端探索 <span>-&gt;</span>
          </h2>
          <p>にゃ～(^._.^)ﾉ代码可不能比喵粑粑还臭</p>
        </Link>
        <Link href="/essay"
          className={styles.card}
        >
          <h2>
            灵感拾遗 <span>-&gt;</span>
          </h2>
          <p>一些碎片化的知识和趣闻。</p>
        </Link>
        <Link href="/"
          className={styles.card}
        >
          <h2>
            AI 自习室 <span>-&gt;</span>
          </h2>
          <p>还没想好怎么做~</p>
        </Link>
      </div>
    </main>
  )
}
