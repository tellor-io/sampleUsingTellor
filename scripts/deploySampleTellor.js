// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { abi, bytecode } = require("usingtellor/artifacts/contracts/TellorPlayground.sol/TellorPlayground.json")

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile 
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  let TellorOracle = await ethers.getContractFactory(abi, bytecode);
  tellorOracle = await TellorOracle.deploy();
  await tellorOracle.deployed();

  let SampleUsingTellor = await ethers.getContractFactory("SampleUsingTellor");
  sampleUsingTellor = await SampleUsingTellor.deploy(tellorOracle.address);
  await sampleUsingTellor.deployed();

  console.log("SampleUsingTellor deployed to:", sampleUsingTellor.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
