const hre = require("hardhat");

async function main() {

  // We get the contract to deploy
  const MetaContract = await hre.ethers.getContractFactory("MetaPayment");
  const metaContract = await MetaContract.deploy(["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"]);

  await metaContract.deployed();

  console.log("MetaContract deployed to:", metaContract.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
