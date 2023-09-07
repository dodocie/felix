import { MetadataRoute } from 'next'
import { compareDesc } from 'date-fns'
import { allBlogs, allEssays } from 'contentlayer/generated'

export default function sitemap(): MetadataRoute.Sitemap {
  const allPost = [...allBlogs, ...allEssays]
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .map((item) => ({
      url: `https://kiera.site${item.url}`,
      lastModified: new Date(),
    }))

  return [
    {
      url: 'https://kiera.site',
      lastModified: new Date(),
    },
    ...allPost,
  ]
}
