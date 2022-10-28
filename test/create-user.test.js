require("dotenv").config()

const utils = require("../src/utils")
const fetch = require("node-fetch")

const { ENDPOINT } = process.env

async function createUser(headers) {
  try {
    const response = await fetch(`${ENDPOINT}/api/v1/client/user`, {
      method: "post",
      headers,
    })

    return response.status
  } catch (error) {
    return error
  }
}

test("create user succ with proper header", async () => {
  const statusCode = await createUser(utils.genHeader(""))
  expect(statusCode).toBe(200)
})

test("create user failed with improper header", async () => {
  const statusCode = await createUser(utils.genHeader("improper header"))
  expect(statusCode).toBe(401)
})
