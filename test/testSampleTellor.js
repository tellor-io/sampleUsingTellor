const { expect } = require("chai");
const { ethers } = require("hardhat");
const {abi, bytecode} = require("usingtellor/artifacts/contracts/TellorPlayground.sol/TellorPlayground.json");

describe("Tellor", function() {
  let sampleUsingTellor;
  let tellorOracle;
  const abiCoder = new ethers.utils.AbiCoder();
  // generate queryData and queryId for eth/usd price
  const ETH_USD_QUERY_DATA_ARGS = abiCoder.encode(["string", "string"], ["eth", "usd"]);
  const ETH_USD_QUERY_DATA = abiCoder.encode(["string", "bytes"], ["SpotPrice", ETH_USD_QUERY_DATA_ARGS]);
  const ETH_USD_QUERY_ID = ethers.utils.keccak256(ETH_USD_QUERY_DATA);

  // Set up Tellor Playground Oracle and SampleUsingTellor
  beforeEach(async function () {
    let TellorOracle = await ethers.getContractFactory(abi, bytecode);
    tellorOracle = await TellorOracle.deploy();
    await tellorOracle.deployed();

    let SampleUsingTellor = await ethers.getContractFactory("SampleUsingTellor");
    sampleUsingTellor = await SampleUsingTellor.deploy(tellorOracle.address);
    await sampleUsingTellor.deployed();
  });

  it("readEthPrice", async function() {
    // mock value to report
    const mockValue = BigInt(2000e18);
    // convert to bytes
    const mockValueBytes = abiCoder.encode(["uint256"], [mockValue]);
    // submit value to playground
    await tellorOracle.submitValue(ETH_USD_QUERY_ID, mockValueBytes, 0, ETH_USD_QUERY_DATA);
    // advance block timestamp by 15 minutes to allow our value to be retrieved
    await ethers.provider.send("evm_increaseTime", [901]);
    await ethers.provider.send("evm_mine");
    // retrieve value from playground in our sample contract
    await sampleUsingTellor.readEthPrice();
    // read our saved value from the sample contract
    const retrievedVal = await sampleUsingTellor.ethPrice();
    expect(BigInt(retrievedVal)).to.equal(mockValue);
  })
});
