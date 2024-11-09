import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import { useJobContractAddress } from "../hooks/tokenAddress";
import JobContractABI from "../abi/JobContract.json";
import { useNavigate } from "react-router-dom";

interface Job {
  jobId: number;
  title: string;
  description: string;
  salary: string;
  location: string;
  employer: string;
  isOpen: boolean;
}

export default function JobList() {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const jobContractAddress = useJobContractAddress();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [status, setStatus] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      if (isConnected && walletClient) {
        try {
          const provider = new ethers.BrowserProvider(walletClient);
          const signer = await provider.getSigner();
          const jobContract = new ethers.Contract(
            jobContractAddress,
            JobContractABI.abi,
            signer
          );

          const totalJobs = await jobContract.getTotalJobs();
          const jobsArray: Job[] = [];

          for (let i = 1; i <= totalJobs; i++) {
            const jobData = await jobContract.getJob(i);
            const job: Job = {
              jobId: i,
              title: jobData[0],
              description: jobData[1],
              salary: jobData[2],
              location: jobData[3],
              employer: jobData[4],
              isOpen: jobData[5],
            };
            if (job.isOpen) {
              jobsArray.push(job);
            }
          }

          setJobs(jobsArray);
        } catch (error) {
          console.error("Failed to fetch jobs:", error);
          setStatus("Failed to load jobs. Please try again later.");
        }
      }
    };
    fetchJobs();
  }, [isConnected, walletClient, jobContractAddress]);

  const handleJobClick = (jobId: number) => {
    navigate(`/job-details/${jobId}`);
  };

  if (!isConnected) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-10 mt-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Connect Your Wallet</h1>
          <p className="text-lg text-gray-300">
            Please connect your wallet to view available jobs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-10 mt-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Available Jobs</h1>
        {status && <p className="text-red-500 mb-4">{status}</p>}
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div
              key={job.jobId}
              className="bg-gray-800 p-6 mb-6 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition duration-200"
              onClick={() => handleJobClick(job.jobId)}
            >
              <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
              <p className="text-gray-300 mb-2">{job.description}</p>
              <p className="text-gray-400 mb-2">Location: {job.location}</p>
              <p className="text-gray-400 mb-2">Salary: {job.salary}</p>
              <p className="text-gray-500 mb-2">Employer: {job.employer}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No jobs available at the moment.</p>
        )}
      </div>
    </div>
  );
}
