// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTCollection is ERC721, ERC721URIStorage, Ownable {
    uint256 public totalIssued;

    constructor(address initialOwner)
        ERC721("AI NFT", "AINFT")
        Ownable(initialOwner)
    {}

    // Function for the contract owner to mint NFTs (similar to safeMint)
    function ownerMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = totalIssued;
        totalIssued++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // Function that allows anyone to mint an NFT
    function publicMint(string memory uri) public {
        uint256 tokenId = totalIssued;
        totalIssued++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}