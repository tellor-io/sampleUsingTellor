// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {SampleUsingTellor} from "../src/SampleUsingTellor.sol";

contract SampleUsingTellorTest is Test {
    SampleUsingTellor public sampleUsingTellor;

    function setUp() public {
        sampleUsingTellor = new SampleUsingTellor();
    }

    function test_ReadETHPrice() public {
        counter.increment();
        assertEq(counter.number(), 1);
    }

    function test_ChangeETHPrice(uint256 x) public {
        counter.setNumber(x);
        assertEq(counter.number(), x);
    }
}
