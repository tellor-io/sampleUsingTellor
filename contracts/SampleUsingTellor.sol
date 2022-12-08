// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "usingtellor/contracts/UsingTellor.sol";

contract SampleUsingTellor is UsingTellor {
    bytes public queryData = abi.encode("SpotPrice", abi.encode("eth", "usd"));
    bytes32 public queryId = keccak256(queryData);
    uint256 public ethPrice;

    // Input tellor oracle address
    constructor(address payable _tellorAddress) UsingTellor(_tellorAddress) {}

    function readEthPrice()
        public
    {
        // Retrieve data at least 15 minutes old to allow time for disputes
        (bytes memory _value, uint256 _timestampRetrieved) =
            getDataBefore(queryId, block.timestamp - 15 minutes);
        // If data is available, parse it
        if(_timestampRetrieved > 0) {
            // Use the helper function _sliceUint to parse the bytes to uint256
            ethPrice = _sliceUint(_value);
        }
    }
}
