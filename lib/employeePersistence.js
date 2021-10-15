import path from "path";
import fs from "fs";

const employeesFile = path.join(process.cwd(), "resources/employee-data.json")

/**
 * Add a new employee to the data store.
 */
export function create({name, department}) {
  const fileContents = fs.readFileSync(employeesFile, 'utf8')
  const employees = JSON.parse(fileContents)

  const employeeWithMaxId = employees.reduce((currentMax, thisEmployee) => {
    return thisEmployee.id > currentMax.id ? thisEmployee : currentMax
  })

  const nextId = employeeWithMaxId.id + 1

  employees.push({
    id: nextId,
    name,
    department
  })

  fs.writeFileSync(employeesFile, JSON.stringify(employees, null, 2))
}
