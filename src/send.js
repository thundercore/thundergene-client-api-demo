require("dotenv").config();

const utils = require("./utils");
const fetch = require("node-fetch");

const { ENDPOINT, TARGET_ADDRESS, TO_ADDRESS, DATA } = process.env;

function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

async function main() {
  const body = {
    from: TARGET_ADDRESS,
    to: TO_ADDRESS,
    data: hexToBytes(DATA),
    value: 0,
    gas_limit: 4000000,
    gas_price: 1,
  };

  const stringifyBody = JSON.stringify(body);
  const response = await fetch(`${ENDPOINT}/api/v1/client/tx`, {
    method: "post",
    headers: utils.genHeader(stringifyBody),
    body: stringifyBody,
  });

  const data = await response.json();
  await utils.waitTask(data.id);

  console.log(
    `Transaction sent, please visit: https://explorer-testnet.thundercore.com/address/${TARGET_ADDRESS} for more details`
  );
}

main().catch((e) => console.log(e));
