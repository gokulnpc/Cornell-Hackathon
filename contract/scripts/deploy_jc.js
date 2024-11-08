const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // JobContract
  const JobContract = await ethers.getContractFactory("JobContract");
  const jobContract = await JobContract.deploy();
  console.log("JobContract deployed to:", jobContract.target);

  // function createJob(string memory _title, string memory _description, string memory _salary, string memory _location)
  await jobContract.createJob(
    "Software Engineer",
    "Job Description",
    "100000",
    "Remote"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

//   ❯ npx hardhat run ./scripts/deploy_jc.js --network skale
//   Deploying contracts with the account: 0xAddc0142a647aE0C1081d202d35D943C4A5c06d2
//   JobContract deployed to: 0xBd03FE76734Eb36500E50a8Cb1c0450689554C9c
