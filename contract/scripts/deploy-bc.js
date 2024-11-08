const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Retrieve the contract factories
  const BetterCause = await ethers.getContractFactory("BetterCause");
  const betterCause = await BetterCause.deploy(
    "0x943005462B9FE506EAb2e01d6023448c1C103814"
  );
  console.log("BetterCause deployed to:", betterCause.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// Skale: 0xC36De8D9CE34Cc32C7F411F7785e84eF94f881a1
// Amoy: 0x823e797e0942801361bE2710e5D230Ed93AFB450

// ❯ npx hardhat run ./scripts/deploy-bc.js --network skale
// Deploying contracts with the account: 0xAddc0142a647aE0C1081d202d35D943C4A5c06d2
// BetterCause deployed to: 0x4EAC547Dfc9A79c73A4B28731DF7023f0FA764DD
