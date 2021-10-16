import EmployeeLayout from "../../components/employeeLayout"
import * as employeePersistence from "../../lib/employeePersistence"
import React, { useState } from 'react';

// Implicitly invoked by Next.js.  Result is passed to the default function, ListEmployees.
export async function getServerSideProps(/* context */) {
  const employees = employeePersistence.fetchAll()

  return {
    props: {
      employees
    }
  }
}

export default function ListEmployees({ employees }) {
  return (
    <EmployeeLayout pageTitle="List Employees">
      <h1>Employees</h1>
      <EmployeeList employees={employees}/>
    </EmployeeLayout>
  )
}

function EmployeeList(props) {
  const [employees, setEmployees] = useState(props.employees)

  async function deleteEmployee(e, id) {
    e.preventDefault()
    const deleteResponse = await fetch(`/api/employees/${id}`, { method: "DELETE" });

    if (deleteResponse.status === 204) {
      const fetchResponse = await fetch("/api/employees")
      if (fetchResponse.status === 200) {
        const employeesJson = await fetchResponse.text()
        const updatedEmployees = JSON.parse(employeesJson)
        setEmployees(updatedEmployees)
      }
    } else {
      alert(`Employee ${id} could not be deleted`)
    }
  }

  return (
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Department</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      {
        employees.map(({id, name, department}) => (
          <tr key={id}>
            <td>{id}</td>
            <td>{name}</td>
            <td>{department}</td>
            <td>
              <a href="#" onClick={(e) => deleteEmployee(e, id)}>Delete</a>
            </td>
          </tr>
        ))
      }
      </tbody>
    </table>
  )
}
