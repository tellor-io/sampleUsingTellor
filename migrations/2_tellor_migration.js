/****Uncomment the body below to run this with Truffle migrate for truffle testing*/
var TellorTransfer = artifacts.require("./usingTellor/contracts/libraries/TellorTransfer.sol");
var TellorLibrary = artifacts.require("./usingTellor/contracts/libraries/TellorLibrary.sol");
var TellorGettersLibrary = artifacts.require("./usingTellor/contracts/libraries/TellorGettersLibrary.sol");
var Tellor = artifacts.require("./usingTellor/contracts/Tellor.sol");
var TellorMaster = artifacts.require("./usingTellor/contracts/TellorMaster.sol");
var SampleUsingTellor = artifacts.require("./SampleUsingTellor.sol");
/****Uncomment the body to run this with Truffle migrate for truffle testing*/

/**
*@dev Use this for setting up contracts for testing 
*/

//userContractAddress = ;
/****Uncomment the body below to run this with Truffle migrate for truffle testing*/
module.exports = async function (deployer) {

  // deploy transfer
  await deployer.deploy(TellorTransfer);

  // deploy getters lib
  await deployer.deploy(TellorGettersLibrary);

  // deploy lib
  await deployer.link(TellorTransfer, TellorLibrary);
  await deployer.deploy(TellorLibrary);

  // deploy tellor
  await deployer.link(TellorTransfer,Tellor);
  await deployer.link(TellorLibrary,Tellor);
  await deployer.deploy(Tellor);
  // deploy tellor master
  await deployer.link(TellorTransfer,TellorMaster);
  await deployer.link(TellorGettersLibrary,TellorMaster);
  await deployer.deploy(Tellor).then(async function() {
  await deployer.deploy(TellorMaster, Tellor.address).then(async function(){
      await deployer.deploy(SampleUsingTellor,TellorMaster.address)
    })
  });

};
