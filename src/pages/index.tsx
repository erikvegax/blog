import React from 'react'

import type { NextPage, GetStaticProps } from 'next'
import Link from 'next/link';
import Image from 'next/image';

import { Post } from '@/types/post'
import { getAllPosts } from "../api/utils";

import Header from '../components/Header'
import styles from "../styles/Page.module.css"

type Props = {
  posts: [Post]
}

const Home: NextPage<Props> = ({ posts }: Props) => {
  return (
    <>
      <Header />
      <div className={styles.content}>
        <div className='row'>
          <div className={`${styles["content__main"]} large-8 column`}>
            {posts.map((post) => (
              <article key={post.slug} className={styles.entry}>
                <header className={styles["entry__header"]}>
                  <h2 className={`${styles["entry__title"]} h1`}>
                    <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <div className={styles["entry__meta"]}>
                    <ul>
                      <li>{post.date}</li>
                    </ul>
                  </div>
                </header>
                {post.thumbnail &&
                  <Image
                    height={300}
                    width={300}
                    style={{ objectFit: "cover" }}
                    src={post.thumbnail}
                    alt={`thumbnail for ${post.title} post`}
                  />}
                <div className={styles["entry__content"]}>
                  <p>
                    {post.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts([
    'title',
    'slug',
    'date',
    'description',
    'thumbnail'
  ]);

  return { props: { posts } }
}