require("dotenv").config();

const utils = require("./utils");
const fetch = require("node-fetch");

const { ENDPOINT, TARGET_ADDRESS, TARGET_ADDRESS2, ASSET_ID } = process.env;

async function main() {
  const body = {
    asset_id: ASSET_ID,
    from: TARGET_ADDRESS,
    to: TARGET_ADDRESS2,
    value: 1,
  };

  const stringifyBody = JSON.stringify(body);
  const response = await fetch(`${ENDPOINT}/api/v1/client/asset/transfer`, {
    method: "post",
    headers: utils.genHeader(stringifyBody),
    body: stringifyBody,
  });

  const data = await response.json();

  await utils.waitTask(data.id);

  console.log(
    `Transfer token done, please visit: https://explorer-testnet.thundercore.com/address/${TARGET_ADDRESS2}/token-transfers for more details`
  );
}

main().catch((e) => console.log(e));
