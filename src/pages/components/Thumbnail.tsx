import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import styles from "../../styles/Thumbnail.module.css"

type Props = {
    title: string;
    src: string;
    slug?: string;
}

const Thumbnail = ({ title, src, slug }: Props) => {
    const image = (
        <div className={styles.media}>
            <Image
                height={600}
                width={1000}
                src={src}
                style={{ objectFit: "cover" }}
                alt={`${title} thumbnail`}
            />
        </div>

    );

    return (
        <>
            {slug ? (
                <Link href={`/posts/${slug}`}>
                    <a aria-label={title}>{image}</a>
                </Link>
            ) : (
                image
            )}
        </>
    )
}

export default Thumbnail