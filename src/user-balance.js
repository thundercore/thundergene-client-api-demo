require("dotenv").config();

const utils = require("./utils");
const fetch = require("node-fetch");

const { ENDPOINT, TARGET_ADDRESS, ASSET_ID } = process.env;

async function main() {
  const response = await fetch(
    `${ENDPOINT}/api/v1/client/user/nft?asset_id=${ASSET_ID}&address=${TARGET_ADDRESS}`,
    {
      method: "get",
      headers: utils.genHeader(""),
    }
  );

  const data = await response.json();
  console.log(`User balance of asset: ${ASSET_ID} = ${data.balance}`);
}

main().catch((e) => console.log(e));
