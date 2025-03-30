// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/TokenizedMutualFund.sol";
import "./MockV3Aggregator.sol";

/// @title TokenizedMutualFundTest
/// @notice Unit tests for the TokenizedMutualFund contract using Foundry
contract TokenizedMutualFundTest is Test {
    uint256 constant TEST_NAV = 0.01 ether; // 1 ETH = 100 FTF tokens
    uint8 constant PRICE_FEED_DECIMALS = 8;
    int256 constant INITIAL_PRICE = 2500 * 10**8; // $2500 with 8 decimals
    
    TokenizedMutualFund public fund;
    MockV3Aggregator public priceFeed;
    address public owner = address(1);
    address public user = address(2);
    address public rescueAddress = address(3);

    function setUp() public {
        // Deploy mock price feed first
        priceFeed = new MockV3Aggregator(
            PRICE_FEED_DECIMALS,
            INITIAL_PRICE
        );
        
        vm.startPrank(owner);
        fund = new TokenizedMutualFund(TEST_NAV, address(priceFeed));
        vm.stopPrank();
        
        // Give some ETH to our test user
        vm.deal(user, 10 ether);
    }

    function testMintAndRedeem() public {
        uint256 mintAmount = 1 ether;
        uint256 expectedShares = (mintAmount * 1e18) / TEST_NAV; // 100 FTF tokens
        
        // Mint tokens
        vm.prank(user);
        fund.mint{value: mintAmount}();
        
        // Check balances
        assertEq(fund.balanceOf(user), expectedShares);
        assertEq(address(fund).balance, mintAmount);
        
        // Redeem tokens
        vm.prank(user);
        fund.redeem(expectedShares);
        
        // Check balances after redemption
        assertEq(fund.balanceOf(user), 0);
        assertEq(address(fund).balance, 0);
    }

    function testPause() public {
        // Pause the contract
        vm.prank(owner);
        fund.pause();
        
        // Try to mint - should fail
        vm.prank(user);
        vm.expectRevert(abi.encodeWithSignature("EnforcedPause()"));
        fund.mint{value: 1 ether}();
        
        // Unpause the contract
        vm.prank(owner);
        fund.unpause();
        
        // Now minting should work
        vm.prank(user);
        fund.mint{value: 1 ether}();
        
        // Check balance
        assertGt(fund.balanceOf(user), 0);
    }

    function testSetNAV() public {
        uint256 newNAV = 0.02 ether; // 1 ETH = 50 FTF tokens
        
        // Set new NAV
        vm.prank(owner);
        fund.setNAV(newNAV);
        
        // Check new NAV
        assertEq(fund.navPerShare(), newNAV);
        
        // Mint with new NAV
        uint256 mintAmount = 1 ether;
        uint256 expectedShares = (mintAmount * 1e18) / newNAV; // 50 FTF tokens
        
        vm.prank(user);
        fund.mint{value: mintAmount}();
        
        // Check balance
        assertEq(fund.balanceOf(user), expectedShares);
    }

    function testOnlyOwnerCanCallAdminFunctions() public {
        // Try to set NAV as non-owner
        vm.prank(user);
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", user));
        fund.setNAV(0.02 ether);
        
        // Try to pause as non-owner
        vm.prank(user);
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", user));
        fund.pause();
    }

    function testGetLatestNAV() public {
        // Check the latest price from the mock feed
        int256 price = fund.getLatestNAV();
        assertEq(price, INITIAL_PRICE);
    }

    function testUpdateNAVFromChainlink() public {
        // Update the price in the mock feed
        int256 newPrice = 3000 * 10**8; // $3000 
        priceFeed.updateAnswer(newPrice);
        
        // Update NAV from Chainlink
        vm.prank(owner);
        fund.updateNAVFromChainlink();
        
        // Check that NAV was updated correctly (converting from 8 decimals to 18)
        uint256 expectedNAV = uint256(newPrice) * 10**10;
        assertEq(fund.navPerShare(), expectedNAV);
    }

    function testTogglePriceFeed() public {
        // Toggle price feed off
        vm.prank(owner);
        fund.togglePriceFeed(false);
        
        // Try to update from Chainlink - should fail
        vm.prank(owner);
        vm.expectRevert("Price feed usage is disabled");
        fund.updateNAVFromChainlink();
        
        // Toggle price feed back on
        vm.prank(owner);
        fund.togglePriceFeed(true);
        
        // Now update should work
        vm.prank(owner);
        fund.updateNAVFromChainlink();
    }

    function testSetPriceFeed() public {
        // Deploy a new mock price feed
        MockV3Aggregator newPriceFeed = new MockV3Aggregator(
            PRICE_FEED_DECIMALS,
            5000 * 10**8  // $5000
        );
        
        // Set the new price feed
        vm.prank(owner);
        fund.setPriceFeed(address(newPriceFeed));
        
        // Check that the price feed was updated
        assertEq(address(fund.priceFeed()), address(newPriceFeed));
        
        // Check latest price from new feed
        int256 price = fund.getLatestNAV();
        assertEq(price, 5000 * 10**8);
    }

    function testRescueETH() public {
        // First mint some tokens to get ETH in the contract
        vm.prank(user);
        fund.mint{value: 5 ether}();
        
        // Check contract balance
        assertEq(address(fund).balance, 5 ether);
        
        // Rescue the ETH
        uint256 beforeBalance = rescueAddress.balance;
        vm.prank(owner);
        fund.rescueETH(rescueAddress);
        
        // Check balances
        assertEq(address(fund).balance, 0);
        assertEq(rescueAddress.balance, beforeBalance + 5 ether);
    }

    function testRescueETHFailsIfNoETH() public {
        // Try to rescue when contract has no ETH
        vm.prank(owner);
        vm.expectRevert("No ETH to rescue");
        fund.rescueETH(rescueAddress);
    }

    function testRescueETHFailsForNonOwner() public {
        // Add ETH to contract
        vm.prank(user);
        fund.mint{value: 1 ether}();
        
        // Try to rescue as non-owner
        vm.prank(user);
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", user));
        fund.rescueETH(rescueAddress);
    }

    receive() external payable {}
}