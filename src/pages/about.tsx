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
            <div>
                <article>
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