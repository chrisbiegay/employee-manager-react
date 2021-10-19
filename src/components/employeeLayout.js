import Link from "next/link"
import Head from "next/head"
import React from "react"

export default function EmployeeLayout({ children, pageTitle }) {
  return (
    <>
      <Head>
        <title>{pageTitle} - Next.js/React App</title>
      </Head>
      <header className="nav-bar">
        <Link href="/employees/list"><a className="nav-bar__link">List Employees</a></Link>
        <Link href="/employees/create"><a className="nav-bar__link">Create Employee</a></Link>
      </header>
      <main>{children}</main>
    </>
  )
}