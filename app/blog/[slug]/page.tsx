import { allBlogs } from 'contentlayer/generated'
import Article from '@/components/Article'

type Props = {
  params: { slug: string }
}

export const generateStaticParams = async () => allBlogs.map((item) => ({ slug: item.slug }))

export const generateMetadata = async ({ params }: Props) => {
  const blog = allBlogs.find((item) => item.slug === params.slug)
  if(!blog) return null
  return {
    title: `${blog.title} - Kiera's Blog`,
    description: blog.description,
    keywords: blog.tags.join(', '),
  }
}

export default async function Page({ params }: Props) {
  return <Article params={params} articles={allBlogs} />
}
