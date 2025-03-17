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
                <article className={styles.entry}>
                    <Image
                        height={600}
                        width={400}
                        src={"/assets/about.jpg"}
                        alt={"aboutc picture"}
                    />
                    <div>
                        <p>
                            mental dumping ground. if you wanna reach me for any reason you can send an email to <b>erikvegax@duck.com</b>
                        </p>
                    </div>
                </article>
            </div>
        </>
    )
}

export default about