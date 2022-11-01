require("dotenv").config()

const utils = require("../src/utils")
const fetch = require("node-fetch")

const { ENDPOINT, ASSET_ID } = process.env
let from, to

async function transferToken(body, headers) {
  try {
    // const body = {
    //   asset_id: ASSET_ID,
    //   from: TARGET_ADDRESS,
    //   to: TARGET_ADDRESS2,
    //   value: 1,
    // }

    // const stringifyBody = JSON.stringify(body)
    const response = await fetch(`${ENDPOINT}/api/v1/client/asset/transfer`, {
      method: "post",
      headers,
      // headers: utils.genHeader(stringifyBody),
      body,
    })

    return response.status
  } catch (error) {
    return error
  }
}

async function mintToken(body, headers) {
  try {
    const response = await fetch(`${ENDPOINT}/api/v1/client/asset/mint`, {
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
  from = await createUser()
  to = await createUser()

  const body = {
    asset_id: ASSET_ID,
    to: from,
    value: 100.5,
  }

  const stringifyBody = JSON.stringify(body)

  await mintToken(stringifyBody, utils.genHeader(stringifyBody))
})

test("transfer with proper body", async () => {
  const body = {
    asset_id: ASSET_ID,
    from,
    to,
    value: 1,
  }

  const stringifyBody = JSON.stringify(body)
  const statusCode = await transferToken(
    stringifyBody,
    utils.genHeader(stringifyBody)
  )
  expect(statusCode).toBe(202)
})

test("transfer with improper asset id", async () => {
  const body = {
    asset_id: ASSET_ID + "0",
    from,
    to,
    value: 1,
  }

  const stringifyBody = JSON.stringify(body)
  const statusCode = await transferToken(
    stringifyBody,
    utils.genHeader(stringifyBody)
  )
  // TODO: it should be 404 after wayne modify gene's server
  // expect(statusCode).toBe(404)
  expect(statusCode).toBe(500)
})

test("transfer with improper header ", async () => {
  const body = {
    asset_id: ASSET_ID,
    from,
    to,
    value: 1,
  }

  const stringifyBody = JSON.stringify(body)
  const statusCode = await transferToken(
    stringifyBody,
    utils.genHeader(`improper header ${stringifyBody}`)
  )
  // TODO: it should be 404 after wayne modify gene's server
  // expect(statusCode).toBe(404)
  expect(statusCode).toBe(401)
})
