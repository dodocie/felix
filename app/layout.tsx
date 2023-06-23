import { ReactNode } from 'react'
import Head from 'next/head'
import './globals.css'
import './overload.css'
import ReadingProvider from '@/components/Provider'
import SwitchMode from '@/components/Mode'

export const metadata = {
  title: 'Felix The Cat',
  description: 'let us have fun!',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <body className='antialiased text-slate-700 dark:text-slate-400 bg-emerald-50/50 dark:bg-slate-900'>
        <SwitchMode />
        <ReadingProvider>{children}</ReadingProvider>
      </body>
    </html>
  )
}
