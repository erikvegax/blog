import React from 'react';

import Link from 'next/link';


type Props = {
    tags: string[],
}

const Tags = ({ tags }: Props) => {
    return (
        <div>
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