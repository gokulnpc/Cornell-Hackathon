// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is Ownable {
    struct Listing {
        address seller;
        uint256 price;
        address nftContract;
        uint256 tokenId;
    }

    mapping(bytes32 => Listing) public listings;
    bytes32[] public listingIds; // Store listing IDs for iteration

    constructor() Ownable(msg.sender) {}

    event NFTListed(address indexed seller, address indexed nftContract, uint256 indexed tokenId, uint256 price);
    event NFTBought(address indexed buyer, address indexed nftContract, uint256 indexed tokenId, uint256 price);
    event NFTListingCancelled(address indexed seller, address indexed nftContract, uint256 indexed tokenId);

    function listNFT(address nftContract, uint256 tokenId, uint256 price) external {
        require(price > 0, "Price must be greater than zero");

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        bytes32 listingId = getListingId(nftContract, tokenId);
        listings[listingId] = Listing(msg.sender, price, nftContract, tokenId);
        listingIds.push(listingId); // Store the listing ID

        emit NFTListed(msg.sender, nftContract, tokenId, price);
    }

    function buyNFT(address nftContract, uint256 tokenId) external payable {
        bytes32 listingId = getListingId(nftContract, tokenId);
        Listing memory listing = listings[listingId];

        require(msg.value >= listing.price, "Insufficient funds");
        require(listing.seller != address(0), "NFT not listed");

        payable(listing.seller).transfer(listing.price);
        IERC721(listing.nftContract).transferFrom(address(this), msg.sender, tokenId);

        delete listings[listingId];
        removeListingId(listingId);

        emit NFTBought(msg.sender, nftContract, tokenId, listing.price);
    }

    function cancelListing(address nftContract, uint256 tokenId) external {
        bytes32 listingId = getListingId(nftContract, tokenId);
        Listing memory listing = listings[listingId];

        require(listing.seller == msg.sender, "Not the seller");

        IERC721(listing.nftContract).transferFrom(address(this), msg.sender, tokenId);
        delete listings[listingId];
        removeListingId(listingId);

        emit NFTListingCancelled(msg.sender, nftContract, tokenId);
    }

    function getListingCount() external view returns (uint256) {
        return listingIds.length;
    }

    function getListingByIndex(uint256 index) external view returns (Listing memory) {
        require(index < listingIds.length, "Index out of bounds");
        return listings[listingIds[index]];
    }

    function getListingId(address nftContract, uint256 tokenId) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(nftContract, tokenId));
    }

    function removeListingId(bytes32 listingId) private {
        uint256 index;
        for (uint256 i = 0; i < listingIds.length; i++) {
            if (listingIds[i] == listingId) {
                index = i;
                break;
            }
        }

        listingIds[index] = listingIds[listingIds.length - 1];
        listingIds.pop();
    }
}