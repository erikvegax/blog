import type { NextApiRequest, NextApiResponse } from 'next'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ error: 'forbidden' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' })
  }

  const { message = 'update blog content' } = req.body || {}
  const cwd = process.cwd()

  try {
    // Only stage content directories, not code changes
    await execAsync('git add src/_posts/ public/assets/', { cwd })

    const { stdout: status } = await execAsync('git status --porcelain', { cwd })
    if (!status.trim()) {
      return res.status(200).json({ message: 'nothing to commit' })
    }

    await execAsync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { cwd })
    await execAsync('git push', { cwd })

    return res.status(200).json({ message: 'deployed' })
  } catch (e: any) {
    return res.status(500).json({ error: e.message })
  }
}
