import { FC } from 'react'
import { AtSignIcon, GithubIcon, TwitterIcon } from 'lucide-react'
import Link from 'next/link'

const LIST = [
  {
    title: 'Github',
    icon: GithubIcon,
    href: 'https://github.com/dodocie',
    className: 'hover:bg-[#171715] hover:text-white',
  },
  {
    title: '邮箱',
    icon: AtSignIcon,
    href: 'mailto:dodocie@gmail.com',
    className: 'hover:bg-[#e86125] hover:text-white',
  },
  {
    title: 'Twitter',
    icon: TwitterIcon,
    href: 'https://twitter.com/dodocie',
    className: 'hover:bg-[#1d9bf0] hover:text-white',
  },
]

const Social: FC = () => {
  return (
    <div className="w-full mt-1 mr-2 flex items-center justify-end">
      {LIST.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          title={item.title}
          className={`block p-2 rounded-full text-gray-600 transition-colors ${item.className}`}
        >
          <item.icon size={20} />
        </Link>
      ))}
    </div>
  )
}

export default Social
