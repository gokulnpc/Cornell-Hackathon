// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockPYUSD is ERC20 {

    constructor() ERC20("MockPYUSD", "mockPYUSD") {}

    function mint(address to, uint256 value) public virtual {
        _mint(to, value);
    }
}