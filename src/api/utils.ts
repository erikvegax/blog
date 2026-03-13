import matter from 'gray-matter'
import { join } from 'path'
import fs from 'fs'

const POSTS_PATH = join(process.cwd(), 'src/_posts/')

export const screenThreshold = 815

type Items = {
  [key: string]: string
}

type Post = {
  data: { [key: string]: string }
  content: string
}

export type AdminPost = {
  slug: string
  title: string
  date: string
  description: string
  published: boolean
}

function getPostsFilePaths(): string[] {
  return fs
    .readdirSync(POSTS_PATH)
    .filter(path => /\.mdx?$/.test(path))
}

export function getPost(slug: string): Post {
  const fullPath = join(POSTS_PATH, `${slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf-8')
  const { data, content } = matter(fileContents)
  return { data, content }
}

export function getPostItems(filePath: string, fields: string[] = []): Items {
  const slug = filePath.replace(/\.mdx?$/, '')
  const { data, content } = getPost(slug)

  const items: Items = {}

  fields.forEach(field => {
    if (field === 'slug') {
      items[field] = slug
    }
    if (field === 'content') {
      items[field] = content
    }
    if (data[field]) {
      items[field] = data[field]
    }
  })

  return items
}

export function getAllPosts(fields: string[]): Items[] {
  const filePaths = getPostsFilePaths()
  const posts = filePaths
    .map(filePath => {
      const slug = filePath.replace(/\.mdx?$/, '')
      const { data } = getPost(slug)
      if ((data as Record<string, unknown>).published === false) return null
      return getPostItems(filePath, fields)
    })
    .filter((post): post is Items => post !== null)
    .sort((post1, post2) => (Date.parse(post1.date) < Date.parse(post2.date) ? 1 : -1))

  return posts
}

export function getPostsByTag(tag: string, fields: string[]): Items[] {
  const filePaths = getPostsFilePaths()
  const posts = filePaths
    .map(filePath => {
      const slug = filePath.replace(/\.mdx?$/, '')
      const { data } = getPost(slug)
      if ((data as Record<string, unknown>).published === false) return null
      return getPostItems(filePath, fields)
    })
    .filter((post): post is Items => post !== null && post.tags?.includes(tag))
    .sort((post1, post2) => (Date.parse(post1.date) < Date.parse(post2.date) ? 1 : -1))

  return posts
}

export function getAllPostsAdmin(): AdminPost[] {
  const filePaths = getPostsFilePaths()
  return filePaths
    .map(filePath => {
      const slug = filePath.replace(/\.mdx?$/, '')
      const { data } = getPost(slug)
      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        description: data.description || '',
        published: (data as Record<string, unknown>).published !== false,
      }
    })
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
}
