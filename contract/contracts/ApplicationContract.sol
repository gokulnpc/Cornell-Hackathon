// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./JobContract.sol"; // Import JobContract to reference job details

contract ApplicationContract is Ownable {
    JobContract jobContract;

    struct Application {
        uint256 jobId;
        address applicant;
        string status; // e.g., "Pending", "Accepted", "Rejected"
        string feedback;
    }

    mapping(uint256 => Application[]) private jobApplications; // jobId => List of Applications
    mapping(address => uint256[]) private applicantJobs; // applicant => List of Job IDs applied

    event ApplicationSubmitted(uint256 indexed jobId, address indexed applicant);
    event ApplicationStatusUpdated(uint256 indexed jobId, address indexed applicant, string status);

    constructor(address jobContractAddress) Ownable(msg.sender) {
        jobContract = JobContract(jobContractAddress);
    }

    // Function for applicants to apply to a job
    function applyToJob(uint256 _jobId) public {
        (, , , , , bool isOpen) = jobContract.getJob(_jobId);
        require(isOpen, "Job is closed");

        jobApplications[_jobId].push(Application({
            jobId: _jobId,
            applicant: msg.sender,
            status: "Pending",
            feedback: ""
        }));

        applicantJobs[msg.sender].push(_jobId);

        emit ApplicationSubmitted(_jobId, msg.sender);
    }

    // Function for employers to update the status of an application
    function updateApplicationStatus(uint256 _jobId, address _applicant, string memory _status, string memory _feedback) public {
        (, , , , address employer, ) = jobContract.getJob(_jobId);
        require(employer == msg.sender, "Only the employer can update applications for this job");

        Application[] storage applications = jobApplications[_jobId];
        for (uint256 i = 0; i < applications.length; i++) {
            if (applications[i].applicant == _applicant) {
                applications[i].status = _status;
                applications[i].feedback = _feedback;
                emit ApplicationStatusUpdated(_jobId, _applicant, _status);
                break;
            }
        }
    }

    // Function to get all applications for a specific job
    function getApplications(uint256 _jobId) public view returns (Application[] memory) {
        return jobApplications[_jobId];
    }

    // Function to get all job IDs an applicant has applied to
    function getJobsByApplicant(address _applicant) public view returns (uint256[] memory) {
        return applicantJobs[_applicant];
    }
}
