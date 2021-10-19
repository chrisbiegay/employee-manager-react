import * as couchbase from "./couchbase"

/**
 * Fetch all the employees from the data store.
 * @returns an array of objects with 'name' and 'department' fields.
 */
export async function fetchAll() {
  return couchbase.fetchAllEmployees()
}

/**
 * Add a new employee to the data store.
 */
export async function create({name, department}) {
  if (name === undefined || department === undefined) {
    throw "INVALID_EMPLOYEE_DATA"
  }

  return couchbase.createEmployee({name, department})
}

export async function deleteEmployee(employeeId) {
  return couchbase.deleteEmployee(employeeId)
}
