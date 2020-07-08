pragma solidity >=0.4.21 <0.7.0;
import "usingtellor/contracts/UsingTellor.sol";
// import "usingtellor/contracts/libraries/TellorLibrary.sol";
// import "usingtellor/contracts/testContracts/Tellor.sol";

contract SampleUsingTellor is UsingTellor {
  uint public tellorID;
  uint public qualifiedValue;
  uint public currentValue;
  uint public granularity;

  constructor(uint _tellorID, address payable _tellorAddress,uint _granularity) UsingTellor(_tellorAddress) public {
    tellorID = _tellorID;
    granularity = _granularity;
  }

  function updateValues(uint _limit,uint _offset) external {
    bool _didGet;
    uint _timestamp;
    uint _value;

    (_didGet,_value,_timestamp) = getDataBefore(tellorID, now - 1 hours,_limit, _offset);
    if(_didGet){
      qualifiedValue = _value/granularity;
    }

    (_didGet,currentValue,_timestamp) = getCurrentValue(tellorID);
    currentValue = currentValue / granularity;
  }

}
