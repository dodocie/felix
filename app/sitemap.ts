import { MetadataRoute } from 'next'
import { compareDesc } from 'date-fns'
import { allBlogs, allEssays } from 'contentlayer/generated'

export default function sitemap(): MetadataRoute.Sitemap {
  const allPost = [...allBlogs, ...allEssays]
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .map((item) => ({
      url: `https://xxx${item.url}`,
      lastModified: new Date(),
    }))

  return [
    {
      url: 'https://xxx',
      lastModified: new Date(),
    },
    ...allPost,
  ]
}
