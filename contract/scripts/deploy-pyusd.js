const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Define the mint price (example: 100 PYUSD with 6 decimals)
  const MINT_PRICE = 100 * 10 ** 6; // 100.000000 PYUSD

  // Deploy MockPYUSD contract
  const MockPYUSD = await ethers.getContractFactory("MockPYUSD");
  const mockPYUSD = await MockPYUSD.deploy();
  console.log("MockPYUSD deployed to:", mockPYUSD.target);

  // Deploy HelloPYUSD contract with MockPYUSD address and mint price
  const HelloPYUSD = await ethers.getContractFactory("HelloPYUSD");
  const helloPYUSD = await HelloPYUSD.deploy(mockPYUSD.target, MINT_PRICE);
  console.log("HelloPYUSD deployed to:", helloPYUSD.target);

  // Mint 1000000 PYUSD to the deployer
  await mockPYUSD.mint(deployer.address, 1000000 * 10 ** 6);
  console.log("Minted 1000000 PYUSD to the deployer");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// Deploying contracts with the account: 0xAddc0142a647aE0C1081d202d35D943C4A5c06d2
// MockPYUSD deployed to: 0x546ee037AB8647c985B8F217EE7dfce9bf334978
// HelloPYUSD deployed to: 0x43A80ce3FDCd80F71032174e8AD6bB73392C8717
// Minted 1000000 PYUSD to the deployer
