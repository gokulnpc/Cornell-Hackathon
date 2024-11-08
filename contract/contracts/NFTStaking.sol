// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTStaking is Ownable {
    IERC721 public nftCollection;
    IERC20 public rewardToken;

    // Stake struct to hold information about staked NFTs
    struct Stake {
        address owner;
        uint256 tokenId;
        uint256 stakedAt;
    }

    mapping(uint256 => Stake) public stakes; // Mapping from tokenId to Stake
    mapping(address => uint256[]) public userStakes; // Mapping from user to their staked tokenIds
    uint256 public rewardsPerSecond = 1 ether; // Example reward per second

    event NFTStaked(address owner, uint256 tokenId, uint256 timestamp);
    event NFTUnstaked(address owner, uint256 tokenId, uint256 reward);

    constructor(IERC721 _nftCollection, IERC20 _rewardToken, address initialOwner) Ownable(initialOwner) {
        nftCollection = _nftCollection;
        rewardToken = _rewardToken;
    }

    // Stake an NFT
    function stakeNFT(uint256 tokenId) external {
        require(nftCollection.ownerOf(tokenId) == msg.sender, "You don't own this NFT!");
        nftCollection.transferFrom(msg.sender, address(this), tokenId); // Transfer NFT to the contract

        stakes[tokenId] = Stake(msg.sender, tokenId, block.timestamp);
        userStakes[msg.sender].push(tokenId);

        emit NFTStaked(msg.sender, tokenId, block.timestamp);
    }

    // Unstake an NFT and claim rewards
    function unstakeNFT(uint256 tokenId) external {
        Stake memory stakeData = stakes[tokenId];
        require(stakeData.owner == msg.sender, "Not the owner of this staked NFT");

        // Calculate rewards
        uint256 stakedDuration = block.timestamp - stakeData.stakedAt;
        uint256 reward = stakedDuration * rewardsPerSecond;

        // Transfer reward and NFT back to the user
        rewardToken.transfer(msg.sender, reward);
        nftCollection.transferFrom(address(this), msg.sender, tokenId);

        // Cleanup the stake
        delete stakes[tokenId];
        removeUserStake(msg.sender, tokenId);

        emit NFTUnstaked(msg.sender, tokenId, reward);
    }

    // Helper function to remove staked NFT from userStakes array
    function removeUserStake(address user, uint256 tokenId) internal {
        uint256[] storage stakedTokens = userStakes[user];
        for (uint256 i = 0; i < stakedTokens.length; i++) {
            if (stakedTokens[i] == tokenId) {
                stakedTokens[i] = stakedTokens[stakedTokens.length - 1];
                stakedTokens.pop();
                break;
            }
        }
    }

    // Admin function to set rewards per second
    function setRewardsPerSecond(uint256 _newReward) external onlyOwner {
        rewardsPerSecond = _newReward;
    }
}