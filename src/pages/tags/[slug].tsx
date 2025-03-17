import React from 'react'

import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';

import { ParsedUrlQuery } from 'querystring';

import { getPostsByTag } from '@/api/utils'
import { Post } from '../../types/post';

import Thumbnail from '../../components/Thumbnail';
import Header from '../../components/Header';


type Props = {
    posts: Post[]
}

const ByTagsPage = ({ posts }: Props) => {
    return (
        <>
            <Header />
            <div>
                {posts.map((post) => (
                    <article key={post.slug}>
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
                        {post.thumbnail && <Thumbnail title={post.title} src={post.thumbnail} />}
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