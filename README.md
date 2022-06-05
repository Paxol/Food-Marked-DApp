# Food Marked DApp
A basic marketplace dapp for the Celo blockchain.

Boilerplate forked from [dacadeorg/celo-react-boilerplate](https://github.com/dacadeorg/celo-react-boilerplate).

## 1. Tech Stack
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
- [use-Contractkit](contractkit
) - A frontend library for interacting with the Celo blockchain.
- [Hardhat](https://hardhat.org/) - A tool for writing and deploying smart contracts.
- [Bootstrap](https://getbootstrap.com/) - A CSS framework that provides responsive, mobile-first layouts.

## 2. Quick Start

Clone the project, install the dependencies and run the app
```bash
npm install
npm start
```

To properly test the dapp you will need to have a wallet with testnet tokens.
You can use [Metamask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) or the [CeloExtensionWallet](https://chrome.google.com/webstore/detail/celoextensionwallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh) and you can get some tokens on the testnet [here](https://celo.org/developers/faucet) by putting down your address (remember that it needs to start with `0x`).

## 3. Smart-Contract Deployment

The code of the smart contract is located in the `contracts` folder, all solidity contracts must be here.

If you modify the file name of a smart contract, you need to modify it also in the test and the deploy script.

### 3.1 Compile the smart contract

Simply run

```bash
npm run compile
```

or

```bash
npx hardhat compile
```

### 3.2 Run tests on smart contract
In the `test` folder you will find the test for the smart contracts.

To start the test run
```bash
npm run test-contract
```
or

```bash
npx hardhat test
```

### 3.3 Update env file

The following envirorment variables are needed:
- `MNEMONIC`, the mnemonic phase of your testnet wallet, it needs to have some CELO coins to deploy the contract
- `ERC20_TOKEN_ADDRESS`, the addres of the token that will be used as 'currency' in the marketplace
- `ERC20_TOKEN_SYMBOL`, the symbol of the token shown in the marketplace

You can copy the content of [.env-sample](.env-sample) and fill with your needs

```js
MNEMONIC = "...";
ERC20_TOKEN_ADDRESS = "0x...";
ERC20_TOKEN_SYMBOL = "...";
```

**NB:** the project is configured to use a mnemonic phrase generated with the CeloExtensionWallet, if you want to use one generated with Metamask you need to change the generation path in the [hardhat.config.js](hardhat.config.js#L42) at line 42 file from `m/44'/52752'/0'/0` to `m/44'/60'/0'/0`.

### 3.4 Deploy the smart contract to the Celo testnet Aljafores
When you're ready to deploy the smart contract you can run 
```bash
npm run deploy
```
or
```bash
npx hardhat run --network alfajores scripts/deploy.js
```

This command will update the src/contract files with the deployed smart contract ABI and contract address.

## 4. Build the React app

To create an optimized build of the frontend ready to publish run the command:

```bash
npm run build
```
The optimized app will be saved in the `build` folder.