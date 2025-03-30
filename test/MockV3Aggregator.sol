// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/**
 * @title MockV3Aggregator
 * @notice Use this mock for testing applications with a price feed
 */
contract MockV3Aggregator is AggregatorV3Interface {
    uint8 private _decimals;
    int256 private _answer;
    uint256 private _startedAt;
    uint256 private _updatedAt;
    uint80 private _roundId;

    mapping(uint80 => int256) private answers;
    mapping(uint80 => uint256) private startedAts;
    mapping(uint80 => uint256) private updatedAts;

    constructor(uint8 __decimals, int256 _initialAnswer) {
        _decimals = __decimals;
        updateAnswer(_initialAnswer);
    }
    
    function decimals() external view override returns (uint8) {
        return _decimals;
    }

    function description() external pure override returns (string memory) {
        return "MockV3Aggregator";
    }

    function version() external pure override returns (uint256) {
        return 0;
    }

    function updateAnswer(int256 answer) public {
        _roundId++;
        _answer = answer;
        _startedAt = block.timestamp;
        _updatedAt = block.timestamp;
        
        answers[_roundId] = answer;
        startedAts[_roundId] = block.timestamp;
        updatedAts[_roundId] = block.timestamp;
    }

    function getRoundData(uint80 roundId)
        external
        view
        override
        returns (
            uint80 roundId_,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (
            roundId,
            answers[roundId],
            startedAts[roundId],
            updatedAts[roundId],
            roundId
        );
    }

    function latestRoundData()
        external
        view
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (
            _roundId,
            _answer,
            _startedAt,
            _updatedAt,
            _roundId
        );
    }
} 