import React from 'react'

import type { NextPage } from 'next'

import Header from './components/Header'

import styles from '../styles/Page.module.css'

type Props = {}

const about: NextPage<Props> = () => {
    return (
        <>
            <Header />
            <div className={styles["content"]}>
                <div className='row'>
                    <div className={`${styles["content__main"]} large-8 column`}>
                        <article className={styles["entry"]}>
                            <header className={styles["entry__header"]}>
                                <h2 className={`${styles["entry__title"]} h1`}>
                                    about
                                </h2>
                                <div className={styles["entry__meta"]}>
                                    <ul>
                                        <li>socials</li>
                                    </ul>
                                </div>
                            </header>
                            {/* <Thumbnail title={frontMatter.title} src={frontMatter.thumbnail} /> */}
                            <div className={styles["entry__content"]}>
                                content
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </>
    )
}

export default about