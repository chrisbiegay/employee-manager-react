import EmployeeLayout from "../../features/employees/employeeLayout"
import React, { useState } from 'react';

export default function CreateEmployee() {
  const [name, setName] = useState("")
  const [department, setDepartment] = useState("")
  const [message, setMessage] = useState("")
  const [messageStyle, setMessageStyle] = useState("")

  function updateName(event) {
    setName(event.target.value)
  }

  function updateDepartment(event) {
    setDepartment(event.target.value)
  }

  async function createEmployee(event) {
    event.preventDefault()
    setMessage("")
    setMessageStyle("")

    const response = await fetch("/api/employees",
      {
        method: "POST",
        body: JSON.stringify({name, department}),
      });

    if (response.status === 201) {
      setName("")
      setDepartment("")
      setMessage(`Employee "${name}" created`)
      setMessageStyle("success-message")
    } else {
      setMessage(`Employee "${name}" could not be created`)
      setMessageStyle("failure-message")
    }
  }

  return (
    <EmployeeLayout pageTitle="Create Employee">
      <h1>Create Employee</h1>
      <form onSubmit={createEmployee}>
        <div className="row">
          <div className="two columns"><label htmlFor="name">Name:</label></div>
          <div className="ten columns">
            <input type="text" name="name" value={name} onChange={updateName} />
          </div>
        </div>
        <div className="row">
          <div className="two columns"><label htmlFor="department">Department:</label></div>
          <div className="ten columns">
            <input type="text" name="department" value={department} onChange={updateDepartment} />
          </div>
        </div>
        <div className="row">
          <div className="two columns"><input type="submit" value="Create Employee" /></div>
          <div className="ten columns">
            <span className={messageStyle}>{message}</span>
          </div>
        </div>
      </form>
    </EmployeeLayout>
  )
}
