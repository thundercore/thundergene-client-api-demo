require("dotenv").config();

const utils = require("./utils");
const fetch = require("node-fetch");

const { ENDPOINT, TARGET_ADDRESS, ASSET_ID } = process.env;

async function main() {
  const body = {
    from: TARGET_ADDRESS,
    redeem_assets: [
      {
        asset_id: ASSET_ID,
        balance: [
          {
            token_id: "1",
            amount: 1,
          },
        ],
      },
    ],
  };

  const stringifyBody = JSON.stringify(body);
  const response = await fetch(`${ENDPOINT}/api/v1/client/redeem/create/nft`, {
    method: "post",
    headers: utils.genHeader(stringifyBody),
    body: stringifyBody,
  });

  const data = await response.json();

  await utils.waitRedeemTask(data.id);

  const status = await utils.getRedeemStatus(data.id);

  console.log(
    `Create redeem done, get redeem code: ${status.redeem_code}, status: ${status.status}`
  );
}

main().catch((e) => console.log(e));
