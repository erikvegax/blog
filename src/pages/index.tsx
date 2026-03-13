import React from 'react'
import type { NextPage } from 'next'

import Header from '../components/Header'

import styles from '../styles/Page.module.css'

type Props = {}

const tile = [
  '#   +   *   +   #   +   *   +   #   +   *   +   #   +   *   +   #   +   *   +   #   +   *',
  ' \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ /',
  '  .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .',
  ' / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\',
].join('\n')

const mobileTile = [
  '#   +   *   +   #   +   *   +   #   +   *   +',
  ' \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ /',
  '  .   .   .   .   .   .   .   .   .   .   .',
  ' / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\',
].join('\n')

const asciiArt = '\n' + Array(16).fill(tile).join('\n') + '\n'
const mobileAsciiArt = '\n' + Array(14).fill(mobileTile).join('\n') + '\n'

const Home: NextPage<Props> = () => {
  return (
    <>
      <div className={styles.flex}>
        <Header />
        <div className={styles.asciiContainer}>
          <div className={styles.ascii}>
            <pre className={styles.fullArt}>{asciiArt}</pre>
            <pre className={styles.mobileArt}>{mobileAsciiArt}</pre>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
