import EmployeeLayout from "../../components/employeeLayout"
import fs from 'fs'
import path from 'path'

const employeesFile = path.join(process.cwd(), "resources/employee-data.json")

export async function getServerSideProps(/* context */) {
  const fileContents = fs.readFileSync(employeesFile, 'utf8')
  const employees = JSON.parse(fileContents)

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

      <table>
          <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Actions</th>
          </tr>
          {
            employees.map(({id, name, department}) => (
              <tr>
                  <td>{id}</td>
                  <td>{name}</td>
                  <td>{department}</td>
                  <td>
                      <a href="">Delete</a>
                  </td>
              </tr>
            ))
          }
      </table>
    </EmployeeLayout>
  )
}
