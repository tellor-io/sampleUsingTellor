// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract GuardedTellorCaller {
    mapping(address => bool) public guardians;
    bool public paused;
    address public tellor;
    uint256 public guardianCount;

    event GuardianAdded(address indexed guardian);
    event GuardianRemoved(address indexed guardian);
    event Paused();
    event Unpaused();

    constructor(address _tellor, address _firstGuardian) {
        tellor = _tellor;
        guardians[_firstGuardian] = true;
        guardianCount++;
    }

    function addGuardian(address _newGuardian) public {
        require(guardians[msg.sender], "Not a guardian");
        require(!guardians[_newGuardian], "Guardian already exists");
        guardians[_newGuardian] = true;
        guardianCount++;
        emit GuardianAdded(_newGuardian);
    }

    function removeGuardian(address _guardian) public {
        require(guardians[msg.sender], "Not a guardian");
        require(guardians[_guardian], "Guardian does not exist");
        require(guardianCount > 1, "Cannot remove last guardian");
        guardians[_guardian] = false;
        guardianCount--;
        emit GuardianRemoved(_guardian);
    }

    function pause() public {
        require(guardians[msg.sender], "Not a guardian");
        require(!paused, "Already paused");
        paused = true;
        emit Paused();
    }

    function unpause() public {
        require(guardians[msg.sender], "Not a guardian");
        require(paused, "Already unpaused");
        paused = false;
        emit Unpaused();
    }

    fallback(bytes calldata _msgData) external payable returns (bytes memory) {
        require(!paused, "Tellor is paused");
        (bool success, bytes memory data) = tellor.call{value: msg.value}(_msgData);
        require(success, "Tellor call failed");
        // Return the data using inline assembly
        assembly {
            return(add(data, 0x20), mload(data))
        }
    }

    receive() external payable {}
}