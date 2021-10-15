import EmployeeLayout from "../../components/employeeLayout"
import fs from "fs"
import path from "path"


// TODO - refactor employee persistence



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
                      <a href="">Delete</a>
                  </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </EmployeeLayout>
  )
}
