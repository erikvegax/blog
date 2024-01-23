import React from 'react'

import type { NextPage } from 'next'
import Image from 'next/image';

import Header from '../components/Header'

import styles from '../styles/Page.module.css'

type Props = {}

const about: NextPage<Props> = () => {
    return (
        <>
            <Header />
            <div className={styles.content}>
                <div className='row'>
                    <div className={`${styles["content__main"]} large-8 column`}>
                        <article className={styles.entry}>
                            <Image
                                height={600}
                                width={400}
                                src={"/assets/sleeping.jpg"}
                                alt={"sleeping erik"}
                            />
                            <div className={styles["entry__content"]}>
                                <p>
                                    this probably won&#39;t be very serious; i&#39;ll just post about things that have
                                    happened or things that i like.
                                </p>
                                <br />
                                <p>- erik</p>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </>
    )
}

export default about