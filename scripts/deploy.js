// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
require('dotenv').config({path: '../.env'});

const getEnv = (variable, optional = false) => {
  if (!process.env[variable]) {
    if (optional) {
      console.warn(`[@env]: Environmental variable for ${variable} is not supplied.`)
    } else {
      throw new Error(`You must create an environment variable for ${variable}`)
    }
  }

  return process.env[variable]?.replace(/\\n/gm, '\n')
}

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deployer: ${deployer.address}`);

  const tokenAddress = getEnv("ERC20_TOKEN_ADDRESS");

  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const deployed = await Marketplace.deploy(tokenAddress);

  await deployed.deployed();

  console.log("Contract deployed to:", deployed.address);
  storeContractData(deployed)
}

function storeContractData(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  // Get token from environment variables
  const TokenAddress = getEnv("ERC20_TOKEN_ADDRESS");
  const TokenSymbol = getEnv("ERC20_TOKEN_SYMBOL");

  fs.writeFileSync(
    contractsDir + "/MarketplaceAddress.json",
    JSON.stringify({ Marketplace: contract.address, TokenAddress, TokenSymbol }, undefined, 2)
  );

  const MarketplaceArtifact = artifacts.readArtifactSync("Marketplace");

  fs.writeFileSync(
    contractsDir + "/Marketplace.json",
    JSON.stringify(MarketplaceArtifact, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

