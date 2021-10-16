// https://nextjs.org/docs/api-routes/introduction

import * as employeePersistence from "../../lib/employeePersistence"

export default function handler(req, res) {
  switch (req.method) {
    case "GET":
      fetchAll(req, res)
      break
    case "POST":
      create(req, res)
      break
    default:
      res.setHeader("Allow", ["POST"])
      res.status(405).end(`Method ${req.method} not allowed`)
  }
}

function fetchAll(req, res) {
  res.status(200).json(employeePersistence.fetchAll())
}

function create(req, res) {
  try {
    employeePersistence.create(JSON.parse(req.body))
    res.status(201).end("Created")
  } catch (e) {
    if (e === "INVALID_EMPLOYEE_DATA") {
      res.status(400).end()
    } else {
      res.status(500).end()
    }
  }

}
