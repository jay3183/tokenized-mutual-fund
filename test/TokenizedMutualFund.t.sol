// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/TokenizedMutualFund.sol";

contract TokenizedMutualFundTest is Test {
    TokenizedMutualFund public fund;
    address public owner = address(1);
    address public user = address(2);

    function setUp() public {
        vm.startPrank(owner);
        fund = new TokenizedMutualFund(1 ether);
        vm.stopPrank();
    }

    function testInitialState() public {
        assertEq(fund.navPerShare(), 1 ether);
        assertEq(fund.owner(), owner);
    }

    function testMintShares() public {
        vm.startPrank(user);
        vm.deal(user, 2 ether);
        fund.mint{value: 2 ether}();
        assertEq(fund.balanceOf(user), 2 ether);
        vm.stopPrank();
    }

    function testRedeemShares() public {
        // First mint some shares
        vm.startPrank(user);
        vm.deal(user, 2 ether);
        fund.mint{value: 2 ether}();
        
        // Then redeem them
        fund.redeem(1 ether);
        assertEq(fund.balanceOf(user), 1 ether);
        vm.stopPrank();
    }

    function testUpdateNav() public {
        vm.startPrank(owner);
        fund.setNAV(2 ether);
        assertEq(fund.navPerShare(), 2 ether);
        vm.stopPrank();
    }

    function testFailUpdateNavNotOwner() public {
        vm.startPrank(user);
        fund.setNAV(2 ether);
    }

    function testFailRedeemInsufficientBalance() public {
        vm.startPrank(user);
        fund.redeem(1 ether);
    }
} 