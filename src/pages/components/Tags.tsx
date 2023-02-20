import React from 'react';

import Link from 'next/link';

import styles from "../../styles/Tags.module.css";


type Props = {
    tags: string[],
}

const Tags = ({ tags }: Props) => {
    return (
        <div className={styles.tags} >
            tags:
            {
                tags.map((tag, index) => (
                    <Link key={index} href={`/tags/${tag}`}>{tag}</Link>
                ))
            }
        </div >
    )
}

export default Tags