// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "usingtellor/contracts/UsingTellor.sol";

contract SampleUsingTellor is UsingTellor {
    constructor(address payable _tellorAddress) UsingTellor(_tellorAddress) {}

    function readTellorValueBefore(bytes32 _queryId, uint256 _timestamp)
        external view
        returns (bytes memory, uint256)
    {
        //Helper Function to get a value before the given timestamp
        (bytes memory _value, uint256 _timestampRetrieved) =
            getDataBefore(_queryId, _timestamp);
        return (_value, _timestampRetrieved);
    }
}