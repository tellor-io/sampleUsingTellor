const Migrations = artifacts.require("Migrations");
const SampleUsingTellor = artifacts.require("SampleUsingTellor");
const MockTellor = artifacts.require("MockTellor");

const mainnetAddress = "0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5";
const rinkebyAddress = "0xFe41Cb708CD98C5B20423433309E55b53F79134a";

module.exports = function (deployer, network) {
  if (network == "mainnet") {
    deployer.deploy(SampleUsingTellor, mainnetAddress);
  } else if (network == "rinkeby") {
    deployer.deploy(SampleUsingTellor, rinkebyAddress);
  } else {
    //deploy MockTellor
    deployer.deploy(MockTellor, [], []).then(() => {
      deployer.deploy(SampleUsingTellor);
    });
  }
};
