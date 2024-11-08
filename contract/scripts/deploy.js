const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // ProfileContract
  const ProfileContract = await ethers.getContractFactory("ProfileContract");
  const profileContract = await ProfileContract.deploy();
  console.log("ProfileContract deployed to:", profileContract.target);

  // createProfile
  await profileContract.createProfile("Test", "test@mail.com", "test bio");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// ❯ npx hardhat run ./scripts/deploy.js --network skale
// Deploying contracts with the account: 0xAddc0142a647aE0C1081d202d35D943C4A5c06d2
// ProfileContract deployed to: 0xF3ead142EB1dec8A5A33D1D9aaB3436F2186D3D7
