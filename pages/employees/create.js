import EmployeeLayout from "../../components/employeeLayout"
import React, { useState } from 'react';

export default function CreateEmployee() {
  async function createEmployee(e) {
    e.preventDefault()
    const response = await fetch("/api/employees", { method: "POST" });

    if (response.status === 201) {
      alert("Employee created")
    } else {
      alert("Employee could not be created")
    }
  }

  return (
    <EmployeeLayout pageTitle="Create Employee">
{/*      <div class="employee-created-message" th:if="${showEmployeeCreatedMessage}">
          Employee created
      </div>*/}

      <h1>Create Employee</h1>
      <CreateEmployeeForm />
    </EmployeeLayout>
  )
}

function CreateEmployeeForm() {
  const [name, setName] = useState("")
  const [department, setDepartment] = useState("")

  function updateEmployeeName(e) {
    setName(e.target.value)
  }

  function updateEmployeeDepartment(e) {
    setDepartment(e.target.value)
  }

  async function createEmployee(e) {
    e.preventDefault()
    
    const response = await fetch("/api/employees",
      {
        method: "POST",
        body: JSON.stringify({name, department}),
      });

    if (response.status === 201) {
      alert("Employee created")
    } else {
      alert("Employee could not be created")
    }
  }

  return (
    <form onSubmit={createEmployee}>
      <div className="row">
        <div className="two columns"><label htmlFor="name">Name:</label></div>
        <div className="ten columns">
          <input type="text" name="name" value={name} onChange={updateEmployeeName} />
        </div>
      </div>
      <div className="row">
        <div className="two columns"><label htmlFor="department">Department:</label></div>
        <div className="ten columns">
          <input type="text" name="department" value={department} onChange={updateEmployeeDepartment} />
        </div>
      </div>
      <input type="submit" value="Create Employee" />
    </form>
  )
}