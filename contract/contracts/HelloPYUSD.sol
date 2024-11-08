// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HelloPYUSD is ERC721URIStorage, Ownable {
    uint256 public totalIssued;
    IERC20 public immutable mintToken;
    uint256 public immutable mintPrice;

    constructor(address _mintToken, uint256 _mintPrice)
        ERC721("HelloPYUSD", "HIPYPL") Ownable(msg.sender)
    {
        mintToken = IERC20(_mintToken);
        mintPrice = _mintPrice;
    }

    function mint(string memory newTokenURI) external {
        require(
            mintToken.transferFrom(msg.sender, address(this), mintPrice),
            "Transfer of PYUSD failed"
        );

        uint256 newTokenId = totalIssued;
        totalIssued++;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, newTokenURI);
    }

    function withdrawToken(address token, address to) external onlyOwner {
        IERC20(token).transfer(to, IERC20(token).balanceOf(address(this)));
    }
}