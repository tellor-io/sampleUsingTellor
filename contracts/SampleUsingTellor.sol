// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "usingtellor/contracts/UsingTellor.sol";

contract SampleUsingTellor is UsingTellor {
    constructor(address payable _tellorAddress) UsingTellor(_tellorAddress) {}

    function readTellorValue(bytes32 _queryId)
        external
        view
        returns (bytes memory)
    {
        //Helper function to get latest available value for that Id
        (bool ifRetrieve, bytes memory _value, ) =
            getCurrentValue(_queryId);
        if (!ifRetrieve) return "0x";
        return _value;
    }

    function readTellorValueBefore(bytes32 _queryId, uint256 _timestamp)
        external view
        returns (bytes memory, uint256)
    {
        //Helper Function to get a value before the given timestamp
        (bool _ifRetrieve, bytes memory _value, uint256 _timestampRetrieved) =
            getDataBefore(_queryId, _timestamp);
        if (!_ifRetrieve) return ("0x", 0);
        return (_value, _timestampRetrieved);
    }
}