const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // AppllicationContract
  const ApplicationContract = await ethers.getContractFactory(
    "ApplicationContract"
  );
  const applicationContract = await ApplicationContract.deploy(
    "0xBd03FE76734Eb36500E50a8Cb1c0450689554C9c"
  );
  console.log("ApplicationContract deployed to:", applicationContract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

//   ❯ npx hardhat run ./scripts/deploy_ac.js --network skale
//   Deploying contracts with the account: 0xAddc0142a647aE0C1081d202d35D943C4A5c06d2
//   ApplicationContract deployed to: 0xA0B7a4e65d8DB9dA27d5BE07Fb20B8CA69F67489
