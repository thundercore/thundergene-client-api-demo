require("dotenv").config();

const utils = require("./utils");
const fetch = require("node-fetch");

const { ENDPOINT } = process.env;

async function main() {
  const response = await fetch(`${ENDPOINT}/api/v1/client/tokens`, {
    method: "get",
    headers: utils.genHeader(""),
  });

  const data = await response.json();
  console.log(`${JSON.stringify(data)}`);
}

main().catch((e) => console.log(e));
