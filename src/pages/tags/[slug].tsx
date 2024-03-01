import React from 'react'

import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';

import { ParsedUrlQuery } from 'querystring';

import { getPostsByTag } from '@/api/utils'
import { Post } from '../../types/post';

import Thumbnail from '../../components/Thumbnail';
import Header from '../../components/Header';

import styles from '@/styles/Page.module.css'


type Props = {
    posts: Post[]
}

const ByTagsPage = ({ posts }: Props) => {
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
                                {post.thumbnail && <Thumbnail title={post.title} src={post.thumbnail} />}
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

export default ByTagsPage

interface Params extends ParsedUrlQuery {
    slug: string
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { slug } = context.params as Params;

    const posts = getPostsByTag(slug, [
        'title',
        'slug',
        'date',
        'description',
        'thumbnail',
        'tags'
    ]);

    return {
        props: {
            posts: posts
        }
    }
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}