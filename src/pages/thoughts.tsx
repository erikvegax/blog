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

const thoughts: NextPage<Props> = ({ posts }: Props) => {
  return (
    <>
      <Header />
      <div>
        {posts.map((post) => (
          <article key={post.slug} className={styles.entry}>
            <header>
              <h2>
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </h2>
              <div>
                <ul>
                  <li>{post.date}</li>
                </ul>
              </div>
            </header>
            <div>
              <p>
                {post.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

export default thoughts

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