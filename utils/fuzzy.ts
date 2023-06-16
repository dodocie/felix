import Fuse from 'fuse.js'
import { Blog, Essay, allBlogs, allEssays } from 'contentlayer/generated'

const articles = [...allBlogs, ...allEssays]

const options = {
  keys: ['title', 'tags', 'description', 'body.raw']
}
const fuse = new Fuse(articles, options)
export function fuzzySearch(keyword: string){
  return fuse.search(keyword).map(v=>({...v.item, refIndex: v.refIndex}))
}

type Article1 = Blog | Essay 
export type Article = Article1 & {
  refIndex: number
}

