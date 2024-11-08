// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ProfileContract is Ownable {
    using Strings for uint256;

    struct Profile {
        string name;
        string email;
        string bio;
        string resumeIpfsHash;
        uint256 reputationPoints;
    }

    constructor() Ownable(msg.sender) {}

    mapping(address => Profile) private profiles;
    mapping(address => bool) private registered;

    event ProfileCreated(address indexed user, string name, string email, string bio);
    event ProfileUpdated(address indexed user, string name, string email, string bio);
    event ResumeUploaded(address indexed user, string ipfsHash);
    event ReputationUpdated(address indexed user, uint256 newPoints);

    // Modifier to check if user is registered
    modifier onlyRegistered() {
        require(registered[msg.sender], "User is not registered");
        _;
    }

    // Create or register a new profile
    function createProfile(string memory _name, string memory _email, string memory _bio) public {
        require(!registered[msg.sender], "Profile already exists");

        profiles[msg.sender] = Profile({
            name: _name,
            email: _email,
            bio: _bio,
            resumeIpfsHash: "",
            reputationPoints: 0
        });

        registered[msg.sender] = true;

        emit ProfileCreated(msg.sender, _name, _email, _bio);
    }

    // Get the profile of the caller
    function getProfile() public view onlyRegistered returns (string memory, string memory, string memory, string memory, uint256) {
        Profile memory profile = profiles[msg.sender];
        return (profile.name, profile.email, profile.bio, profile.resumeIpfsHash, profile.reputationPoints);
    }

    // Update the profile details
    function updateProfile(string memory _name, string memory _email, string memory _bio) public onlyRegistered {
        Profile storage profile = profiles[msg.sender];
        profile.name = _name;
        profile.email = _email;
        profile.bio = _bio;

        emit ProfileUpdated(msg.sender, _name, _email, _bio);
    }

    // Upload resume to IPFS
    function uploadResume(string memory _ipfsHash) public onlyRegistered {
        Profile storage profile = profiles[msg.sender];
        profile.resumeIpfsHash = _ipfsHash;

        emit ResumeUploaded(msg.sender, _ipfsHash);
    }

    // Get the IPFS hash of the resume
    function getResume() public view onlyRegistered returns (string memory) {
        return profiles[msg.sender].resumeIpfsHash;
    }

    // Gamified system: Increase reputation points
    function increaseReputation(uint256 _points) public onlyOwner {
        require(_points > 0, "Points must be greater than zero");
        profiles[msg.sender].reputationPoints += _points;

        emit ReputationUpdated(msg.sender, profiles[msg.sender].reputationPoints);
    }

    // Gamified system: Decrease reputation points
    function decreaseReputation(uint256 _points) public onlyOwner {
        require(_points > 0, "Points must be greater than zero");
        require(profiles[msg.sender].reputationPoints >= _points, "Insufficient reputation points");
        profiles[msg.sender].reputationPoints -= _points;

        emit ReputationUpdated(msg.sender, profiles[msg.sender].reputationPoints);
    }

    // Get reputation points
    function getReputation() public view onlyRegistered returns (uint256) {
        return profiles[msg.sender].reputationPoints;
    }
}
