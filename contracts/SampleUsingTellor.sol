// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "usingtellor/contracts/UsingTellor.sol";

contract SampleUsingTellor is UsingTellor {
    bytes queryData = abi.encode("SpotPrice", abi.encode("eth", "usd"));
    bytes32 queryId = keccak256(queryData);

    uint256 public ethPrice;

    constructor(address payable _tellorAddress) UsingTellor(_tellorAddress) {}

    function readEthPrice()
        public view
        returns (bytes memory, uint256)
    {
        // Helper Function to get a value before the given timestamp
        (bytes memory _value, uint256 _timestampRetrieved) =
            getDataBefore(queryId, block.timestamp - 15 minutes);
        if (_timestampRetrieved == 0) return (bytes(""), 0);
        return (_value, _timestampRetrieved);
    }
}