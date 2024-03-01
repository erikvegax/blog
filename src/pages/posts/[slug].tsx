import React from 'react'

import { GetStaticProps, GetStaticPaths } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

import { ParsedUrlQuery } from 'querystring';

import { getAllPosts, getPost } from '../../api/utils';
import { Post } from '../../types/post';

import Thumbnail from '../../components/Thumbnail';
import Header from '../../components/Header';

import styles from '../../styles/Page.module.css'
import Tags from '../../components/Tags';


type Props = {
    source: MDXRemoteSerializeResult,
    frontMatter: Omit<Post, 'slug'>;
}

const PostPage = ({ source, frontMatter }: Props) => {
    return (
        <>
            <Header />
            <div className={styles.content}>
                <div className='row'>
                    <div className={`${styles["content__main"]} large-8 column`}>
                        <article className={styles.entry}>
                            <header className={styles["entry__header"]}>
                                <h2 className={`${styles["entry__title"]} h1`}>
                                    {frontMatter.title}
                                </h2>
                                <div className={styles["entry__meta"]}>
                                    <ul>
                                        <li>{frontMatter.date}</li>
                                    </ul>
                                </div>
                            </header>
                            {frontMatter.thumbnail && <Thumbnail title={frontMatter.title} src={frontMatter.thumbnail} />}
                            <div className={styles["entry__content"]}>
                                <MDXRemote {...source} />
                            </div>
                            <Tags tags={frontMatter.tags} />
                        </article>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PostPage

interface Params extends ParsedUrlQuery {
    slug: string
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { slug } = context.params as Params;
    // get the slug
    const { content, data } = getPost(slug);
    // serialize the data on the server side
    const mdxSource = await serialize(content, { scope: data });
    return {
        props: {
            source: mdxSource,
            frontMatter: data
        }
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    //only get the slug from posts 
    const posts = getAllPosts(['slug']);

    // map through to return post paths
    const paths = posts.map((post) => ({
        params: {
            slug: post.slug
        }
    }));

    return {
        paths,
        fallback: false
    }
}