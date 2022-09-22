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

For more in-depth information about Tellor, check out our [documentation](https://docs.tellor.io/tellor/).

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

    bytes memory _b = abi.encode("SpotPrice",abi.encode("btc","usd"));
    bytes32 _queryID = keccak256(_b);

    uint256 _timestamp;
    bytes _value;

    (_value, _timestamp) = getDataBefore(_queryId);

    btcPrice = abi.decode(_value,(uint256));
  }
}
```

#### 3. The sample contract `SampleUsingTellor` has access to the following Tellor functions:

```solidity
    /**
     * @dev Retrieves the next value for the queryId after the specified timestamp
     * @param _queryId is the queryId to look up the value for
     * @param _timestamp after which to search for next value
     * @return _value the value retrieved
     * @return _timestampRetrieved the value's timestamp
     */
      function getDataAfter(bytes32 _queryId, uint256 _timestamp)
          public
          view
          returns (bytes memory _value, uint256 _timestampRetrieved);

    /**
     * @dev Retrieves the latest value for the queryId before the specified timestamp
     * @param _queryId is the queryId to look up the value for
     * @param _timestamp before which to search for latest value
     * @return _value the value retrieved
     * @return _timestampRetrieved the value's timestamp
     */
      function getDataBefore(bytes32 _queryId, uint256 _timestamp)
          public
          view
          returns (bytes memory _value, uint256 _timestampRetrieved);

    /**
     * @dev Retrieves next array index of data after the specified timestamp for the queryId
     * @param _queryId is the queryId to look up the index for
     * @param _timestamp is the timestamp after which to search for the next index
     * @return _found whether the index was found
     * @return _index the next index found after the specified timestamp
     */
      function getIndexForDataAfter(bytes32 _queryId, uint256 _timestamp)
          public
          view
          returns (bool _found, uint256 _index);

    /**
     * @dev Retrieves latest array index of data before the specified timestamp for the queryId
     * @param _queryId is the queryId to look up the index for
     * @param _timestamp is the timestamp before which to search for the latest index
     * @return _found whether the index was found
     * @return _index the latest index found before the specified timestamp
     */
      function getIndexForDataBefore(bytes32 _queryId, uint256 _timestamp)
          public
          view
          returns (bool _found, uint256 _index);

    /**
     * @dev Retrieves multiple uint256 values before the specified timestamp
     * @param _queryId the unique id of the data query
     * @param _timestamp the timestamp before which to search for values
     * @param _maxAge the maximum number of seconds before the _timestamp to search for values
     * @param _maxCount the maximum number of values to return
     * @return _values the values retrieved, ordered from oldest to newest
     * @return _timestamps the timestamps of the values retrieved
     */
      function getMultipleValuesBefore(
          bytes32 _queryId,
          uint256 _timestamp,
          uint256 _maxAge,
          uint256 _maxCount
      )
          public
          view
          returns (bytes[] memory _values, uint256[] memory _timestamps);
    
    /**
     * @dev Counts the number of values that have been submitted for the queryId
     * @param _queryId the id to look up
     * @return uint256 count of the number of values received for the queryId
     */
      function getNewValueCountbyQueryId(bytes32 _queryId)
          public
          view
          returns (uint256);
    
    /**
     * @dev Gets the timestamp for the value based on their index
     * @param _queryId is the id to look up
     * @param _index is the value index to look up
     * @return uint256 timestamp
     */
      function getTimestampbyQueryIdandIndex(bytes32 _queryId, uint256 _index)
          public
          view
          returns (uint256);
    
    /**
     * @dev Determines whether a value with a given queryId and timestamp has been disputed
     * @param _queryId is the value id to look up
     * @param _timestamp is the timestamp of the value to look up
     * @return bool true if queryId/timestamp is under dispute
     */
      function isInDispute(bytes32 _queryId, uint256 _timestamp)
          public
          view
          returns (bool);
    
    /**
     * @dev allows dev to set mapping contract for valueFor (EIP2362)
     * @param _addy address of mapping contract
     */
      function setIdMappingContract(address _addy) external;
    
    /**
     * @dev Retrieve most recent int256 value from oracle based on queryId
     * @param _id being requested
     * @return _value most recent value submitted
     * @return _timestamp timestamp of most recent value
     * @return _statusCode 200 if value found, 404 if not found
     */
      function valueFor(bytes32 _id)
          external
          view
          override
          returns (
              int256 _value,
              uint256 _timestamp,
              uint256 _statusCode
          );

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
     * @param _queryId is the queryId to look up
     * @param _index is the value index to look up
     * @return uint256 timestamp
     */
      function getTimestampbyQueryIdandIndex(bytes32 _queryId, uint256 _index) public view
      returns (uint256);

```

#### 5. To run tests:

```bash
npm hardhat test
```

#### 6. Deployment:
Just run hardhat run with desired Network

```bash
npx hardhat run --network <your-network> scripts/deploy.js
```


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
