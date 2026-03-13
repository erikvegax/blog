import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ error: 'forbidden' })
  }

  const { slug } = req.query as { slug: string }
  const postPath = path.join(process.cwd(), 'src', '_posts', `${slug}.mdx`)

  if (!fs.existsSync(postPath)) {
    return res.status(404).json({ error: 'post not found' })
  }

  if (req.method === 'PATCH') {
    const { published } = req.body
    const fileContents = fs.readFileSync(postPath, 'utf-8')
    const { data, content } = matter(fileContents)
    data.published = published
    const newContents = matter.stringify(content, data)
    fs.writeFileSync(postPath, newContents, 'utf-8')
    return res.status(200).json({ slug, published })
  }

  if (req.method === 'DELETE') {
    fs.unlinkSync(postPath)

    const assetsDir = path.join(process.cwd(), 'public', 'assets', slug)
    if (fs.existsSync(assetsDir)) {
      fs.rmSync(assetsDir, { recursive: true, force: true })
    }

    return res.status(200).json({ deleted: slug })
  }

  return res.status(405).json({ error: 'method not allowed' })
}
