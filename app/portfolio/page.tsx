import { Metadata } from 'next'
import Link from 'next/link'

import Home from '@/icons/Home'
import Portfolio from '@/components/portfolio'

export const metadata: Metadata = {
  title: `Kiera's Portfolio`,
}

export default async function Page() {

  return <>
    <section className='fixed z-10 top-4 left-4 px-4 py-1 rounded-lg flex items-center bg-emerald-50 shadow-sm shadow-teal-800 dark:bg-slate-500 dark:shadow-slate-300'>
      <Link href='/'>
        <Home />
      </Link>
    </section>
    <Portfolio />
  </>
}
