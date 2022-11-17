const { expect } = require("chai");
const { ethers } = require("hardhat");
const h = require("usingtellor/test/helpers/helpers.js");
const web3 = require('web3');

describe("Tellor", function() {
  let sampleUsingTellor;
  let tellorOracle;
  const abiCoder = new ethers.utils.AbiCoder();
  const ETH_USD_QUERY_DATA_ARGS = abiCoder.encode(["string", "string"], ["eth", "usd"]);
  const ETH_USD_QUERY_DATA = abiCoder.encode(["string", "bytes"], ["SpotPrice", ETH_USD_QUERY_DATA_ARGS]);
  const ETH_USD_QUERY_ID = ethers.utils.keccak256(ETH_USD_QUERY_DATA);

  // Set up Tellor Playground Oracle and SampleUsingTellor
  beforeEach(async function () {
    let TellorOracle = await ethers.getContractFactory("TellorPlayground");
    tellorOracle = await TellorOracle.deploy();
    await tellorOracle.deployed();

    let SampleUsingTellor = await ethers.getContractFactory("SampleUsingTellor");
    sampleUsingTellor = await SampleUsingTellor.deploy(tellorOracle.address);
    await sampleUsingTellor.deployed();
  });

  it("readEthPrice", async function() {
    const mockValue = web3.utils.toWei("2000");
    await tellorOracle.submitValue(ETH_USD_QUERY_ID, h.bytes(mockValue), 0, ETH_USD_QUERY_DATA);
    await h.advanceTime(60 * 15 + 1)
    let retrievedVal = await sampleUsingTellor.readEthPrice();
    expect(retrievedVal[0]).to.equal(h.bytes(mockValue));
  })
});
