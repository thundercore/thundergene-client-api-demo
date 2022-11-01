require("dotenv").config()

const utils = require("../src/utils")
const fetch = require("node-fetch")

const { ENDPOINT, ASSET_ID } = process.env
let from

beforeAll(async () => {
  from = await createUser()
})

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
    const stringifyBody = JSON.stringify(body)
    const response = await fetch(`${ENDPOINT}/api/v1/client/redeem/create`, {
      method: "post",
      // headers: utils.genHeader(stringifyBody),
      headers,
      body,
    })
    return response.status
  } catch (error) {
    return error
  }
}

test("create redeem code with proper body", async () => {
  const body = {
    from,
    redeem_assets: [
      {
        asset_id: ASSET_ID,
        value: 1,
      },
    ],
  }

  const stringifyBody = JSON.stringify(body)
  const statusCode = await createRedeemCode(
    stringifyBody,
    utils.genHeader(stringifyBody)
  )
  expect(statusCode).toBe(202)
})

test("create redeem code with missing infos", async () => {
  const body = {
    from,
    // redeem_assets: [
    //   {
    //     asset_id: ASSET_ID,
    //     value: 1,
    //   },
    // ],
  }

  const stringifyBody = JSON.stringify(body)
  const statusCode = await createRedeemCode(
    stringifyBody,
    utils.genHeader(stringifyBody)
  )
  expect(statusCode).toBe(400)
})

test("create redeem code with improper body", async () => {
  const body = {
    from,
    redeem_assets: [
      {
        asset_id: ASSET_ID,
        value: 1,
      },
    ],
  }

  const stringifyBody = JSON.stringify(body)
  const statusCode = await createRedeemCode(
    stringifyBody,
    utils.genHeader(`improper body ${stringifyBody}`)
  )
  expect(statusCode).toBe(401)
})
