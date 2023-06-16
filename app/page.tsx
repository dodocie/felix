import Link from 'next/link'
import styles from './page.module.css'
import Social from '@/components/Social'
import Search from '@/components/Search'
import ReadOnBanner from '@/components/ReadOn'

export default function Home() {

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <Social />
        <div className={styles.avatar}>
          <Search />
        </div>
        <ReadOnBanner />
      </div>

      <div className={styles.center}>
        <p className='text-3xl font-extrabold'>FELIX THE CAT</p>
        <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1676" width="64" height="64"><path d="M 114.95 629.48 s -134.39 -197.75 80.63 -271.66 l 16.32 -9.6 s 8.64 -111.35 118.07 -142.07 c 0 0 68.16 -1.92 96.95 0 c 0 0 48.96 -99.83 174.71 -66.24 c 0 0 41.28 14.4 69.11 45.12 c 0 0 191.03 -62.4 181.43 124.79 c 0 0 -37.44 -173.75 -174.71 -79.67 c 0 0 -125.75 -135.35 -214.06 -19.2 l -20.16 32.64 s -171.83 -37.44 -207.35 137.27 c 0.01 -0.01 -203.49 31.67 -120.94 248.62 Z" fill="#2c2c2c" p-id="1677"></path><path d="M 176.39 563.24 a 74.39 66.24 0 1 0 148.78 0 a 74.39 66.24 0 1 0 -148.78 0 Z" fill="#2c2c2c" p-id="1678"></path><path d="M 383.25 414.93 m -69.12 0 a 69.12 69.12 0 1 0 138.24 0 a 69.12 69.12 0 1 0 -138.24 0 Z" fill="#2c2c2c" p-id="1679"></path><path d="M 568.52 310.3 m -71.03 0 a 71.03 71.03 0 1 0 142.06 0 a 71.03 71.03 0 1 0 -142.06 0 Z" fill="#2c2c2c" p-id="1680"></path><path d="M 673.15 329.5 a 61.44 70.07 0 1 0 122.88 0 a 61.44 70.07 0 1 0 -122.88 0 Z" fill="#2c2c2c" p-id="1681"></path><path d="M 289.66 723.55 s 136.31 263.02 395.49 137.27 c 0 0 171.83 -88.31 136.31 -350.37 c 0 0 108.47 252.46 -122.87 383.97 c 0 0 -291.82 148.79 -408.93 -170.87 Z" fill="#2c2c2c" p-id="1682"></path><path d="M 446.13 650.59 s 84.95 -139.67 239.02 -87.35 c 37.04 12.58 110.87 94.55 0 156.47 c -18.65 10.41 -43.2 7.68 -85.43 0 c 0 0 -29.76 63.36 -64.32 74.87 c 0 0 -134.39 57.6 -89.27 -143.99 Z" fill="#2c2c2c" p-id="1683"></path></svg>
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
