import { allEssays } from 'contentlayer/generated'
import Article from '@/components/Article'

type Props = {
  params: { slug: string }
}

export const generateStaticParams = async () => allEssays.map((item) => ({ slug: item.slug }))

export const generateMetadata = async ({ params }: Props) => {
  const essay = allEssays.find((item) => item.slug === params.slug)
  if(!essay) return null
  return {
    title: `${essay.title} - Kiera's essay`,
    description: essay.description,
    keywords: essay.tags?.join(', '),
  }
}

export default async function Page({ params }: Props) {
  return <Article params={params} articles={allEssays} />
}