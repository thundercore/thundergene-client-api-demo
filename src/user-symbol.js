require("dotenv").config();

const utils = require("./utils");
const fetch = require("node-fetch");

const { ENDPOINT, TARGET_ADDRESS, SYMBOL } = process.env;

async function main() {
  const response = await fetch(
    `${ENDPOINT}/api/v1/client/user/asset?symbol=${SYMBOL}&address=${TARGET_ADDRESS}`,
    {
      method: "get",
      headers: utils.genHeader(""),
    }
  );

  const data = await response.json();
  console.log(`User balance of asset: ${SYMBOL} = ${JSON.stringify(data)}`);
}

main().catch((e) => console.log(e));
