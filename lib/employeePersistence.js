import path from "path";
import fs from "fs";

const employeesFile = path.join(process.cwd(), "resources/employee-data.json")

/**
 * Fetch all the employees from the data store.
 * @returns an array of objects with 'name' and 'department' fields.
 */
export function fetchAll() {
  const fileContents = fs.readFileSync(employeesFile, 'utf8')
  return JSON.parse(fileContents)
}

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

export function deleteEmployee(employeeId) {
  const fileContents = fs.readFileSync(employeesFile, 'utf8')
  const employees = JSON.parse(fileContents)

  const index = employees.findIndex(e => e.id === employeeId)

  if (index === -1) {
    throw "EMPLOYEE_NOT_FOUND"
  }

  employees.splice(index, 1)

  fs.writeFileSync(employeesFile, JSON.stringify(employees, null, 2))
}