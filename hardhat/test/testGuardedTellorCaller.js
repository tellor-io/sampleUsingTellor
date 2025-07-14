const { expect } = require("chai");
const { ethers } = require("hardhat");
const {abi, bytecode} = require("usingtellor/artifacts/contracts/TellorPlayground.sol/TellorPlayground.json");
var assert = require('assert');

describe("GuardedTellorCaller", function() {
  let sampleUsingTellor;
  let tellorOracle;
  let guardedTellor;
  let accounts;
  const abiCoder = new ethers.AbiCoder();
  // generate queryData and queryId for eth/usd price
  const ETH_USD_QUERY_DATA_ARGS = abiCoder.encode(["string", "string"], ["eth", "usd"]);
  const ETH_USD_QUERY_DATA = abiCoder.encode(["string", "bytes"], ["SpotPrice", ETH_USD_QUERY_DATA_ARGS]);
  const ETH_USD_QUERY_ID = ethers.keccak256(ETH_USD_QUERY_DATA);

  // Set up Tellor Playground Oracle, GuardedTellorCaller, and SampleUsingTellor
  beforeEach(async function () {
    accounts = await ethers.getSigners();
    
    let TellorOracle = await ethers.getContractFactory(abi, bytecode);
    tellorOracle = await TellorOracle.deploy();
    await tellorOracle.waitForDeployment();

    const GuardedTellorCaller = await ethers.getContractFactory("GuardedTellorCaller");
    guardedTellor = await GuardedTellorCaller.deploy(tellorOracle.target, accounts[1].address);
    await guardedTellor.waitForDeployment();

    let SampleUsingTellor = await ethers.getContractFactory("SampleUsingTellor");
    sampleUsingTellor = await SampleUsingTellor.deploy(guardedTellor.target);
    await sampleUsingTellor.waitForDeployment();
  });
  describe("GuardedTellorCaller - Function tests", function() {
    it("constructor", async function() {
      expect(await guardedTellor.tellor()).to.equal(tellorOracle.target);
      expect(await guardedTellor.guardians(accounts[1].address)).to.equal(true);
      expect(await guardedTellor.guardianCount()).to.equal(1);
      expect(await guardedTellor.paused()).to.equal(false);
    })
    it("addGuardian", async function() {
      await expectThrow(guardedTellor.connect(accounts[2]).addGuardian(accounts[2].address));
      await guardedTellor.connect(accounts[1]).addGuardian(accounts[2].address);
      expect(await guardedTellor.guardians(accounts[2].address)).to.equal(true);
      expect(await guardedTellor.guardians(accounts[3].address)).to.equal(false);
      expect(await guardedTellor.guardianCount()).to.equal(2);
    })
    it("removeGuardian", async function() {
      await expectThrow(guardedTellor.connect(accounts[1]).removeGuardian(accounts[2].address)); // guardian does not exist
      await expectThrow(guardedTellor.connect(accounts[1]).removeGuardian(accounts[1].address)); // cannot remove last guardian
      expect(await guardedTellor.guardianCount()).to.equal(1);
      await guardedTellor.connect(accounts[1]).addGuardian(accounts[2].address);
      expect(await guardedTellor.guardianCount()).to.equal(2);
      await expectThrow(guardedTellor.connect(accounts[2]).removeGuardian(accounts[3].address)); // not a guardian
      await guardedTellor.connect(accounts[2]).removeGuardian(accounts[1].address);
      expect(await guardedTellor.guardianCount()).to.equal(1);
      expect(await guardedTellor.guardians(accounts[2].address)).to.equal(true);
      expect(await guardedTellor.guardians(accounts[1].address)).to.equal(false);
    })
    it("pause", async function() {
      await expectThrow(guardedTellor.connect(accounts[2]).pause()); // not a guardian
      await guardedTellor.connect(accounts[1]).pause();
      expect(await guardedTellor.paused()).to.equal(true);
      await expectThrow(guardedTellor.connect(accounts[1]).pause()); // already paused
    })
    it("unpause", async function() {
      await expectThrow(guardedTellor.connect(accounts[2]).unpause()); // not a guardian
      await expectThrow(guardedTellor.connect(accounts[1]).unpause()); // already unpaused
      await guardedTellor.connect(accounts[1]).pause();
      expect(await guardedTellor.paused()).to.equal(true);
      await guardedTellor.connect(accounts[1]).unpause();
      expect(await guardedTellor.paused()).to.equal(false);
      await expectThrow(guardedTellor.connect(accounts[1]).unpause()); // already unpaused
    })
  })


  describe("GuardedTellorCaller - User operations", function() {
    it("readEthPrice - normal operation", async function() {
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

    it("readEthPrice checks working - normal operation", async function() {
      // mock value to report
      const mockValue1 = BigInt(2000e18);
      const mockValue2 = BigInt(3000e18);
      const mockValue3 = BigInt(4000e18);
      // convert to bytes
      const mockValue1Bytes = abiCoder.encode(["uint256"], [mockValue1]);
      const mockValue2Bytes = abiCoder.encode(["uint256"], [mockValue2]);
      const mockValue3Bytes = abiCoder.encode(["uint256"], [mockValue3]);
      // submit value to playground
      await tellorOracle.submitValue(ETH_USD_QUERY_ID, mockValue1Bytes, 0, ETH_USD_QUERY_DATA);
      blocky1 = await ethers.provider.getBlock();
      await tellorOracle.submitValue(ETH_USD_QUERY_ID, mockValue2Bytes, 0, ETH_USD_QUERY_DATA);
      blocky2 = await ethers.provider.getBlock();

      // without advancing time, value should be 0
      await sampleUsingTellor.readEthPrice();
      let retrievedVal = await sampleUsingTellor.ethPrice();
      expect(BigInt(retrievedVal)).to.equal(0n);

      // advance time to 15 minutes
      await ethers.provider.send("evm_increaseTime", [901]);
      await ethers.provider.send("evm_mine");

      // ethPrice should be second submitted value
      await sampleUsingTellor.readEthPrice();
      retrievedVal = await sampleUsingTellor.ethPrice();
      expect(BigInt(retrievedVal)).to.equal(mockValue2);

      // dispute second value
      await tellorOracle.beginDispute(ETH_USD_QUERY_ID, blocky2.timestamp)

      // ethPrice should still be second submitted value
      await sampleUsingTellor.readEthPrice();
      retrievedVal = await sampleUsingTellor.ethPrice();
      expect(BigInt(retrievedVal)).to.equal(mockValue2);

      // submit third value
      await tellorOracle.submitValue(ETH_USD_QUERY_ID, mockValue3Bytes, 0, ETH_USD_QUERY_DATA);

      // advance time to 15 minutes
      await ethers.provider.send("evm_increaseTime", [901]);

      // ethPrice should be third submitted value
      await sampleUsingTellor.readEthPrice();
      retrievedVal = await sampleUsingTellor.ethPrice();
      expect(BigInt(retrievedVal)).to.equal(mockValue3);
    })

    it("readEthPrice - guardian paused", async function() {
      // mock value to report
      const mockValue = BigInt(2000e18);
      // convert to bytes
      const mockValueBytes = abiCoder.encode(["uint256"], [mockValue]);
      // submit value to playground
      await tellorOracle.submitValue(ETH_USD_QUERY_ID, mockValueBytes, 0, ETH_USD_QUERY_DATA);
      // advance block timestamp by 15 minutes to allow our value to be retrieved
      await ethers.provider.send("evm_increaseTime", [901]);
      await ethers.provider.send("evm_mine");

      await guardedTellor.connect(accounts[1]).pause();

      // expect throw
      await expectThrow(sampleUsingTellor.readEthPrice());

      // unpause
      await guardedTellor.connect(accounts[1]).unpause();

      // retrieve value from playground in our sample contract
      await sampleUsingTellor.readEthPrice();
      // read our saved value from the sample contract
      const retrievedVal = await sampleUsingTellor.ethPrice();
      expect(BigInt(retrievedVal)).to.equal(mockValue);
    })
  })
});



async function expectThrow(promise) {
  try {
    await promise;
  } catch (error) {
    const invalidOpcode = error.message.search("invalid opcode") >= 0;
    const outOfGas = error.message.search("out of gas") >= 0;
    const revert = error.message.search("revert") >= 0;
    assert(
      invalidOpcode || outOfGas || revert,
      "Expected throw, got '" + error + "' instead"
    );
    return;
  }
  assert.fail("Expected throw not received");
}