// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract GuardedTellorCaller {
    mapping(address => bool) public guardians;
    bool public paused;
    address public tellor;

    event GuardianAdded(address indexed guardian);
    event Paused();
    event Unpaused();

    constructor(address _tellor, address _firstGuardian) {
        tellor = _tellor;
        guardians[_firstGuardian] = true;
    }

    function addGuardian(address _newGuardian) public {
        require(guardians[msg.sender], "Not a guardian");
        guardians[_newGuardian] = true;
        emit GuardianAdded(_newGuardian);
    }

    function pause() public {
        require(guardians[msg.sender], "Not a guardian");
        paused = true;
        emit Paused();
    }

    function unpause() public {
        require(guardians[msg.sender], "Not a guardian");
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