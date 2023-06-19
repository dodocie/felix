import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import './globals.css'
import './overload.css'
import ReadingProvider from '@/components/Provider'
import SwitchMode from '@/components/Mode'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Felix The Cat',
  description: 'let us have fun!',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className='antialiased text-slate-500 dark:text-slate-400 bg-teal-50 dark:bg-slate-900'>
        <SwitchMode />
        <ReadingProvider>{children}</ReadingProvider>
      </body>
    </html>
  )
}
