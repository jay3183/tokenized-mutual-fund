// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TokenizedMutualFund is ERC20, Ownable {
    using SafeMath for uint256;
    uint256 public navPerShare; // NAV per share in wei, e.g., 1e18 = 1 ETH

    constructor(uint256 initialNav) ERC20("Franklin Templeton Fund", "FTF") {
        navPerShare = initialNav;
    }

    /// @notice Mint fund shares by sending ETH based on current NAV
    function mint() external payable {
        require(navPerShare > 0, "NAV not set");
        require(msg.value > 0, "Must send ETH to mint");

        uint256 sharesToMint = msg.value.mul(1e18).div(navPerShare);
        _mint(msg.sender, sharesToMint);
    }

    /// @notice Redeem fund shares and receive ETH based on current NAV
    function redeem(uint256 shareAmount) external {
        require(balanceOf(msg.sender) >= shareAmount, "Not enough shares");

        uint256 ethToReturn = shareAmount.mul(navPerShare).div(1e18);
        require(address(this).balance >= ethToReturn, "Not enough ETH in reserve");

        _burn(msg.sender, shareAmount);
        payable(msg.sender).transfer(ethToReturn);
    }

    /// @notice Update the NAV per share (only by owner/admin)
    function setNAV(uint256 newNav) external onlyOwner {
        require(newNav > 0, "Invalid NAV");
        navPerShare = newNav;
    }

    /// @notice Fallback to receive ETH
    receive() external payable {}
}


