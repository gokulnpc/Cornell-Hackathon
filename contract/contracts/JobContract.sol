// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract JobContract is Ownable {
    struct Job {
        uint256 jobId;
        string title;
        string description;
        string salary;
        string location;
        address employer;
        bool isOpen;
    }

    constructor() Ownable(msg.sender) {}

    uint256 private jobCounter;
    mapping(uint256 => Job) private jobs;
    mapping(address => uint256[]) private employerJobs;

    event JobCreated(uint256 indexed jobId, address indexed employer, string title, string location);
    event JobUpdated(uint256 indexed jobId, string title, string description, string salary, string location);
    event JobClosed(uint256 indexed jobId, address indexed employer);

    // Create a new job posting
    function createJob(string memory _title, string memory _description, string memory _salary, string memory _location) public {
        jobCounter++;
        jobs[jobCounter] = Job({
            jobId: jobCounter,
            title: _title,
            description: _description,
            salary: _salary,
            location: _location,
            employer: msg.sender,
            isOpen: true
        });

        employerJobs[msg.sender].push(jobCounter);

        emit JobCreated(jobCounter, msg.sender, _title, _location);
    }

    // Get job details by jobId
    function getJob(uint256 _jobId) public view returns (string memory, string memory, string memory, string memory, address, bool) {
        Job memory job = jobs[_jobId];
        require(job.jobId != 0, "Job does not exist");
        return (job.title, job.description, job.salary, job.location, job.employer, job.isOpen);
    }

    // Get all job IDs created by an employer
    function getJobsByEmployer(address _employer) public view returns (uint256[] memory) {
        return employerJobs[_employer];
    }

    // Update job details
    function updateJob(uint256 _jobId, string memory _title, string memory _description, string memory _salary, string memory _location) public {
        Job storage job = jobs[_jobId];
        require(job.jobId != 0, "Job does not exist");
        require(job.employer == msg.sender, "Only the employer can update this job");
        require(job.isOpen, "Job is closed");

        job.title = _title;
        job.description = _description;
        job.salary = _salary;
        job.location = _location;

        emit JobUpdated(_jobId, _title, _description, _salary, _location);
    }

    // Close a job posting
    function closeJob(uint256 _jobId) public {
        Job storage job = jobs[_jobId];
        require(job.jobId != 0, "Job does not exist");
        require(job.employer == msg.sender, "Only the employer can close this job");
        require(job.isOpen, "Job is already closed");

        job.isOpen = false;

        emit JobClosed(_jobId, msg.sender);
    }

    // Get the total number of jobs created
    function getTotalJobs() public view returns (uint256) {
        return jobCounter;
    }

    // Check if a job is open
    function isJobOpen(uint256 _jobId) public view returns (bool) {
        Job memory job = jobs[_jobId];
        require(job.jobId != 0, "Job does not exist");
        return job.isOpen;
    }
}
