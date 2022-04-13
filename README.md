<p align="center">
  <a href='https://www.tellor.io/'>
    <img src= 'https://raw.githubusercontent.com/tellor-io/TellorBrandMaterials/master/Swoosh%20and%20wordmark%20legacy/SwooshWordmarkLegacy.png' width="250" height="200" alt='tellor.io' />
  </a>
</p>

<p align="center">
  <a href='https://twitter.com/WeAreTellor'>
    <img src= 'https://img.shields.io/twitter/url/http/shields.io.svg?style=social' alt='Twitter WeAreTellor' />
  </a>
</p>


## Sample project UsingTellor <a name="sample"> </a>

<b>The Tellor oracle</b> is a decentralized oracle. It provides an option for contracts to interact securely with and obtain data from off-chain.

This repository aims to provide an updated version of sample code that uses Tellor by using Ethers.js, Waffle,and Hardhat.

For more in-depth information about Tellor, check out our [documentation](https://app.gitbook.com/@tellor-2/s/tellor-docs/), [whitepaper](https://tellor.io/whitepaper/) and [FAQ](https://tellor.io/faq/) page.

Quick references are included below:

# Implement Tellor into your project
This repo already includes the [usingTellor](https://github.com/tellor-io/usingtellor) package.

## How to use
#### 1. Clone project and install dependencies

```bash
git clone git@github.com:tellor-io/sampleUsingTellor.git
npm install
```

#### 2. How to Use
Just inherit the UsingTellor contract, passing the Tellor address as a constructor argument:

Here's an example:
```solidity
contract PriceContract is UsingTellor {

  uint256 public btcPrice;

  //This Contract now has access to all functions in UsingTellor

  constructor(address payable _tellorAddress) UsingTellor(_tellorAddress) public {}

  function setBtcPrice() public {

    bytes memory _b = abi.encode("SpotPrice",abi.encode("BTC","USD"));
    bytes32 _queryID = keccak256(_b);

    bool _didGet;
    uint256 _timestamp;
    bytes _value

    (_didGet, _value, _timestamp) = getCurrentValue(btcQueryId);

    btcPrice = abi.decode(_value,(uint256));
  }
}
```
#### [Oracle Addresses](https://github.com/tellor-io/TellorCore):

Mainnet **-**[ `0x88dF592F8eb5D7Bd38bFeF7dEb0fBc02cf3778a0`](https://etherscan.io/address/0x88dF592F8eb5D7Bd38bFeF7dEb0fBc02cf3778a0)

Rinkeby **-**[ `0x88dF592F8eb5D7Bd38bFeF7dEb0fBc02cf3778a0`](https://rinkeby.etherscan.io/address/0x88dF592F8eb5D7Bd38bFeF7dEb0fBc02cf3778a0)

#### 3. The sample contract `SampleUsingTellor` has access to the following Tellor functions:

```solidity
    /**
    * @dev Retrieve value from oracle based on requestId/timestamp
    * @param _queryId being requested
    * @param _timestamp to retrieve data/value from
    * @return uint value for queryId/timestamp submitted
    */
    function retrieveData(bytes32 _queryId, uint256 _timestamp) public view returns(uint256);

    /**
    * @dev Gets if the mined value for the specified requestId/_timestamp is currently under dispute
    * @param _queryId to lookup
    * @param _timestamp is the timestamp to look up miners for
    * @return bool true if requestId/timestamp is under dispute
    */
    function isInDispute(bytes32 _queryId, uint256 _timestamp) public view returns(bool);

    /**
    * @dev Counts the number of values that have been submited for the request
    * @param _queryId the query to look up
    * @return uint count of the number of values received for the requestId
    */
    function getNewValueCountbyRequestId(bytes32 _queryId) public view returns(uint);

    /**
    * @dev Gets the timestamp for the value based on their index
    * @param _queryId is the query to look up
    * @param _index is the value index to look up
    * @return uint timestamp
    */
    function getTimestampbyRequestIDandIndex(bytes32 _queryId, uint256 _index) public view returns(uint256);

    /**
    * @dev Allows the user to get the latest value for the requestId specified
    * @param _queryId is the query to look up the value for
    * @return bool true if it is able to retreive a value, the value, and the value's timestamp
    */
    function getCurrentValue(bytes32 _queryId) public view returns (bool ifRetrieve, bytes memory _value, uint256 _timestampRetrieved);

    /**
    * @dev Allows the user to get the first value for the requestId before the specified timestamp
    * @param _queryId is the query to look up the value for
    * @param _timestamp before which to search for first verified value
    * @return bool true if it is able to retreive a value, the value, and the value's timestamp
    */
    function getDataBefore(bytes32 _queryId, uint256 _timestamp)
        public
        view
        returns (bool _ifRetrieve, bytes memory _value, uint256 _timestampRetrieved);

```

#### Tellor Playground:

For ease of use, the  `UsingTellor`  repo comes with a version of [Tellor Playground](https://github.com/tellor-io/TellorPlayground) system for easier integration. This version contains a few helper functions:

```solidity
   /**
    * @dev A mock function to submit a value to be read without miners needed
    * @param _queryId The tellorId to associate the value to
    * @param _value the value for the queryId
    * @param _nonce the current value count for the query id
    * @param _queryData the data used by reporters to fulfill the data query
    */
    function submitValue(bytes32 _queryId, bytes calldata _value, uint256 _nonce, bytes memory _queryData) external;

    /**
    * @dev A mock function to create a dispute
    * @param _queryId The tellorId to be disputed
    * @param _timestamp the timestamp of the value to be disputed
    */
    function beginDispute(bytes32 _queryId, uint256 _timestamp) external;

     /**
    * @dev Retreive value from oracle based on requestId/timestamp
    * @param _queryId being requested
    * @param _timestamp to retrieve data/value from
    * @return bytes value for requestId/timestamp submitted
    */
    function retrieveData(bytes32 _queryId, uint256 _timestamp) public view returns (bytes memory);

    /**
    * @dev Counts the number of values that have been submitted for the request
    * @param _queryId the requestId to look up
    * @return uint256 count of the number of values received for the requestId
    */
    function getNewValueCountbyQueryId(bytes32 _queryId) public view returns(uint256);

    /**
    * @dev Gets the timestamp for the value based on their index
    * @param _queryId is the requestId to look up
    * @param _index is the value index to look up
    * @return uint256 timestamp
    */
    function getTimestampbyRequestIDandIndex(uint256 _queryId, uint256 index) public view returns(uint256);

    /**
     * @dev Adds a tip to a given query ID.
     * @param _queryId is the queryId to look up
     * @param _amount is the amount of tips
     * @param _queryData is the extra bytes data needed to fulfill the request
     */
    function tipQuery(bytes32 _queryId, uint256 _amount, bytes memory _queryData) external;
```

#### [Playground Addresses](https://github.com/tellor-io/TellorCore):

Rinkeby: [`0x20374E579832859f180536A69093A126Db1c8aE9`](https://rinkeby.etherscan.io/address/0x20374E579832859f180536A69093A126Db1c8aE9#code)

Kovan: [`0x20374E579832859f180536A69093A126Db1c8aE9`](https://kovan.etherscan.io/address/0x20374E579832859f180536A69093A126Db1c8aE9#code)

Ropsten: [`0x20374E579832859f180536A69093A126Db1c8aE9`](https://ropsten.etherscan.io/address/0x20374E579832859f180536A69093A126Db1c8aE9#code)

Goerli: [`0x20374E579832859f180536A69093A126Db1c8aE9`](https://goerli.etherscan.io/address/0x20374E579832859f180536A69093A126Db1c8aE9#code)

BSC Testnet: [`0xbc2f9E092ac5CED686440E5062D11D6543202B24`](https://testnet.bscscan.com/address/0xbc2f9E092ac5CED686440E5062D11D6543202B24#code)

Polygon Mumbai Testnet: [`0xbc2f9E092ac5CED686440E5062D11D6543202B24`](https://explorer-mumbai.maticvigil.com/address/0xbc2f9E092ac5CED686440E5062D11D6543202B24/contracts)

Arbitrum Testnet: [`0xbc2f9E092ac5CED686440E5062D11D6543202B24`](https://explorer.arbitrum.io/#/address/0xbc2f9E092ac5CED686440E5062D11D6543202B24)

#### 5. To run tests:

```bash
npm hardhat test
```

#### 6. Deployment:
Just run hardhat run with desired Network

```bash
npx hardhat run --network <your-network> scripts/deploy.js
```



### Useful Links

Miner [Documentation](https://tellor.readthedocs.io/en/latest/MinerSetup/)

General Tellor Developer's [Documentation](https://tellor.readthedocs.io/en/latest/DevDocumentation/)

Metamask - www.metamask.io
<br>
Hardhat - https://hardhat.org/
<br>
Waffle - https://getwaffle.io/


#### Maintainers <a name="maintainers"> </a>
[@themandalore](https://github.com/themandalore)
<br>
[@brendaloya](https://github.com/brendaloya)


#### How to Contribute<a name="how2contribute"> </a>  
Join our Discord:
[<img src="./public/discord.png" width="24" height="24">](https://discord.gg/teAMSZAfJZ)

Check out our issues log here on Github or contribute to our future plans to build a better miner and more examples of data secured by Tellor.


#### Contributors<a name="contributors"> </a>

This repository is maintained by the Tellor team - [www.tellor.io](https://www.tellor.io)


#### Copyright

Tellor Inc. 2022
