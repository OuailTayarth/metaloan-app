const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const MetaContract = await hre.ethers.getContractFactory("MetaPayment");
  const metaContract = await MetaContract.deploy();

  await metaContract.deployed();

  // const USDTContract = await hre.ethers.getContractFactory("USDTPayment")
  // const usdtContract = await USDTContract.deploy();

  // await usdtContract.deployed();
  // 0xBC844A25B2c8797D1004ec554b8c1cAA1Ae9CcB0
  console.log("MetaContract deployed to:", metaContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
