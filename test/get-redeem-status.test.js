require("dotenv").config()

const utils = require("../src/utils")
const fetch = require("node-fetch")

const { ENDPOINT, ASSET_ID } = process.env
let from, redeemTaskId, body, stringifyBody

beforeAll(async () => {
  from = await createUser()
  body = {
    asset_id: ASSET_ID,
    to: from,
    value: 10.5,
  }
  stringifyBody = JSON.stringify(body)
  await mintToken(stringifyBody, utils.genHeader(stringifyBody))
  body = {
    from,
    redeem_assets: [
      {
        asset_id: ASSET_ID,
        value: 1,
      },
    ],
  }
  stringifyBody = JSON.stringify(body)
  redeemTaskId = await createRedeemCode(
    stringifyBody,
    utils.genHeader(stringifyBody)
  )
})

async function mintToken(body, headers) {
  try {
    const response = await fetch(`${ENDPOINT}/api/v1/client/asset/mint`, {
      method: "post",
      headers,
      body,
    })
    const data = await response.json()
    await utils.waitTask(data.id)
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

async function createRedeemCode(body, headers) {
  try {
    const response = await fetch(`${ENDPOINT}/api/v1/client/redeem/create`, {
      method: "post",
      headers,
      body,
    })
    const data = await response.json()
    return data.id
  } catch (error) {
    return error
  }
}

async function getRedeemStatus(id, headers) {
  const path = "/api/v1/client/redeem/status"
  const response = await fetch(`${ENDPOINT}${path}/?redeem_id=${id}`, {
    method: "get",
    headers,
    // headers: genHeader(""),
  })
  return response.status
}

test("get redeem status with proper header", async () => {
  const statusCode = await getRedeemStatus(redeemTaskId, utils.genHeader(""))
  expect(statusCode).toBe(200)
})

test("get redeem status with improper header", async () => {
  const statusCode = await getRedeemStatus(
    redeemTaskId,
    utils.genHeader("improper header")
  )
  expect(statusCode).toBe(401)
})
