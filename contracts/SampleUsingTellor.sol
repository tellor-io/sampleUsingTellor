pragma solidity >=0.5.16;
import "usingtellor/contracts/UsingTellor.sol";
import "usingtellor/contracts/TellorPlayground.sol";

contract SampleUsingTellor is UsingTellor {
    constructor(address payable _tellorAddress)
        public
        UsingTellor(_tellorAddress)
    {}

    function readTellorValue(uint256 _tellorID)
        external
        view
        returns (uint256)
    {
        //Helper function to get latest available value for that Id
        (bool ifRetrieve, uint256 value, uint256 _timestampRetrieved) =
            getCurrentValue(_tellorID);
        if (!ifRetrieve) return 0;
        return value;
    }

    function readTellorValueBefore(uint256 _tellorId, uint256 _timestamp)
        external
        returns (uint256, uint256)
    {
        //Helper Function to get a value before the given timestamp
        (bool _ifRetrieve, uint256 _value, uint256 _timestampRetrieved) =
            getDataBefore(_tellorId, _timestamp);
        if (!_ifRetrieve) return (0, 0);
        return (_value, _timestampRetrieved);
    }
}
