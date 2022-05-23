require("dotenv").config();

const utils = require("./utils");
const fetch = require("node-fetch");

const { ENDPOINT, REDEEM_CODE } = process.env;

async function main() {
  const response = await fetch(
    `${ENDPOINT}/api/v1/client/redeem?code=${REDEEM_CODE}`,
    {
      method: "get",
      headers: utils.genHeader(""),
    }
  );

  const data = await response.json();
  console.log(`Get underlying assets in redeem code: ${JSON.stringify(data)}`);
}

main().catch((e) => console.log(e));
