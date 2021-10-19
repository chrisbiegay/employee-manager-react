import Link from 'next/link'
import React from "react"

export default function EmployeeHeader() {
  return (
    <div className="nav-bar">
      <Link href="list"><a className="nav-bar__link">List Employees</a></Link>
      <Link href="create"><a className="nav-bar__link">Create Employee</a></Link>
    </div>
  )
}
