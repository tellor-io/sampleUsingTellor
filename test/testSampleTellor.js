const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));

const SampleUsingTellor = artifacts.require("./SampleUsingTellor.sol");
const TellorMaster = require("usingtellor/build/contracts/TellorMaster.json")
const Tellor = require("usingtellor/build/contracts/Tellor.json")

contract('UsingTellor Tests', function(accounts) {
  let oracleBase;
  let oracle;
  let oracle2;
  let usingTellor;
  let oa;
  let master;
  let sampleUsingTellor

    beforeEach('Setup contract for each test', async function () {
        oracleBase = await Tellor.new()
        oracle = await TellorMaster.new(web3.utils.toChecksumAddress(oracleBase.address));
        master = await new web3.eth.Contract(masterAbi,oracle.address);
        oa = (web3.utils.toChecksumAddress(oracle.address))
        oracle2 = await new web3.eth.Contract(oracleAbi,oa);
        await web3.eth.sendTransaction({to:oa,from:accounts[0],gas:4000000,data:oracle2.methods.requestData(api,"BTC/USD",1000,0).encodeABI()})
        sampleUsingTellor = await SampleUsingTellor.new(oa)

    })

    it("Update Price", async function(){
        for(var i =1;i<6;i++){
            await web3.eth.sendTransaction({to:master._address,from:accounts[i],gas:2000000,data:tellor.methods.submitMiningSolution("1",1,1200).encodeABI()})      
        }
        await sampleUsingTellor.updateValues();
        
	})
    
})