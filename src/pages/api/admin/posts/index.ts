import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { getAllPostsAdmin } from '@/api/utils'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ error: 'forbidden' })
  }

  if (req.method === 'GET') {
    return res.status(200).json(getAllPostsAdmin())
  }

  if (req.method === 'POST') {
    const { title, description, date, tags: tagsStr, content, images = [] } = req.body

    if (!title) return res.status(400).json({ error: 'title required' })

    const slug = generateSlug(title)
    const assetsDir = path.join(process.cwd(), 'public', 'assets', slug)

    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true })
    }

    // Write uploaded images (sent as base64)
    const imageList: Array<{ name: string; data: string }> = images
    for (const img of imageList) {
      const base64Data = img.data.replace(/^data:[^;]+;base64,/, '')
      const buffer = Buffer.from(base64Data, 'base64')
      fs.writeFileSync(path.join(assetsDir, img.name), buffer)
    }

    const tagsArray: string[] = tagsStr
      ? tagsStr.split(',').map((t: string) => t.trim()).filter(Boolean)
      : []

    const thumbnail = imageList[0] ? `/assets/${slug}/${imageList[0].name}` : ''

    const frontMatterLines = [
      '---',
      `date: "${date}"`,
      `title: ${title}`,
      `description: ${description}`,
      `tags: [${tagsArray.map(t => `"${t}"`).join(', ')}]`,
      thumbnail ? `thumbnail: ${thumbnail}` : null,
      '---',
    ].filter(Boolean).join('\n')

    const mdxContent = `${frontMatterLines}\n\n${content}\n`
    const postPath = path.join(process.cwd(), 'src', '_posts', `${slug}.mdx`)
    fs.writeFileSync(postPath, mdxContent, 'utf-8')

    return res.status(200).json({ slug })
  }

  return res.status(405).json({ error: 'method not allowed' })
}
