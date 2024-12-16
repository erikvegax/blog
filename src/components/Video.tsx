import React from 'react';

import styles from "../styles/Video.module.css"

interface Props {
    url: string;
}

const Video = ({ url }: Props) => {
    return (
        <div className={styles.container}>
            <iframe
                className={styles.player}
                src={url}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>

    );
};

export default Video;