import React from 'react';
import styles from "../styles/Tags.module.css";

type Props = {
    tags: string[],
}

const Tags = ({ tags }: Props) => {
    return (
        <div className={`${styles["tagcloud"]} ${styles["group"]}`} >
            {
                tags.map((tag, index) => (
                    <a key={index}>{tag}</a>
                ))
            }
        </div >
    )
}

export default Tags