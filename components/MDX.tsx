import { FC } from 'react'
import Image from 'next/image'
import { useMDXComponent } from 'next-contentlayer/hooks'

export interface MDXProps {
  code: string
}

const MDX: FC<MDXProps> = ({ code }) => {
  const Component = useMDXComponent(code)

  return <Component components={{ img: (props: any) => <Image alt='' {...props} /> }} />
}

export default MDX
