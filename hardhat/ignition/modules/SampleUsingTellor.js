const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

let tellorAddress = "0xC866DB9021fe81856fF6c5B3E3514BF9D1593D81"; //our constructor argument


// npx hardhat ignition deploy ignition/modules/SampleUsingTellor.js --network polygon_amoy


const SampleUsingTellorModule = buildModule('SampleUsingTellorModule', (m) => {
  const sampleUsingTellor = m.contract('SampleUsingTellor',[tellorAddress]);

  return { sampleUsingTellor };
});

module.exports = SampleUsingTellorModule;