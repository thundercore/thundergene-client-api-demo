require("dotenv").config()

const utils = require("../src/utils")
const fetch = require("node-fetch")

const { ENDPOINT, TARGET_ADDRESS, ASSET_ID } = process.env
let REDEEM_CODE

async function createRedeemCode() {
  try {
    const body = {
      from: TARGET_ADDRESS,
      redeem_assets: [
        {
          asset_id: ASSET_ID,
          value: 100,
        },
      ],
    }

    const stringifyBody = JSON.stringify(body)
    const response = await fetch(`${ENDPOINT}/api/v1/client/redeem/create`, {
      method: "post",
      headers: utils.genHeader(stringifyBody),
      body: stringifyBody,
    })

    const data = await response.json()

    await utils.waitRedeemTask(data.id)

    const status = await utils.getRedeemStatus(data.id)

    REDEEM_CODE = status.redeem_code
  } catch (error) {
    return error
  }
}

async function claimRedeem(body, headers) {
  const response = await fetch(`${ENDPOINT}/api/v1/client/redeem`, {
    method: "post",
    headers,
    body,
  })
  return response.status
}

beforeAll(async () => {
  await createRedeemCode()
})

test("claim redeem code with improper header", async () => {
  const body = {
    to: TARGET_ADDRESS,
    code: REDEEM_CODE,
  }
  const stringifyBody = JSON.stringify(body)
  const statusCode = await claimRedeem(
    stringifyBody,
    utils.genHeader(`improper header ${stringifyBody}`)
  )
  expect(statusCode).toBe(401)
})

test("claim redeem code with wrong redeem code", async () => {
  const body = {
    to: TARGET_ADDRESS,
    code: REDEEM_CODE + "0",
  }
  const stringifyBody = JSON.stringify(body)
  const statusCode = await claimRedeem(
    stringifyBody,
    utils.genHeader(stringifyBody)
  )
  // TODO: it should be 400 after wayne modify gene's server
  // expect(statusCode).toBe(400)
  expect(statusCode).toBe(500)
})

test("claim redeem code with proper header and code", async () => {
  const body = {
    to: TARGET_ADDRESS,
    code: REDEEM_CODE,
  }
  const stringifyBody = JSON.stringify(body)
  const statusCode = await claimRedeem(
    stringifyBody,
    utils.genHeader(stringifyBody)
  )
  expect(statusCode).toBe(202)
})
