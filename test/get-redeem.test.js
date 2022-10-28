require("dotenv").config()

const utils = require("../src/utils")
const fetch = require("node-fetch")

const { ENDPOINT, REDEEM_CODE } = process.env

async function getRedeem(redeemCode, headers) {
  try {
    const response = await fetch(
      `${ENDPOINT}/api/v1/client/redeem?code=${redeemCode}`,
      {
        method: "get",
        headers,
        // headers: utils.genHeader(""),
      }
    )
    return response.status
  } catch (error) {
    return error
  }
}

test("get redeem with proper header", async () => {
  const statusCode = await getRedeem(REDEEM_CODE, utils.genHeader(""))
  expect(statusCode).toBe(200)
})

test("get redeem with improper header", async () => {
  const statusCode = await getRedeem(
    REDEEM_CODE,
    utils.genHeader("improper header")
  )
  expect(statusCode).toBe(401)
})

test("get redeem with wrong redeem code", async () => {
  const statusCode = await getRedeem(REDEEM_CODE + "1", utils.genHeader(""))
  // TODO: it should be 400 after wayne modify gene's server
  // expect(statusCode).toBe(400)
  expect(statusCode).toBe(500)
})
