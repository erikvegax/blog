import React from 'react'
import Link from 'next/link';
import styles from '../../styles/Header.module.css'

const Header = () => {
    return (
        <header className={styles.header}>
            <div className="row">
                <div className={`${styles["header__content"]} column`}>
                    <h1 className={styles["header__logotext"]}>
                        <a>erik</a>
                    </h1>
                </div>
            </div>
            <nav className={styles["header__nav-wrap"]}>
                <div className="row">
                    <ul className={styles["header__nav"]}>
                        <li>
                            <Link href="/">home</Link>
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