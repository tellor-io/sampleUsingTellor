const SampleUsingTellor = artifacts.require("./SampleUsingTellor.sol");
const Tellor = artifacts.require("usingtellor/contracts/MockTellor.sol");

//Helper function that submits and value and returns a timestamp for easy retrieval
const submitTellorValue = async (tellorOracle, requestId, amount) => {
  //Get the amount of values for that timestamp
  let count = await tellorOracle.getNewValueCountbyRequestId();
  await tellorOracle.submitValue(requestId, amount);
  let time = await getTimestampbyRequestIDandIndex(requestId, count.toString());
  return time.toNumber();
};

contract("UsingTellor Tests", function (accounts) {
  let sampleUsingTellor;
  let tellorOracle;

  beforeEach("Setup contract for each test", async function () {
    //Deploy MockTellor and sampleUsingTellor
    tellorOracle = await Tellor.new([], []);
    sampleUsingTellor = await SampleUsingTellor.new(tellorOracle.address);
  });

  it("Update Price", async function () {
    const requestId = 1;
    const mockValue = "7000000";
    await tellorOracle.submitValue(requestId, mockValue);
    let retrievedVal = await sampleUsingTellor.readTellorValue(requestId);
    assert.equal(retrievedVal.toString(), mockValue);
  });
});
