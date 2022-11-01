require("dotenv").config();

const utils = require("./utils");
const fetch = require("node-fetch");

const { ENDPOINT, TARGET_ADDRESS } = process.env;

async function main() {
  const body = {
    from: TARGET_ADDRESS,
    message: "This is message",
  };

  const stringifyBody = JSON.stringify(body);
  const response = await fetch(`${ENDPOINT}/api/v1/client/sign`, {
    method: "post",
    headers: utils.genHeader(stringifyBody),
    body: stringifyBody,
  });

  const data = await response.json();
  console.log(data);
}

main().catch((e) => console.log(e));
