require("dotenv").config()

const utils = require("../src/utils")
const fetch = require("node-fetch")

const { ENDPOINT, TARGET_ADDRESS, ASSET_ID } = process.env

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

test("mint token with proper body", async () => {
  const body = {
    asset_id: ASSET_ID,
    to: TARGET_ADDRESS,
    value: 10.5,
  }
  const stringifyBody = JSON.stringify(body)
  const statusCode = await mintToken(
    stringifyBody,
    utils.genHeader(stringifyBody)
  )
  expect(statusCode).toBe(202)
})

test("mint token with improper body", async () => {
  const body = {
    asset_id: ASSET_ID,
    to: TARGET_ADDRESS,
    value: 10.5,
  }
  const stringifyBody = JSON.stringify(body)
  const statusCode = await mintToken(
    stringifyBody,
    utils.genHeader(`improper header${stringifyBody}`)
  )
  expect(statusCode).toBe(401)
})

test("mint token with wrong asset id", async () => {
  const body = {
    asset_id: ASSET_ID + 0,
    to: TARGET_ADDRESS,
    value: 10.5,
  }
  const stringifyBody = JSON.stringify(body)
  const statusCode = await mintToken(
    stringifyBody,
    utils.genHeader(`${stringifyBody}`)
  )

  // TODO: it should be 404 after wayne modify gene's server
  // expect(statusCode).toBe(404)
  expect(statusCode).toBe(500)
})
