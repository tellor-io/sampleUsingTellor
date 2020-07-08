const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));

const SampleUsingTellor = artifacts.require("./SampleUsingTellor.sol");
var Tellor = artifacts.require("usingtellor/contracts/testContracts/Tellor.sol")
var TellorMaster = artifacts.require("./usingtellor/contracts/TellorMaster.sol");

advanceTime = (time) => {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [time],
            id: new Date().getTime()
        }, (err, result) => {
            if (err) { return reject(err); }
            return resolve(result);
        });
    });
}

contract('UsingTellor Tests', function(accounts) {
  let oracleBase;
  let oracle;
  let master;
  let sampleUsingTellor

    beforeEach('Setup contract for each test', async function () {
        oracleBase = await Tellor.new()
        oracle = await TellorMaster.new(web3.utils.toChecksumAddress(oracleBase.address));
        master = await new web3.eth.Contract(TellorMaster.abi,oracle.address);
        oracle = await new web3.eth.Contract(Tellor.abi,oracle.address);
        await web3.eth.sendTransaction({to:oracle._address,from:accounts[0],gas:4000000,data:oracle.methods.requestData("1","BTC/USD",1000,0).encodeABI()})
        sampleUsingTellor = await SampleUsingTellor.new(1,oracle._address,1000000)
    })
    it("Update Price", async function(){
        for(var i =1;i<6;i++){
            await web3.eth.sendTransaction({to:oracle._address,from:accounts[i],gas:2000000,data:oracle.methods.submitMiningSolution("1",1,1200000000).encodeABI()})      
        }
        await sampleUsingTellor.updateValues(1,0);
        assert(await sampleUsingTellor.currentValue.call() == 1200)
        await web3.eth.sendTransaction({to:oracle._address,from:accounts[0],gas:4000000,data:oracle.methods.requestData("1","BTC/USD",1000,0).encodeABI()})
        await advanceTime(2*60*60)
        for(var i =1;i<6;i++){
            await web3.eth.sendTransaction({to:oracle._address,from:accounts[i],gas:2000000,data:oracle.methods.submitMiningSolution("1",1,100000000).encodeABI()})      
        }
        await sampleUsingTellor.updateValues(5,1);
                assert(await sampleUsingTellor.currentValue.call() == 100)
        console.log(await sampleUsingTellor.qualifiedValue.call())
        assert(await sampleUsingTellor.qualifiedValue.call() == 1200, "Value should still be 1200")


	})
})