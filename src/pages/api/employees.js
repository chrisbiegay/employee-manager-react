// https://nextjs.org/docs/api-routes/introduction

import * as employeePersistence from "../../features/employees/employeePersistence"

export default function handler(req, res) {
  switch (req.method) {
    case "GET":
      return fetchAll(req, res)
    case "POST":
      return create(req, res)
    default:
      res.setHeader("Allow", ["GET", "POST"])
      res.status(405).end(`Method ${req.method} not allowed`)
  }
}

async function fetchAll(req, res) {
  const result = await employeePersistence.fetchAll()
  res.status(200).json(result)
}

async function create(req, res) {
  try {
    await employeePersistence.create(JSON.parse(req.body))
    res.status(201).end("Created")
  } catch (e) {
    if (e === "INVALID_EMPLOYEE_DATA") {
      res.status(400).end()
    } else {
      console.log(e)
      res.status(500).end()
    }
  }
}
