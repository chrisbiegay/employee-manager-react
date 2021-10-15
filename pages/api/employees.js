// https://nextjs.org/docs/api-routes/introduction

import * as employeePersistence from "../../lib/employeePersistence"

export default function handler(req, res) {
  if (req.method.toUpperCase() === "POST") {
    create(req, res)
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} not allowed`)
  }
}

function create(req, res) {
  employeePersistence.create(req.body)
  res.status(201).end("Created")
}
