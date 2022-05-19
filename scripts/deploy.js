const hre = require("hardhat");

async function main() {

  // We get the contract to deploy
  const MetaContract = await hre.ethers.getContractFactory("MetaPayment");
  const metaContract = await MetaContract.deploy();

  await metaContract.deployed();


  // const USDTContract = await hre.ethers.getContractFactory("USDTPayment")
  // const usdtContract = await USDTContract.deploy();

  // await usdtContract.deployed();

  console.log("MetaContract deployed to:", metaContract.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
