// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/// @title Tokenized Mutual Fund (FTF)
/// @author Jason C.
/// @notice Lets users invest ETH and receive fund shares based on NAV; supports minting, redeeming, and NAV updates.
/// @dev Uses OpenZeppelin libraries for access control, pausability, and reentrancy protection.
contract TokenizedMutualFund is ERC20, Ownable, Pausable, ReentrancyGuard {
    /// @notice Net Asset Value (NAV) per share, priced in wei (e.g. 1e18 = 1 ETH)
    uint256 public navPerShare;

    /// @notice Chainlink Price Feed interface for getting NAV data
    AggregatorV3Interface public priceFeed;

    /// @notice Flag to enable or disable Chainlink price feed usage
    bool public usePriceFeed;

    /// @notice Emitted when a user mints new shares by sending ETH
    event Minted(address indexed user, uint256 amountEth, uint256 shares);

    /// @notice Emitted when a user redeems shares and receives ETH
    event Redeemed(address indexed user, uint256 shares, uint256 amountEth);

    /// @notice Emitted when the owner updates the NAV
    event NAVUpdated(uint256 newNav, address indexed updatedBy);

    /// @notice Emitted when ETH is rescued from the contract
    event ETHRescued(address indexed to, uint256 amount);

    /// @notice Emitted when price feed is updated
    event PriceFeedUpdated(address indexed newPriceFeed);

    /// @notice Emitted when price feed usage is toggled
    event PriceFeedUsageToggled(bool usePriceFeed);

    /// @notice Minimum number of shares that can be minted (prevents spam or dust txs)
    uint256 public constant MINIMUM_MINT_SHARES = 1e6; // 0.000001 FTF

    /// @param initialNav Starting NAV per share (in wei). Must be greater than zero.
    /// @param _priceFeed Optional Chainlink Price Feed address (set to zero address to not use)
    constructor(uint256 initialNav, address _priceFeed) ERC20("Franklin Templeton Fund", "FTF") Ownable(msg.sender) {
        require(initialNav > 0, "Initial NAV must be > 0");
        navPerShare = initialNav;
        
        if (_priceFeed != address(0)) {
            priceFeed = AggregatorV3Interface(_priceFeed);
            usePriceFeed = true;
        }
    }

    /// @notice Mint fund shares by sending ETH based on the current NAV
    /// @dev Calculates how many shares to mint based on `navPerShare`
    function mint() external payable whenNotPaused nonReentrant {
        require(navPerShare > 0, "NAV not set");
        require(msg.value > 0, "Must send ETH to mint");

        uint256 sharesToMint = (msg.value * 1e18) / navPerShare;
        require(sharesToMint >= MINIMUM_MINT_SHARES, "Mint too small");

        _mint(msg.sender, sharesToMint);
        emit Minted(msg.sender, msg.value, sharesToMint);
    }

    /// @notice Redeem your fund shares to receive ETH back at the current NAV
    /// @param shareAmount Number of FTF tokens to redeem
    /// @dev Burns the caller's shares and transfers ETH based on `navPerShare`
    function redeem(uint256 shareAmount) external whenNotPaused nonReentrant {
        require(balanceOf(msg.sender) >= shareAmount, "Not enough shares");

        uint256 ethToReturn = (shareAmount * navPerShare) / 1e18;
        require(address(this).balance >= ethToReturn, "Insufficient ETH in contract");

        _burn(msg.sender, shareAmount);
        payable(msg.sender).transfer(ethToReturn);
        emit Redeemed(msg.sender, shareAmount, ethToReturn);
    }

    /// @notice Update the NAV per share (only callable by the owner)
    /// @param newNav The updated NAV value (in wei)
    /// @dev Used to reflect changes in the fund's real-world asset value
    function setNAV(uint256 newNav) external onlyOwner {
        require(newNav > 0, "Invalid NAV");
        navPerShare = newNav;
        emit NAVUpdated(newNav, msg.sender);
    }

    /// @notice Get the latest NAV from Chainlink price feed
    /// @return The latest price data from the Chainlink oracle
    function getLatestNAV() public view returns (int256) {
        require(address(priceFeed) != address(0), "Price feed not set");
        
        (, int256 price,,,) = priceFeed.latestRoundData();
        return price; // Typically with 8 decimals
    }

    /// @notice Set a new Chainlink price feed address
    /// @param _priceFeed Address of the Chainlink price feed
    function setPriceFeed(address _priceFeed) external onlyOwner {
        require(_priceFeed != address(0), "Invalid price feed address");
        priceFeed = AggregatorV3Interface(_priceFeed);
        emit PriceFeedUpdated(_priceFeed);
    }

    /// @notice Toggle whether to use Chainlink price feed
    /// @param _usePriceFeed Boolean to enable/disable price feed usage
    function togglePriceFeed(bool _usePriceFeed) external onlyOwner {
        usePriceFeed = _usePriceFeed;
        emit PriceFeedUsageToggled(_usePriceFeed);
    }

    /// @notice Update NAV using the Chainlink price feed
    /// @dev Converts the Chainlink price (usually 8 decimals) to wei (18 decimals)
    function updateNAVFromChainlink() external onlyOwner {
        require(address(priceFeed) != address(0), "Price feed not set");
        require(usePriceFeed, "Price feed usage is disabled");
        
        int256 price = getLatestNAV();
        require(price > 0, "Invalid price from oracle");
        
        // Convert from Chainlink decimals (typically 8) to wei (18 decimals)
        uint256 newNav = uint256(price) * 10**10;
        navPerShare = newNav;
        
        emit NAVUpdated(newNav, msg.sender);
    }

    /// @notice Emergency function to rescue ETH from the contract
    /// @param to Address to send the rescued ETH to
    /// @dev Only callable by the owner in emergency situations
    function rescueETH(address to) external onlyOwner {
        require(to != address(0), "Cannot send to zero address");
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to rescue");
        
        payable(to).transfer(balance);
        emit ETHRescued(to, balance);
    }

    /// @notice Pause minting and redeeming in case of emergency
    /// @dev Only callable by the owner
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Resume minting and redeeming after a pause
    /// @dev Only callable by the owner
    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice Returns the total ETH currently held in the fund
    /// @return Total ETH balance of the contract in wei
    function totalAssets() external view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Accepts ETH deposits directly (used for minting and funding redemptions)
    receive() external payable {}
}