require("dotenv").config();
const CryptoJS = require("crypto-js");
const fetch = require("node-fetch");

const { PROJECT_ID, API_KEY, ENDPOINT } = process.env;

function hmac(projectId, timestamp, stringifyBody, apiKey) {
  const hash = CryptoJS.HmacSHA256(
    `${projectId}:${timestamp}:${stringifyBody}`,
    apiKey
  );

  return hash.toString();
}

function genHeader(stringifyBody) {
  let timestamp = Date.now();
  let signature = hmac(PROJECT_ID, timestamp, stringifyBody, API_KEY);
  return {
    "Content-Type": "application/json",
    "X-PROJECT-ID": PROJECT_ID,
    "X-TIMESTAMP": timestamp.toString(),
    "X-SIGNATURE": signature,
  };
}

async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function getTaskStatus(id) {
  const path = `/api/v1/task`;
  const response = await fetch(`${ENDPOINT}${path}/?task_id=${id}`, {
    method: "get",
  });

  const data = await response.json();
  return data;
}

async function waitTask(id) {
  while (1) {
    let resp = await getTaskStatus(id);
    // return when done or failed
    if (resp.status === 0 || resp.status === 1) {
      break;
    }
    await wait(500);
  }
}

async function getRedeemStatus(id) {
  const path = "/api/v1/client/redeem/status";
  const response = await fetch(`${ENDPOINT}${path}/?redeem_id=${id}`, {
    method: "get",
    headers: genHeader(""),
  });

  const data = await response.json();
  return data;
}

async function waitRedeemTask(id) {
  while (1) {
    let resp = await getRedeemStatus(id);
    // return when failed/locked
    if (resp.status === 1 || resp.status === 3 || resp.status === 6) {
      break;
    }
    await wait(2000);
  }
}

async function waitRedeemTaskRedeemed(id) {
  while (1) {
    let resp = await getRedeemStatus(id);
    // return when redeemed/failed/redeemFailed
    if (resp.status === 4 || resp.status === 1 || resp.status === 5) {
      break;
    }
    await wait(2000);
  }
}

module.exports = {
  waitTask,
  waitRedeemTask,
  waitRedeemTaskRedeemed,
  genHeader,
  getTaskStatus,
  getRedeemStatus,
};
