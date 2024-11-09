import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import { useJobContractAddress } from "../hooks/tokenAddress";
import JobContractABI from "../abi/JobContract.json";

interface Job {
  jobId: number;
  title: string;
  description: string;
  salary: string;
  location: string;
  employer: string;
  isOpen: boolean;
}

export default function JobDetails() {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const jobContractAddress = useJobContractAddress();
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [status, setStatus] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (isConnected && walletClient && jobId) {
        try {
          const provider = new ethers.BrowserProvider(walletClient);
          const signer = await provider.getSigner();
          const jobContract = new ethers.Contract(
            jobContractAddress,
            JobContractABI.abi,
            signer
          );

          const jobData = await jobContract.getJob(jobId);
          const jobDetails: Job = {
            jobId: parseInt(jobId),
            title: jobData[0],
            description: jobData[1],
            salary: jobData[2],
            location: jobData[3],
            employer: jobData[4],
            isOpen: jobData[5],
          };

          setJob(jobDetails);
        } catch (error) {
          console.error("Failed to fetch job details:", error);
          setStatus("Failed to load job details. Please try again later.");
        }
      }
    };
    fetchJobDetails();
  }, [isConnected, walletClient, jobContractAddress, jobId]);

  const handleApplyClick = () => {
    navigate(`/job-application/${jobId}`);
  };

  if (!isConnected) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-10 mt-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Connect Your Wallet</h1>
          <p className="text-lg text-gray-300">
            Please connect your wallet to view job details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-10 mt-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Job Details</h1>
        {status && <p className="text-red-500 mb-4">{status}</p>}
        {job ? (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
            <p className="text-gray-300 mb-4">{job.description}</p>
            <p className="text-gray-400 mb-2">Location: {job.location}</p>
            <p className="text-gray-400 mb-2">Salary: {job.salary}</p>
            <p className="text-gray-500 mb-2">Employer: {job.employer}</p>
            <p className="text-gray-500 mb-2">
              Status: {job.isOpen ? "Open" : "Closed"}
            </p>
            {job.isOpen && (
              <button
                onClick={handleApplyClick}
                className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded"
              >
                Apply for Job
              </button>
            )}
          </div>
        ) : (
          <p className="text-gray-400">Loading job details...</p>
        )}
      </div>
    </div>
  );
}
