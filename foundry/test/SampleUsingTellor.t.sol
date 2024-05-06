// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {SampleUsingTellor} from "../src/SampleUsingTellor.sol";
import {TellorPlayground} from "usingtellor/TellorPlayground.sol";

contract SampleUsingTellorTest is Test {
    SampleUsingTellor public sampleUsingTellor;
    TellorPlayground public tellorPlayground;

    bytes public queryData = abi.encode("SpotPrice", abi.encode("eth", "usd"));
    bytes32 public queryId = keccak256(queryData);

    function setUp() public {
        tellorPlayground = new TellorPlayground();
        sampleUsingTellor = new SampleUsingTellor(payable(address(tellorPlayground)));
    }

    function test_ReadETHPrice() public {
        uint256 mockValue = 2000e18;
        tellorPlayground.submitValue(queryId, abi.encodePacked(mockValue), 0, queryData);
        vm.warp(block.timestamp + 901 seconds);
        sampleUsingTellor.readEthPrice();
        uint256 retrievedVal = sampleUsingTellor.ethPrice();
        assertEq(retrievedVal,mockValue);
    }
}
