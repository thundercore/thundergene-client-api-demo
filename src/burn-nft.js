require("dotenv").config();

const utils = require("./utils");
const fetch = require("node-fetch");

const { ENDPOINT, TARGET_ADDRESS, ASSET_ID } = process.env;

async function main() {
  const body = {
    asset_id: ASSET_ID,
    from: TARGET_ADDRESS,
    amount: "1",
    token_id: "1",
  };

  const stringifyBody = JSON.stringify(body);
  const response = await fetch(`${ENDPOINT}/api/v1/client/nft/burn`, {
    method: "post",
    headers: utils.genHeader(stringifyBody),
    body: stringifyBody,
  });

  const data = await response.json();

  await utils.waitTask(data.id);

  console.log(
    `Mint token done, please visit: https://explorer-testnet.thundercore.com/address/${TARGET_ADDRESS}/token-transfers for more details`
  );
}

main().catch((e) => console.log(e));
