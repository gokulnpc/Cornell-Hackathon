const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Retrieve the contract factories
  const NFTCollection = await ethers.getContractFactory("NFTCollection");
  const RewardToken = await ethers.getContractFactory("RewardToken");
  const NFTStaking = await ethers.getContractFactory("NFTStaking");

  // Deploy the NFTCollection contract
  const nftCollection = await NFTCollection.deploy(deployer.address);
  console.log("NFTCollection deployed to:", nftCollection.target);

  // Deploy the RewardToken contract
  const rewardToken = await RewardToken.deploy(deployer.address);
  console.log("RewardToken deployed to:", rewardToken.target);

  // Deploy the NFTStaking contract, passing the addresses of NFTCollection and RewardToken
  const nftStaking = await NFTStaking.deploy(
    nftCollection.target,
    rewardToken.target,
    deployer.address
  );

  console.log("NFTStaking deployed to:", nftStaking.target);

  // Approve the NFTStaking contract to transfer NFTs on behalf of the NFTCollection contract
  await nftCollection.setApprovalForAll(nftStaking.target, true);

  // Approve the NFTStaking contract to transfer RewardTokens on behalf of the RewardToken contract
  await rewardToken.approve(nftStaking.target, 1000000);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// Deploying contracts with the account: 0xAddc0142a647aE0C1081d202d35D943C4A5c06d2
// NFTCollection deployed to: 0x197f1BBD362e13A4f64a35ca8e8a888113d7a80f
// RewardToken deployed to: 0x3419565712ACb2FF62996c24589557C0D4fe026F
// NFTStaking deployed to: 0xe25E49d9C5BbAf5DB4ee49EF2c7caC24d5bD0536
