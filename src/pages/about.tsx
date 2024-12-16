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
                                src={"/assets/about.jpg"}
                                alt={"aboutc picture"}
                            />
                            <div className={styles["entry__content"]}>
                                <p>
                                    mental dumping ground. if you wanna reach me for any reason you can send an email to <b>erikvegax@duck.com</b>
                                </p>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </>
    )
}

export default about