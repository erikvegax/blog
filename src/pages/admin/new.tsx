import React, { useState, useRef, useCallback } from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '@/styles/Admin.module.css'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function todayFormatted(): string {
  return new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
  })

const NewPost: NextPage = () => {
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(todayFormatted)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [content, setContent] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const slug = generateSlug(title)

  const insertText = useCallback(
    (before: string, after = '') => {
      const ta = textareaRef.current
      if (!ta) return
      const start = ta.selectionStart
      const end = ta.selectionEnd
      const selected = content.substring(start, end)
      const newContent =
        content.substring(0, start) + before + selected + after + content.substring(end)
      setContent(newContent)
      setTimeout(() => {
        ta.focus()
        ta.setSelectionRange(
          start + before.length,
          start + before.length + selected.length
        )
      }, 0)
    },
    [content]
  )

  const insertImage = useCallback(
    (file: File) => {
      const currentSlug = generateSlug(title)
      const markdown = `![${file.name}](/assets/${currentSlug}/${file.name})`
      const ta = textareaRef.current
      const pos = ta ? ta.selectionStart : content.length
      const newContent =
        content.substring(0, pos) + '\n' + markdown + '\n' + content.substring(pos)
      setContent(newContent)
      setTimeout(() => ta?.focus(), 0)
    },
    [content, title]
  )

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tag = tagInput.trim().replace(/,$/, '')
      if (tag && !tags.includes(tag)) {
        setTags(prev => [...prev, tag])
      }
      setTagInput('')
    }
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('title is required')
      return
    }
    setSubmitting(true)
    setError('')

    try {
      const encodedImages = await Promise.all(
        images.map(async img => ({
          name: img.name,
          data: await toBase64(img),
        }))
      )

      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          date,
          tags: tags.join(','),
          content,
          images: encodedImages,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'failed to create post')

      // deploy: commit + push
      const deployRes = await fetch('/api/admin/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `post: ${data.slug}` }),
      })
      const deployData = await deployRes.json()
      if (!deployRes.ok) throw new Error(deployData.error || 'post created but deploy failed')

      router.push('/admin')
    } catch (e: any) {
      setError(e.message)
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/admin" className={styles.back}>← admin</Link>
          <h1>new post</h1>
        </div>
      </div>

      <div className={styles.form}>
        <div className={styles.field}>
          <label>title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className={styles.input}
            placeholder="my post title"
          />
          {slug && <span className={styles.slugPreview}>slug: /posts/{slug}</span>}
        </div>

        <div className={styles.field}>
          <label>date</label>
          <input
            value={date}
            onChange={e => setDate(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label>description</label>
          <input
            value={description}
            onChange={e => setDescription(e.target.value)}
            className={styles.input}
            placeholder="a short description"
          />
        </div>

        <div className={styles.field}>
          <label>tags</label>
          {tags.length > 0 && (
            <div className={styles.tagContainer}>
              {tags.map(tag => (
                <span key={tag} className={styles.tag}>
                  {tag}
                  <button
                    onClick={() => setTags(prev => prev.filter(t => t !== tag))}
                    className={styles.tagRemove}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className={styles.input}
            placeholder="type a tag, press enter or comma to add"
          />
        </div>

        <div className={styles.field}>
          <label>images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className={styles.fileInput}
          />
          {images.length > 0 && (
            <div className={styles.imagePreviews}>
              {images.map((img, i) => (
                <div key={i} className={styles.imagePreview}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={URL.createObjectURL(img)} alt={img.name} />
                  <div className={styles.imageActions}>
                    <button onClick={() => insertImage(img)} className={styles.btnSmall}>
                      insert
                    </button>
                    <button onClick={() => removeImage(i)} className={styles.btnSmall}>
                      ×
                    </button>
                  </div>
                  <span className={styles.imageName}>{img.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.field}>
          <label>content</label>
          <div className={styles.toolbar}>
            <button
              onClick={() => insertText('**', '**')}
              className={styles.toolbarBtn}
              title="bold"
            >
              <strong>b</strong>
            </button>
            <button
              onClick={() => insertText('*', '*')}
              className={styles.toolbarBtn}
              title="italic"
            >
              <em>i</em>
            </button>
            <button
              onClick={() => insertText('`', '`')}
              className={styles.toolbarBtn}
              title="inline code"
            >
              {`\``}
            </button>
            <button
              onClick={() => insertText('\n```\n', '\n```')}
              className={styles.toolbarBtn}
              title="code block"
            >
              {`</>`}
            </button>
            <button
              onClick={() => insertText('[', '](url)')}
              className={styles.toolbarBtn}
              title="link"
            >
              link
            </button>
            <button
              onClick={() => insertText('\n## ', '')}
              className={styles.toolbarBtn}
              title="heading"
            >
              h2
            </button>
            <button
              onClick={() => insertText('\n### ', '')}
              className={styles.toolbarBtn}
              title="subheading"
            >
              h3
            </button>
          </div>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={e => setContent(e.target.value)}
            className={styles.textarea}
            placeholder="write your post here..."
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button onClick={handleSubmit} disabled={submitting} className={styles.btn}>
          {submitting ? 'publishing...' : 'publish post'}
        </button>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  if (process.env.NODE_ENV !== 'development') {
    return { redirect: { destination: '/', permanent: false } }
  }
  return { props: {} }
}

export default NewPost
