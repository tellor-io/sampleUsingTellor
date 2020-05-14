pragma solidity >=0.4.21 <0.7.0;
import "usingtellor/contracts/UsingTellor.sol";
// import "usingtellor/contracts/libraries/TellorLibrary.sol";
// import "usingtellor/contracts/testContracts/Tellor.sol";

contract SampleUsingTellor is UsingTellor {
  uint public tellorID;
  uint public qualifiedValue;
  uint public currentValue;

  constructor(uint _tellorID, address payable _tellorAddress) UsingTellor(_tellorAddress) public {
    tellorID = _tellorID;
  }

  function updateValues() external {
    bool _didGet;
    uint _timestamp;
    uint _value;

    (_didGet,_value,_timestamp) = getDataBefore(tellorID, now - 1 hours);
    if(_didGet){
      qualifiedValue = _value;
    }

    (_didGet,currentValue,_timestamp) = getCurrentValue(tellorID);
  }

}
