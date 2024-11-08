async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const RewardToken = await ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy(deployer.address);
  console.log("RewardToken deployed to:", rewardToken.target);

  // const NFTCollection = await ethers.getContractFactory("NFTCollection");
  // const nftCollection = await NFTCollection.deploy(deployer.address);
  // console.log("NFTCollection deployed to:", nftCollection.target);
  const NFTStaking = await ethers.getContractFactory("NFTStaking");
  const nftStaking = await NFTStaking.deploy(
    "0x7C476D3335E187606c4323e2c55C188Bf9B37D25",
    rewardToken.target,
    deployer.address
  );
  console.log("NFTStaking deployed to:", nftStaking.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// 0x968F636cB3375AD8b249E09a3fAd5c541b400b71
