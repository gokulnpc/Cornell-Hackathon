// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// contract BetterCause {
//     struct Campaign {
//         string title;
//         string description;
//         string imageHash; // IPFS hash for storing the campaign image
//         address owner;
//         uint256 deadline;
//         uint256 amountCollected;
//         address[] donators;
//         mapping(address => uint256) donations;
//     }

//     mapping(uint256 => Campaign) public campaigns;
//     uint256 public campaignCount;

//     event CampaignCreated(
//         uint256 campaignId,
//         string title,
//         string description,
//         address indexed owner,
//         uint256 deadline
//     );
    
//     event DonationReceived(
//         uint256 indexed campaignId,
//         address indexed donator,
//         uint256 amount
//     );

//     modifier onlyOwner(uint256 _campaignId) {
//         require(
//             campaigns[_campaignId].owner == msg.sender,
//             "Only the campaign owner can perform this action"
//         );
//         _;
//     }

//     // Create a new campaign
//     function createCampaign(
//         string memory _title,
//         string memory _description,
//         string memory _imageHash,
//         uint256 _durationInDays
//     ) external {
//         require(bytes(_title).length > 0, "Title cannot be empty");
//         require(bytes(_description).length > 0, "Description cannot be empty");

//         campaignCount++;
//         Campaign storage newCampaign = campaigns[campaignCount];
//         newCampaign.title = _title;
//         newCampaign.description = _description;
//         newCampaign.imageHash = _imageHash;
//         newCampaign.owner = msg.sender;
//         newCampaign.deadline = block.timestamp + (_durationInDays * 1 days);
//         newCampaign.amountCollected = 0;

//         emit CampaignCreated(campaignCount, _title, _description, msg.sender, newCampaign.deadline);
//     }

//     // Donate to a specific campaign by ID
//     function donateToCampaign(uint256 _campaignId) external payable {
//         Campaign storage campaign = campaigns[_campaignId];
//         require(
//             block.timestamp < campaign.deadline,
//             "Campaign has ended"
//         );
//         require(msg.value > 0, "Donation amount must be greater than 0");

//         if (campaign.donations[msg.sender] == 0) {
//             campaign.donators.push(msg.sender);
//         }
//         campaign.donations[msg.sender] += msg.value;
//         campaign.amountCollected += msg.value;

//         emit DonationReceived(_campaignId, msg.sender, msg.value);
//     }

//     // Get details of a campaign, including title, description, image, and other metadata
//     function getCampaignById(uint256 _campaignId)
//         external
//         view
//         returns (
//             string memory title,
//             string memory description,
//             string memory imageHash,
//             address owner,
//             uint256 deadline,
//             uint256 amountCollected,
//             address[] memory donators
//         )
//     {
//         Campaign storage campaign = campaigns[_campaignId];
//         return (
//             campaign.title,
//             campaign.description,
//             campaign.imageHash,
//             campaign.owner,
//             campaign.deadline,
//             campaign.amountCollected,
//             campaign.donators
//         );
//     }

//     // Allow campaign owner to withdraw funds collected for their campaign
//     function withdrawFunds(uint256 _campaignId) external onlyOwner(_campaignId) {
//         Campaign storage campaign = campaigns[_campaignId];
//         require(
//             block.timestamp >= campaign.deadline,
//             "Cannot withdraw funds before campaign ends"
//         );
//         require(campaign.amountCollected > 0, "No funds to withdraw");

//         uint256 amount = campaign.amountCollected;
//         campaign.amountCollected = 0;
//         payable(campaign.owner).transfer(amount);
//     }

//     // Get donation amount by an individual donator for a specific campaign
//     function getDonationByDonator(uint256 _campaignId, address _donator)
//         external
//         view
//         returns (uint256)
//     {
//         return campaigns[_campaignId].donations[_donator];
//     }
// }


pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BetterCause {
    struct Campaign {
        string title;
        string description;
        string imageHash; // IPFS hash for storing the campaign image
        address owner;
        uint256 deadline;
        uint256 amountCollectedETH;
        uint256 amountCollectedPYUSD;
        address[] donators;
        mapping(address => uint256) donationsETH;
        mapping(address => uint256) donationsPYUSD;
    }

    IERC20 public donationToken; // PYUSD token contract
    mapping(uint256 => Campaign) public campaigns;
    uint256 public campaignCount;

    event CampaignCreated(
        uint256 campaignId,
        string title,
        string description,
        address indexed owner,
        uint256 deadline
    );

    event DonationReceivedETH(
        uint256 indexed campaignId,
        address indexed donator,
        uint256 amount
    );

    event DonationReceivedPYUSD(
        uint256 indexed campaignId,
        address indexed donator,
        uint256 amount
    );

    modifier onlyOwner(uint256 _campaignId) {
        require(
            campaigns[_campaignId].owner == msg.sender,
            "Only the campaign owner can perform this action"
        );
        _;
    }

    constructor(address _donationToken) {
        donationToken = IERC20(_donationToken); // Set the PYUSD token contract address
    }

    function createCampaign(
        string memory _title,
        string memory _description,
        string memory _imageHash,
        uint256 _durationInDays
    ) external {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");

        campaignCount++;
        Campaign storage newCampaign = campaigns[campaignCount];
        newCampaign.title = _title;
        newCampaign.description = _description;
        newCampaign.imageHash = _imageHash;
        newCampaign.owner = msg.sender;
        newCampaign.deadline = block.timestamp + (_durationInDays * 1 days);

        emit CampaignCreated(campaignCount, _title, _description, msg.sender, newCampaign.deadline);
    }

    // Donate using ETH
    function donateWithETH(uint256 _campaignId) external payable {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp < campaign.deadline, "Campaign has ended");
        require(msg.value > 0, "Donation amount must be greater than 0");

        if (campaign.donationsETH[msg.sender] == 0) {
            campaign.donators.push(msg.sender);
        }
        campaign.donationsETH[msg.sender] += msg.value;
        campaign.amountCollectedETH += msg.value;

        emit DonationReceivedETH(_campaignId, msg.sender, msg.value);
    }

    // Donate using PYUSD
    function donateWithPYUSD(uint256 _campaignId, uint256 _amount) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp < campaign.deadline, "Campaign has ended");
        require(_amount > 0, "Donation amount must be greater than 0");

        require(
            donationToken.transferFrom(msg.sender, address(this), _amount),
            "Token transfer failed"
        );

        if (campaign.donationsPYUSD[msg.sender] == 0) {
            campaign.donators.push(msg.sender);
        }
        campaign.donationsPYUSD[msg.sender] += _amount;
        campaign.amountCollectedPYUSD += _amount;

        emit DonationReceivedPYUSD(_campaignId, msg.sender, _amount);
    }

    function withdrawFundsETH(uint256 _campaignId) external onlyOwner(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp >= campaign.deadline, "Cannot withdraw before campaign ends");
        require(campaign.amountCollectedETH > 0, "No ETH funds to withdraw");

        uint256 amount = campaign.amountCollectedETH;
        campaign.amountCollectedETH = 0;
        payable(campaign.owner).transfer(amount);
    }

    function withdrawFundsPYUSD(uint256 _campaignId) external onlyOwner(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp >= campaign.deadline, "Cannot withdraw before campaign ends");
        require(campaign.amountCollectedPYUSD > 0, "No PYUSD funds to withdraw");

        uint256 amount = campaign.amountCollectedPYUSD;
        campaign.amountCollectedPYUSD = 0;
        donationToken.transfer(campaign.owner, amount);
    }
}
