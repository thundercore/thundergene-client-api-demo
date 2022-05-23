require("dotenv").config();

const utils = require("./utils");
const fetch = require("node-fetch");

const { ENDPOINT } = process.env;

async function main() {
  const response = await fetch(`${ENDPOINT}/api/v1/client/user`, {
    method: "post",
    headers: utils.genHeader(""),
  });

  const data = await response.json();

  console.log(`Create user with address: ${data.address}`);
}

main().catch((e) => console.log(e));
