/****Uncomment the body below to run this with Truffle migrate for truffle testing*/
var TellorTransfer = artifacts.require("./usingtellor/contracts/libraries/TellorTransfer.sol");
var TellorDispute = artifacts.require("./usingtellor/contracts/libraries/TellorDispute.sol");
var TellorLibrary = artifacts.require("usingtellor/contracts/libraries/TellorLibrary.sol")
var TellorGettersLibrary = artifacts.require("./usingtellor/contracts/libraries/TellorGettersLibrary.sol");
var Tellor = artifacts.require("usingtellor/contracts/testContracts/Tellor.sol")
var TellorMaster = artifacts.require("./usingtellor/contracts/TellorMaster.sol");
var SampleUsingTellor = artifacts.require("./SampleUsingTellor.sol");
/****Uncomment the body to run this with Truffle migrate for truffle testing*/

/*@dev Use this for setting up contracts for testing*/

module.exports = async function (deployer) {
  // deploy transfer
  await deployer.deploy(TellorTransfer);
    // deploy dispute
  await deployer.deploy(TellorDispute);
  // deploy getters lib
  await deployer.deploy(TellorGettersLibrary);
  // deploy lib
  await deployer.link(TellorTransfer, TellorLibrary);
  await deployer.link(TellorDispute, TellorLibrary);
  await deployer.deploy(TellorLibrary);
  // deploy tellor
  await deployer.link(TellorTransfer,Tellor);
  await deployer.link(TellorDispute,Tellor);
  await deployer.link(TellorLibrary,Tellor);
  await deployer.deploy(Tellor);
  // deploy tellor master
  await deployer.link(TellorTransfer,TellorMaster);
  await deployer.link(TellorGettersLibrary,TellorMaster);
  await deployer.deploy(Tellor).then(async function() {
  await deployer.deploy(TellorMaster, Tellor.address).then(async function(){
      await deployer.deploy(SampleUsingTellor,1,TellorMaster.address,1000000)
    })
  });

};


//This is if you actually want to migrate to rinkeby or mainnet

// var SampleUsingTellor = artifacts.require("./SampleUsingTellor.sol");

// var tellorAddress =  "0xFe41Cb708CD98C5B20423433309E55b53F79134a"
// module.exports = async function (deployer) {
//   await deployer.deploy(SampleUsingTellor,1,tellorAddress,1000000)

// };
