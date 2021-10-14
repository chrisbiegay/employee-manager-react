import EmployeeLayout from "../../components/employeeLayout"

export default function CreateEmployee() {
  return (
    <EmployeeLayout pageTitle="Create Employee">
{/*      <div class="employee-created-message" th:if="${showEmployeeCreatedMessage}">
          Employee created
      </div>*/}

      <h1>Create Employee</h1>
      <form action="/employees" method="post">
          <div className="row">
              <div className="two columns"><label htmlFor="name">Name:</label></div>
              <div className="ten columns"><input type="text" id="name" name="name" /></div>
          </div>
          <div className="row">
              <div className="two columns"><label htmlFor="department">Department:</label></div>
              <div className="ten columns"><input type="text" id="department" name="department" /></div>
          </div>
          <input type="submit" value="Create Employee" />
      </form>
    </EmployeeLayout>
  )
}
