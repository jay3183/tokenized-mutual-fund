// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/TokenizedMutualFund.sol";

contract DeployScript is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy with initial NAV of 1 ETH
        TokenizedMutualFund fund = new TokenizedMutualFund(1 ether);
        console.log("TokenizedMutualFund deployed to:", address(fund));

        vm.stopBroadcast();
    }
} 