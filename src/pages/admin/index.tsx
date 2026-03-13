import React, { useState, useEffect } from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { AdminPost } from '@/api/utils'
import styles from '@/styles/Admin.module.css'

const AdminDashboard: NextPage = () => {
  const [posts, setPosts] = useState<AdminPost[]>([])
  const [statusMsg, setStatusMsg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/posts')
      .then(r => r.json())
      .then(data => {
        setPosts(data)
        setLoading(false)
      })
  }, [])

  const deploy = async (message: string) => {
    setStatusMsg('deploying...')
    const res = await fetch('/api/admin/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    const data = await res.json()
    setStatusMsg(res.ok ? data.message : `error: ${data.error}`)
  }

  const handleToggle = async (slug: string, currentlyPublished: boolean) => {
    const published = !currentlyPublished
    await fetch(`/api/admin/posts/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published }),
    })
    setPosts(prev => prev.map(p => p.slug === slug ? { ...p, published } : p))
    await deploy(published ? `publish: ${slug}` : `unpublish: ${slug}`)
  }

  const handleDelete = async (slug: string) => {
    if (!confirm(`delete "${slug}"?\n\nthis removes the post file and all its images.`)) return
    await fetch(`/api/admin/posts/${slug}`, { method: 'DELETE' })
    setPosts(prev => prev.filter(p => p.slug !== slug))
    await deploy(`delete: ${slug}`)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>admin</h1>
        <div className={styles.actions}>
          <Link href="/" className={styles.btn}>← site</Link>
          <Link href="/admin/new" className={styles.btn}>+ new post</Link>
          <button onClick={() => deploy('deploy')} className={styles.btn}>
            deploy
          </button>
        </div>
      </div>

      {statusMsg && <p className={styles.statusMsg}>{statusMsg}</p>}

      {loading ? (
        <p className={styles.statusMsg}>loading...</p>
      ) : (
        <div className={styles.postList}>
          {posts.length === 0 && <p className={styles.statusMsg}>no posts yet</p>}
          {posts.map(post => (
            <div key={post.slug} className={styles.postRow}>
              <div className={styles.postInfo}>
                <span className={styles.postTitle}>{post.title}</span>
                <span className={styles.postDate}>{post.date}</span>
                <span className={post.published ? styles.live : styles.unpublished}>
                  {post.published ? 'live' : 'unpublished'}
                </span>
              </div>
              <div className={styles.postActions}>
                <button
                  onClick={() => handleToggle(post.slug, post.published)}
                  className={styles.btnSmall}
                >
                  {post.published ? 'unpublish' : 'publish'}
                </button>
                <button
                  onClick={() => handleDelete(post.slug)}
                  className={`${styles.btnSmall} ${styles.btnDanger}`}
                >
                  delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  if (process.env.NODE_ENV !== 'development') {
    return { redirect: { destination: '/', permanent: false } }
  }
  return { props: {} }
}

export default AdminDashboard
