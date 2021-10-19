//
// Handle API requests to /api/employees/{employeeId}.
//

import * as employeePersistence from "../../../lib/employeePersistence"

export default function handler(req, res) {
  if (req.method.toUpperCase() === "DELETE") {
    return deleteEmployee(req, res)
  } else {
    res.setHeader("Allow", ["DELETE"])
    res.status(405).end(`Method ${req.method} not allowed`)
  }
}

async function deleteEmployee(req, res) {
  const employeeId = getEmployeeIdFromRequest(req)

  try {
    await employeePersistence.deleteEmployee(employeeId)
    res.status(204).end()
  } catch (e) {
    if (e === "EMPLOYEE_NOT_FOUND") {
      res.status(404).end()
    } else {
      console.error(`Error: ${e}`)
      res.status(500).end()
    }
  }
}

// Better way to do this with Next.js?
function getEmployeeIdFromRequest(req) {
  const uriParts = req.url.split("/")
  return parseInt(uriParts[uriParts.length - 1])
}
