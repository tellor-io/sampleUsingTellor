<p align="center">
  <a href='https://www.tellor.io/'>
    <img src= 'https://raw.githubusercontent.com/tellor-io/TellorBrandMaterials/master/LightBkrnd_RGB.png' width="250" height="200" alt='tellor.io' />
  </a>
</p>

<p align="center">
  <a href='https://twitter.com/WeAreTellor'>
    <img src= 'https://img.shields.io/twitter/url/http/shields.io.svg?style=social' alt='Twitter WeAreTellor' />
  </a> 
</p>


## Sample project UsingTellor <a name="sample"> </a>

<b>The Tellor oracle</b> is a decentralized oracle. It provides an option for contracts to securely interact with and obtain data from off-chain.

For more indepth information about Tellor checkout our [documenation](https://tellor.readthedocs.io/en/latest/), [whitepaper](https://tellor.io/whitepaper/) and [FAQ](https://tellor.io/faq/) page. 

Quick references are included below: 

<b>Implement Tellor into your project</b>
This repo already includes the [usingTellor](https://github.com/tellor-io/usingtellor) package.

## How to use 
#### 1. Clone project and install dependencies

```bash
git clone git@github.com:tellor-io/sampleUsingTellor.git
npm install 
```

#### 2. The sample contract `SampleUsingTellor` have access to the following Tellor functions:

```solidity
    //retrieves current value for the id
    function getCurrentValue(uint256 _requestId) public view returns (bool ifRetrieve, uint256 value, uint256 _timestampRetrieved)

    //retrieves current value in EIP2362 format
    function valueFor(bytes32 _bytesId) view external returns (int value, uint256 timestamp, uint status)

    //retrieves qualified data before the specified timestamp (in order to wait for disputes/checks) and limits the amount of values to look back into
    function getDataBefore(uint256 _requestId, uint256 _timestamp, uint256 _limit, uint256 _offset) public view returns (bool _ifRetrieve, uint256 _value, uint256 _timestampRetrieved)

```

#### 3. To run tests:

In another terminal window run
```bash
ganache-cli
```

In the first terminal run
```bash
npm run test
```


### Useful Links

Miner [Documentation](https://tellor.readthedocs.io/en/latest/MinerSetup/)

General Tellor Developer's [Documentation](https://tellor.readthedocs.io/en/latest/DevDocumentation/)

Metamask - www.metamask.io 
<br>
Truffle - http://truffleframework.com/


#### Maintainers <a name="maintainers"> </a> 
[@themandalore](https://github.com/themandalore)
<br>
[@brendaloya](https://github.com/brendaloya) 


#### How to Contribute<a name="how2contribute"> </a>  
Join our Discord or Telegram:
[<img src="./public/telegram.png" width="24" height="24">](https://t.me/tellor)
[<img src="./public/discord.png" width="24" height="24">](https://discord.gg/zFcM3G)

Check out our issues log here on Github or contribute to our future plans to build a better miner and more examples of data secured by Tellor. 


#### Contributors<a name="contributors"> </a>

This repository is maintained by the Tellor team - [www.tellor.io](https://www.tellor.io)


#### Copyright

Tellor Inc. 2019