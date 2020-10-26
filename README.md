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

#### 2. How to Use
Just Inherit the UsingTellor contract, passing the Tellor address as a constructor argument: 

Here's an example
```solidity 
contract BtcPriceContract is UsingTellor {

  //This Contract now have access to all functions on UsingTellor

  uint256 btcPrice;
  uint256 btcRequetId = 2;

  constructor(address payable _tellorAddress) UsingTellor(_tellorAddress) public {}

  function setBtcPrice() public {
    bool _didGet;
    uint _timestamp;
    uint _value;

    (_didGet, btcPrice, _timestamp) = getCurrentValue(btcRequetId);
  }
}
```
##### Addresses:
Mainnet: `0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5`
Rinkeby: `0xFe41Cb708CD98C5B20423433309E55b53F79134a`
Test: Use the MockTellor address


#### 3. The sample contract `SampleUsingTellor` have access to the following Tellor functions:

```solidity
    /**
    * @dev Retreive value from oracle based on requestId/timestamp
    * @param _requestId being requested
    * @param _timestamp to retreive data/value from
    * @return uint value for requestId/timestamp submitted
    */
    function retrieveData(uint256 _requestId, uint256 _timestamp) public view returns(uint256);

    /**
    * @dev Gets if the mined value for the specified requestId/_timestamp is currently under dispute
    * @param _requestId to looku p
    * @param _timestamp is the timestamp to look up miners for
    * @return bool true if requestId/timestamp is under dispute
    */
    function isInDispute(uint256 _requestId, uint256 _timestamp) public view returns(bool);

    /**
    * @dev Counts the number of values that have been submited for the request
    * @param _requestId the requestId to look up
    * @return uint count of the number of values received for the requestId
    */
    function getNewValueCountbyRequestId(uint256 _requestId) public view returns(uint);

    /**
    * @dev Gets the timestamp for the value based on their index
    * @param _requestId is the requestId to look up
    * @param _index is the value index to look up
    * @return uint timestamp
    */
    function getTimestampbyRequestIDandIndex(uint256 _requestId, uint256 _index) public view returns(uint256);

    /**
    * @dev Allows the user to get the latest value for the requestId specified
    * @param _requestId is the requestId to look up the value for
    * @return bool true if it is able to retreive a value, the value, and the value's timestamp
    */
    function getCurrentValue(uint256 _requestId) public view returns (bool ifRetrieve, uint256 value, uint256 _timestampRetrieved);

    /**
    * @dev Allows the user to get the first value for the requestId before the specified timestamp
    * @param _requestId is the requestId to look up the value for
    * @param _timestamp before which to search for first verified value
    * @return bool true if it is able to retreive a value, the value, and the value's timestamp
    */
    function getDataBefore(uint256 _requestId, uint256 _timestamp, uint256 _limit, uint256 _offset)
        public
        view
        returns (bool _ifRetrieve, uint256 _value, uint256 _timestampRetrieved);

```

#### 4. Mock Tellor:

For ease of use, the  `UsingTellor`  repo provides a MockTellor system for easier integration. This mock version contains a few helper functions:

```solidity
    /**
    * @dev The constructor allows for arbitrary balances on specified addresses;
    * @param _initialBalances The addresses that will have tokens
    * @param _intialAmounts How much TRB each address gets
    */
    constructor(address[] memory _initialBalances, uint256[] memory _intialAmounts) public;
    

    /**
    * @dev A mock function to submit a value to be read withoun miners needed
    * @param _requestId The tellorId to associate the value to
    * @param _value the value for the requestId
    */
    function submitValue(uint256 _requestId,uint256 _value) external;
    

    /**
    * @dev A mock function to create a dispute
    * @param _requestId The tellorId to be disputed
    * @param _timestamp the timestamp that indentifies for the value
    */
    function disputeValue(uint256 _requestId, uint256 _timestamp) external;

    /**
    * @dev A mock function to mint tokens
    * @param _holder The destination address 
    * @param _value the amount to be minted
    */
    function mint(address _holder, uint256 _value) public;

    /**
    * @dev A mock function to trasnfer tokens on behalf of any address, withou needing an approval
    * @param _from The origin address
    * @param _to The destination address 
    * @param _value the amount to be transferred
    */
    function transferFrom(address _from, address _to, uint256 _amount) public returns(bool);

```

#### 5. To run tests:

```bash
npm run test
```

#### 6. Migrations:
Just run truffle migrate with desired Network

```bash
truffle migrate --network rinkeby
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