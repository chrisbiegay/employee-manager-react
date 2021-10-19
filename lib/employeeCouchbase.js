import * as couchbase from "couchbase"

const BUCKET_NAME = "employees"
const MAX_EMPLOYEE_ID_DOC_ID = "employee_metadata::maxId"

// Should only be referenced from lazy-loading accessor methods
const couchbaseClient = {
  cluster: null,
  employeesBucket: null,
  defaultCollection: null,
}

export async function fetchAllEmployees() {
  const cluster = await couchbaseCluster()

  // Should improve the way this query targets employee documents, e.g. to ignore the "maxId" document.
  // Possibly add a "type" property to the documents and index it, etc.
  let result = await cluster.query(
    `select employees.* from ${BUCKET_NAME} where meta().id >= "employee::" and meta().id <= "employee_"`)
  return result.rows
}

export async function createEmployee({name, department}) {
  // Couchbase transactions are not available with the Javascript API :(

  const nextEmployeeId = await getNextEmployeeId()
  const collection = await defaultCollection()

  await collection.insert(employeeIdToDocumentId(nextEmployeeId), JSON.stringify(
    {
      id: nextEmployeeId,
      name,
      department,
    }
  ))
}

export async function deleteEmployee(employeeId) {
  const collection = await defaultCollection()

  // needs error handling
  return collection.remove(employeeIdToDocumentId(employeeId))
}

/**
 * Get the singleton Couchbase client for the cluster.
 *
 * Lazily loaded since the standard Next.js server doesn't seem to have a hook for executing custom
 * server code at startup.
 */
async function couchbaseCluster() {
  if (!couchbaseClient.cluster) {
    couchbaseClient.cluster = await couchbase.connect('couchbase://localhost', {
      username: 'employees-app',
      password: 'password',       // just an experimental app
    })
    console.log("Couchbase client initialized")
  }

  return couchbaseClient.cluster
}

/**
 * Get the employees bucket.
 */
async function employeesBucket() {
  if (!couchbaseClient.employeesBucket) {
    const cluster = await couchbaseCluster()
    const buckets = await cluster.buckets().getAllBuckets()
    if (!buckets.find(bucket => bucket.name === BUCKET_NAME)) {
      console.error(`FATAL: No Couchbase bucket named "${BUCKET_NAME}" found`)
      throw "INVALID_COUCHBASE_STATE"
    }

    couchbaseClient.employeesBucket = cluster.bucket(BUCKET_NAME)
  }

  return couchbaseClient.employeesBucket
}

/**
 * Get the default collection in the default scope for the employees bucket.
 */
async function defaultCollection() {
  if (!couchbaseClient.defaultCollection) {
    const bucket = await employeesBucket()
    couchbaseClient.defaultCollection = bucket.defaultCollection()
  }

  return couchbaseClient.defaultCollection
}

function employeeIdToDocumentId(employeeId) {
  return `employee::${employeeId}`
}

/**
 * Increment and return the maximum employee ID.
 */
async function getNextEmployeeId() {
  try {
    // ideally do this in a loop in case there's a CAS mismatch

    const collection = await defaultCollection()
    const maxIdResult = await collection.get(MAX_EMPLOYEE_ID_DOC_ID)

    // why does this sometimes return a JSON string and sometimes an object?
    const maxIdDoc = typeof maxIdResult.content === "string" ? JSON.parse(maxIdResult.content) : maxIdResult.content

    maxIdDoc.maxEmployeeId = maxIdDoc.maxEmployeeId + 1

    await collection.replace(MAX_EMPLOYEE_ID_DOC_ID, maxIdDoc, { cas: maxIdResult.cas })
    return maxIdDoc.maxEmployeeId
  } catch (e) {
    if (e.hasOwnProperty("name") && e.name === "DocumentNotFoundError") {
      const nextEmployeeId = 1
      await createMaxIdDoc(nextEmployeeId)
      return nextEmployeeId
    } else {
      throw e
    }
  }
}

/**
 * Create the Couchbase doc which tracks the maximum employee ID.
 */
async function createMaxIdDoc(maxId) {
  const collection = await defaultCollection()
  return collection.insert(MAX_EMPLOYEE_ID_DOC_ID, JSON.stringify(
    {
      maxEmployeeId: maxId,
    }
  ))
}
