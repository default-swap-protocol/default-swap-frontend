# Default Swap Frontend

The frontend for Default Swap, a decentralized CDS protocol.

## Develop Locally

Create Moralis account and server instance: https://docs.moralis.io/getting-started/quick-start

Open one terminal, set up frontend

```bash
  git clone https://github.com/default-swap-protocol/default-swap-frontend
  cd default-swap-frontend
  yarn install
```

Add .env file
```bash
  MORALIS_APP_ID=<App_ID>
  MORALIS_SERVER_URL=<Server_URL>
  POOL_CONTRACT_ADDRESS_DEV=<Pool_Contract_Address>
  PREM_TOKEN_ADDRESSS_DEV=<Prem_Token_Contract_Address>
  COVER_TOKEN_ADDRESSS_DEV=<Cover_Token_Contract_Address>
```

Run dev server 
```bash
  yarn dev
```

Open another terminal, set up contracts

```bash
  git clone https://github.com/default-swap-protocol/default-swap-contract
  cd default-swap-contract
  yarn install
  yarn run compile
  yarn run node
```

In another terminal, deploy the contracts

```bash
  yarn run deploy:mainnet_forked
```

Open localhost:3000 in a web browser