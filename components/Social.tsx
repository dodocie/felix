import Link from 'next/link'
import Github from '@/icons/Github'
import Juejin from '@/icons/Juejin'

const LIST = [
  {
    title: 'Github',
    icon: Github,
    href: 'https://github.com/dodocie',
    className: 'hover:bg-[#171715] hover:text-white',
  },
  // {
  //   title: '邮箱',
  //   icon: AtSignIcon,
  //   href: 'mailto:dodocie@gmail.com',
  //   className: 'hover:bg-[#e86125] hover:text-white',
  // },
  {
    title: 'Juejin',
    icon: Juejin,
    href: 'https://juejin.cn/user/1327865776327544',
    className: 'hover:bg-[#1E80FF] text-[#1E80FF] hover:text-white',
  },
]

const Social = () => {
  return (
    <div className="w-full flex items-center justify-end">
      {LIST.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          title={item.title}
          className={`block p-2 rounded-full text-gray-600 transition-colors ${item.className}`}
        >
          <item.icon />
        </Link>
      ))}
    </div>
  )
}

export default Social
