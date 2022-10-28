require("dotenv").config()

const utils = require("../src/utils")
const fetch = require("node-fetch")

const { ENDPOINT, ASSET_ID, PROJECT_CONTRACT_ADDRESS } = process.env
let to
const value = 1

async function claimToken(body, headers) {
  try {
    const response = await fetch(`${ENDPOINT}/api/v1/client/claim`, {
      method: "post",
      headers,
      body,
    })
    return response.status
  } catch (error) {
    return error
  }
}

async function createUser() {
  const response = await fetch(`${ENDPOINT}/api/v1/client/user`, {
    method: "post",
    headers: utils.genHeader(""),
  })

  const data = await response.json()

  return data.address
}

beforeAll(async () => {
  to = await createUser()
})

test("claim with proper body", async () => {
  const body = {
    asset_id: ASSET_ID,
    to,
    value,
  }

  const stringifyBody = JSON.stringify(body)
  const statusCode = await claimToken(
    stringifyBody,
    utils.genHeader(stringifyBody)
  )
  expect(statusCode).toBe(202)
})

test("claim with improper body", async () => {
  const body = {
    asset_id: ASSET_ID,
    to,
    value,
  }

  const stringifyBody = JSON.stringify(body)
  const statusCode = await claimToken(
    stringifyBody,
    utils.genHeader(`improper body ${stringifyBody}`)
  )
  expect(statusCode).toBe(401)
})

test("claim with with wrong asset id", async () => {
  const body = {
    asset_id: ASSET_ID + "0",
    to,
    value,
  }

  const stringifyBody = JSON.stringify(body)
  const statusCode = await claimToken(
    stringifyBody,
    utils.genHeader(stringifyBody)
  )
  // TODO: it should be 404 after wayne modify gene's server
  // expect(statusCode).toBe(404)
  expect(statusCode).toBe(500)
})
