const hre = require("hardhat");

async function main() {

  // We get the contract to deploy
  const MetaContract = await hre.ethers.getContractFactory("MetaPayment");
  const metaContract = await MetaContract.deploy();

  await metaContract.deployed();

  console.log("MetaContract deployed to:", metaContract.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
