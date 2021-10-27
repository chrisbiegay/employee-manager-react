import * as couchbase from "couchbase"

const BUCKET_NAME = "employees"
const MAX_EMPLOYEE_ID_DOC_ID = "employee_metadata::maxId"

// initCouchbase() must execute and resolve before referencing couchbaseClient.
const couchbaseClient = {
  cluster: null,
  employeesBucket: null,
  defaultCollection: null,
}

export async function fetchAllEmployees() {
  // The standard Next.js server doesn't seem to have a hook for executing custom server code at startup,
  // so calling initCouchbase() for each API function.
  await initCouchbase()

  // Should improve the way this query targets employee documents, e.g. to ignore the "maxId" document.
  // Possibly add a "type" property to the documents and index it, etc.
  let result = await couchbaseClient.cluster.query(
    `select employees.* from ${BUCKET_NAME} where meta().id >= "employee::" and meta().id <= "employee_"`)
  return result.rows
}

export async function createEmployee({name, department}) {
  await initCouchbase()

  // Couchbase transactions are not available with the Javascript API :(

  const nextEmployeeId = await getNextEmployeeId()

  await couchbaseClient.defaultCollection.insert(employeeIdToDocumentId(nextEmployeeId), JSON.stringify(
    {
      id: nextEmployeeId,
      name,
      department,
    }
  ))
}

export async function deleteEmployee(employeeId) {
  await initCouchbase()

  // needs error handling
  return couchbaseClient.defaultCollection.remove(employeeIdToDocumentId(employeeId))
}

/**
 * Connect to Couchbase and initialize the couchbaseClient object.
 */
async function initCouchbase() {
  if (!couchbaseClient.cluster) {
    const host = process.env.EMPLOYEE_CB_HOST || 'localhost'
    const username = process.env.EMPLOYEE_CB_USERNAME || 'employees-app'
    const password = process.env.EMPLOYEE_CB_PASSWORD || 'password'

    couchbaseClient.cluster = await couchbase.connect(`couchbase://${host}`, {
      username,
      password,
    })
  }

  if (!couchbaseClient.employeesBucket) {
    const buckets = await couchbaseClient.cluster.buckets().getAllBuckets()
    if (!buckets.find(bucket => bucket.name === BUCKET_NAME)) {
      console.error(`FATAL: No Couchbase bucket named "${BUCKET_NAME}" found`)
      throw "INVALID_COUCHBASE_STATE"
    }

    couchbaseClient.employeesBucket = await couchbaseClient.cluster.bucket(BUCKET_NAME)
    couchbaseClient.defaultCollection = await couchbaseClient.employeesBucket.defaultCollection()
    console.log("Couchbase client initialized")
  }
}

function employeeIdToDocumentId(employeeId) {
  return `employee::${employeeId}`
}

/**
 * Increment and return the maximum employee ID.
 */
async function getNextEmployeeId() {
  await initCouchbase()

  try {
    // ideally do this in a loop in case there's a CAS mismatch

    const maxIdResult = await couchbaseClient.defaultCollection.get(MAX_EMPLOYEE_ID_DOC_ID)

    // why does this sometimes return a JSON string and sometimes an object?
    const maxIdDoc = typeof maxIdResult.content === "string" ? JSON.parse(maxIdResult.content) : maxIdResult.content

    maxIdDoc.maxEmployeeId = maxIdDoc.maxEmployeeId + 1

    await couchbaseClient.defaultCollection.replace(MAX_EMPLOYEE_ID_DOC_ID, maxIdDoc, { cas: maxIdResult.cas })
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
  await initCouchbase()
  return couchbaseClient.defaultCollection.insert(MAX_EMPLOYEE_ID_DOC_ID, JSON.stringify(
    {
      maxEmployeeId: maxId,
    }
  ))
}
