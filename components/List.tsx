import Link from 'next/link'
import { format } from 'date-fns'

export interface ListProps {
  data: any[]
  className?: string
}

const List = ({ data, className }: ListProps) => {
  return (
    <ul className={className}>
      {data.map((item) => (
        <li
          key={item.date}
          className="py-2 rounded-md transition-colors md:hover:bg-teal-600/20 md:dark:hover:bg-slate-600/25"
        >
          <Link href={item.url} className="flex items-center justify-between space-x-2">
            <span className="flex-grow text-slate-800 dark:text-sky-300 line-clamp-1">{item.title}</span>
            <span className="flex-shrink-0 text-sm text-slate-500">
              {format(new Date(item.date), 'yyyy-MM-dd')}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default List
