require("dotenv").config();

const utils = require("./utils");
const fetch = require("node-fetch");

const { ENDPOINT, TARGET_ADDRESS, REDEEM_CODE } = process.env;

async function main() {
  const body = {
    to: TARGET_ADDRESS,
    code: REDEEM_CODE,
  };

  const stringifyBody = JSON.stringify(body);
  const response = await fetch(`${ENDPOINT}/api/v1/client/redeem`, {
    method: "post",
    headers: utils.genHeader(stringifyBody),
    body: stringifyBody,
  });

  const data = await response.json();
  await utils.waitRedeemTaskRedeemed(data.id);

  console.log(
    `Redeem task done, please visit: https://explorer-testnet.thundercore.com/address/${TARGET_ADDRESS}/token-transfers for more details`
  );
}

main().catch((e) => console.log(e));
