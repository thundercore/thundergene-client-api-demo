# ThunderGene client API demo

ThunderGene is a platform provided by ThunderCore that aim to help web2 industry entering web3 world.

This repository shows how to use ThunderGene client API. For more API details, you can visit [ThunderGene doc](https://thundergene.platform.dev.tt-eng.com/docs/#overview).

## Get Started

1. First, you have to sign up a ThunderGene account in [ThunderGene](https://thundergene.platform.dev.tt-eng.com/#/login).
2. Create a project.
3. Create your own [TT20](https://eips.ethereum.org/EIPS/eip-20) token (ThunderCore is an evm compatible blockchain, so it makes no difference between ERC20 and TT20 standard).

Once you have created your own project and token, you can start to use ThunderGene client API.

## Project Information

In project information page on ThunderGene console, there are some informations that you should take care. And these informations are required when using ThunderGene client API.

### Project ID

When using ThunderGene client API, we have to figure out the identity of API consumer, and `Project ID` is what we use to verify the API consumer's identity.

### Project Secret

Except `Project ID`, we also use `Project Secret` to check if the API consumer have the right permission to use client API.

### Project Contract Address

The `Project Contract Address` is not required when using ThunderGene client API, but it is important that if you want to have some token in your project, this is the right address that you should provide in asset related API.

## Client API Identity

As we mentioned in `Project Secret` session, we have to verify the permission when consumer uses API. So we decide to use a Hmac hash as a signature that consumer should provide in request header to verify the client's permission. The following javascript example is how the consumer should compute the Hmac hash:

```js
// crypto-js about Hmac: https://cryptojs.gitbook.io/docs/#hmac
const CryptoJS = require("crypto-js");

// simply use empty string for `stringifyBody` if no request body
function hmac(projectId, timestamp, stringifyBody, apiKey) {
  const hash = CryptoJS.HmacSHA256(
    `${projectId}:${timestamp}:${stringifyBody}`,
    apiKey
  );

  return hash.toString();
}
```

For more details, please visit [ThunderGene doc](https://thundergene.platform.dev.tt-eng.com/docs/#authentication)

## User API

In ThunderGene, there is a role that called user, a user is bound to a project. The project user can not transfer assets to other project's user. For any application that uses ThunderGene should create user first when the end user uses application.

### Create_User

`POST /client/user`

Create an user that belongs to a project.

The user can only transfer asset between users that belong to the same project.

### Get_User_Balance

`GET /client/user/asset`

Get user balance under project, this API can also get the asset of `Project Contract Address`

## Token API

We provide 3 APIs to manipulate token asset on blockchain

1. Mint token
2. Transfer token
3. Claim token

### Mint_Asset

`POST /client/asset/mint`

Mint token API mints token to `to` address.

### Transfer_Asset

`POST /client/asset/transfer`

Tranfer token from `from` address to `to` address. If `from` is `Project Contract Address`, you can transfer to any address. But you can only transfer to `Project Contract Address` or project user when `from` is a project user.

### Claim_Token

`POST /client/claim`

Claim Token is very similar to transfer API, it transfers token from `Project Contract Address`. In web3 world, there are two websites([dapp.com](https://www.dapp.com/), [dappradar.com](https://dappradar.com/)) that ranks dapp by monitoring the activity of a smart contract. So claim token API increases the activity of `Project Contract`, as a result that it helps application get higher rank if you submit your application with `Project Contract Address`.

## Get Async Task Result

In ThunderGene, most of the APIs are asynchronous, and the reason why it is designed is that when we try to send a transaction to blockchain, there are some uncertainties which makes the transaction being processed for a long time or even not processed. So we provide asynchronous APIs to prevent Http request timeout.

### Get_Task_Result

`GET /task`

The value of responded status should be one of the followings:

- 0 = Task done
- 1 = Task failed
- 2 = Task pending
- 3 = Task processing

## Redeem API

ThunderGene provides a series of APIs to let any user can redeem assets from a project user. It can be used by following steps:

1. Create redeem code
2. Check redeem status until asset is locked
3. Redeem the code by any address

### Create_Redeem_Code

`POST /client/redeem/create`

Creates a redeem code for given assets, `from` should be project user and assets should be project asset.

### Get_Redeem_Status

`GET /client/redeem/status`

This API can be use to check if the redeem code is ready. The responded status should be one of the followings

- 0 = Redeem task pending.
- 1 = Redeem task failed.
- 2 = Redeem task is created, but assets are not locked yet.
- 3 = Redeem task is ready and assets are locked.
- 4 = Redeem code is already redeemed.
- 5 = Redeem code is redeemed, but failed.

Once the status is 3 (redeem task is ready and assets are locked), the responded `redeem_code` is ready to redeem.

### Get_Asset_Of_Redeem_Code

`GET /client/redeem`

Get assets that locked in redeem contract.

### Claim_Redeem_Code

`POST /client/redeem`

Claim the assets that locked in redeem contract with `redeem_code`. The `redeem_code` can be found by `Get_Redeem_Status` API, and since this API is also asynchronous, it can also use `Get_Redeem_Status` to check if the redeem is successful.
