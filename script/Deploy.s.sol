// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/TokenizedMutualFund.sol";

contract DeployTokenizedMutualFund is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Set a smaller starting NAV — a share is worth 0.01 ETH
        uint256 initialNav = 0.01 ether;

        // Sepolia ETH/USD Chainlink Price Feed (can be changed based on network)
        // For Sepolia: 0x694AA1769357215DE4FAC081bf1f309aDC325306
        address priceFeedAddress = vm.envAddress("CHAINLINK_PRICE_FEED");
        
        TokenizedMutualFund fund = new TokenizedMutualFund(initialNav, priceFeedAddress);
        console.log("TokenizedMutualFund deployed at:", address(fund));
        console.log("Price feed set to:", priceFeedAddress);

        vm.stopBroadcast();
    }
}