import Fuse from 'fuse.js'
import { Blog, Essay, allBlogs, allEssays } from 'contentlayer/generated'

const options = {
  keys: ['title', 'tags', 'description', 'body.raw']
}

let fuse: Fuse<Blog|Essay>

export function fuzzySearch(keyword: string, articles: (Blog|Essay)[]){
  if(!fuse) fuse = new Fuse(articles, options)
  return fuse.search(keyword).map(v=>({...v.item, refIndex: v.refIndex}))
}

type Article1 = Blog | Essay 
export type Article = Article1 & {
  // refIndex: number
}

