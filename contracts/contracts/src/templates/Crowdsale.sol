// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SimpleCrowdsale is Ownable, ReentrancyGuard {
    IERC20 public token;
    uint256 public rate;
    uint256 public openingTime;
    uint256 public closingTime;

    event TokenPurchased(address purchaser, address beneficiary, uint256 value, uint256 amount);

    constructor(uint256 _rate, uint256 _openingTime, uint256 _closingTime, address _token)
        Ownable(msg.sender)
        ReentrancyGuard()
    {
        require(_closingTime > _openingTime, "closing time is before opening time");
        require(_rate > 0, "rate is 0");
        token = IERC20(_token);
        rate = _rate;
        openingTime = _openingTime;
        closingTime = _closingTime;
    }

    function buyTokens(address beneficiary) public payable nonReentrant {
        require(block.timestamp >= openingTime, "Crowdsale is not open yet");
        require(block.timestamp <= closingTime, "Crowdsale is closed");
        uint256 weiAmount = msg.value;
        require(weiAmount > 0, "weiAmount is 0");

        uint256 tokens = weiAmount * rate;
        require(token.transfer(beneficiary, tokens), "Token transfer failed");

        emit TokenPurchased(msg.sender, beneficiary, weiAmount, tokens);
    }
}
