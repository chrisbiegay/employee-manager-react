import Head from 'next/head'
import Link from 'next/link'
//import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <>
      <Head>
        <title>Next.js/React App</title>
      </Head>
      <h1>Next.js/React App - Home</h1>
      <ul>
          <li>
            <Link href="/employees/list"><a>Employees</a></Link>
          </li>
      </ul>
    </>
  )
}
