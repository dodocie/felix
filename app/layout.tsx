import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import './globals.css'
import './overload.css'
import ReadingProvider from '@/components/Provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Felix The Cat',
  description: 'let us have fun!',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <ReadingProvider>{children}</ReadingProvider>
      </body>
    </html>
  )
}
