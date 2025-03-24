import React from 'react'
import Link from 'next/link';

import styles from "../styles/Header.module.css"

const Header = () => {
    return (
        <header className={styles.header}>
            <div>
                <div>
                    <h1>
                        <Link href="/">erik</Link>
                    </h1>
                </div>
            </div>
            <nav>
                <div>
                    <ul>
                        <li>
                            <Link href="/thoughts">thoughts</Link>
                        </li>
                        <li>
                            <Link href="/about">about</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header >
    )
}

export default Header