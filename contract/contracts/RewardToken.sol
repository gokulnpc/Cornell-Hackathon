// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {

    constructor(address initialOwner) ERC20("RewardToken", "RTK") Ownable(initialOwner) {
        // Mint initial supply of tokens to the contract owner (e.g., 1 million tokens)
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    // Function to mint new tokens (owner only)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // Function to burn tokens (owner only)
    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}