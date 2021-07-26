import Head from 'next/head'
import Image from 'next/image'

import Footer from 'layout/Footer'
import Topics from 'elements/Topics'

import styles from 'styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>ROS Web UI</title>
        <meta name="description" content="ROS web ui nanoapp" />
        <link rel="icon" href="/robot.svg" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>bertha</h1>
        <Topics/>
      </main>
      <Footer />
    </div>
  )
}
