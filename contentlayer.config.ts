import { defineDocumentType, makeSource } from '@contentlayer/source-files';
import rehypePrettyCode from 'rehype-pretty-code';
// import rehypeImgSize from 'rehype-img-size';
import remarkGfm from 'remark-gfm';
import remarkExternalLinks from 'remark-external-links';

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: './blog/**/index.md',
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    date: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
    tags: {
      type: 'list',
      of: {
        type: 'string',
      },
      required: true,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (blog) => `/${blog._raw.sourceFileDir}`,
    },
    slug: {
      type: 'string',
      resolve: (blog) => blog._raw.sourceFileDir.replace('blog/', ''),
    },
  },
}));

export const Essay = defineDocumentType(() => ({
  name: 'Essay',
  filePathPattern: './essay/**/index.md',
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    date: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (essay) => `/${essay._raw.sourceFileDir}`,
    },
    slug: {
      type: 'string',
      resolve: (essay) => essay._raw.sourceFileDir.replace('essay/', ''),
    },
  },
}));

export default makeSource({
  contentDirPath: './content',
  documentTypes: [Blog, Essay],
  mdx: {
    rehypePlugins: [
      [rehypePrettyCode, { theme: 'github-dark' }],
      // [rehypeImgSize, { dir: 'public' }],
    ],
    remarkPlugins: [remarkGfm, remarkExternalLinks],
  },
});
