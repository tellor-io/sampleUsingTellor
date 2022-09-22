const { expect } = require("chai");
const { ethers } = require("hardhat");
const { abi, bytecode } = require("usingtellor/artifacts/contracts/TellorPlayground.sol/TellorPlayground.json")
const h = require("usingtellor/test/helpers/helpers.js");

describe("Tellor", function() {
  let sampleUsingTellor;
  let tellorOracle;

  // Set up Tellor Playground Oracle and SampleUsingTellor
  beforeEach(async function () {
    let TellorOracle = await ethers.getContractFactory(abi, bytecode);
    tellorOracle = await TellorOracle.deploy();
    await tellorOracle.deployed();

    let SampleUsingTellor = await ethers.getContractFactory("SampleUsingTellor");
    sampleUsingTellor = await SampleUsingTellor.deploy(tellorOracle.address);
    await sampleUsingTellor.deployed();
  });

  it("Read tellor value before", async function() {
    const abiCoder = new ethers.utils.AbiCoder
    const queryDataArgs = abiCoder.encode(['string', 'string'], ['btc', 'usd'])
    const queryData = abiCoder.encode(['string', 'bytes'], ['SpotPrice', queryDataArgs])
    const queryId = ethers.utils.keccak256(queryData)
    const mockValue = 50000;
    // submit value takes 4 args : queryId, value, nonce and queryData
    await tellorOracle.submitValue(queryId,mockValue,0,queryData);
    let blocky = await h.getBlock();
    let retrievedVal = await sampleUsingTellor.readTellorValueBefore(queryId, blocky.timestamp + 1);
    expect(retrievedVal[0]).to.equal(h.bytes(mockValue));
  });
});
