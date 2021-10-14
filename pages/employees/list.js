import EmployeeLayout from "../../components/employeeLayout"

export default function ListEmployees() {
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
          <tr>
              <td>0</td>
              <td>Static Test</td>
              <td>Engineering</td>
              <td>
                  <a href="">Delete</a>
              </td>
          </tr>
      </table>
    </EmployeeLayout>
  )
}
