import Link from 'next/link'

export default function EmployeeHeader() {
  return (
    <div class="nav-bar">
      <Link href="list"><a class="nav-bar__link">List Employees</a></Link>
      <Link href="create"><a class="nav-bar__link">Create Employee</a></Link>
    </div>
  )
}
