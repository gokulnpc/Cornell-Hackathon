import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import { useApplicationContractAddress } from "../hooks/tokenAddress";
import ApplicationContractABI from "../abi/ApplicationContract.json";
import { useNavigate } from "react-router-dom";

interface AppliedJob {
  jobId: number;
  status: string;
  feedback: string;
  dateApplied: string;
  category: string;
}

export default function AppliedJobs() {
  const { isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const applicationContractAddress = useApplicationContractAddress();
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([
    {
      jobId: 1,
      status: "Pending",
      feedback: "Under review",
      dateApplied: "2024-11-01",
      category: "Software Development",
    },
    {
      jobId: 2,
      status: "Interview Scheduled",
      feedback: "Interview on 2024-11-05",
      dateApplied: "2024-11-02",
      category: "Design",
    },
    {
      jobId: 3,
      status: "Rejected",
      feedback: "Not a suitable fit",
      dateApplied: "2024-10-25",
      category: "Marketing",
    },
    {
      jobId: 4,
      status: "Offer Received",
      feedback: "Offer extended on 2024-11-03",
      dateApplied: "2024-10-20",
      category: "Product Management",
    },
  ]);
  const [status, setStatus] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (isConnected && walletClient && address) {
        try {
          const provider = new ethers.BrowserProvider(walletClient);
          const signer = await provider.getSigner();
          const applicationContract = new ethers.Contract(
            applicationContractAddress,
            ApplicationContractABI.abi,
            signer
          );

          const jobIds = await applicationContract.getJobsByApplicant(address);
          const jobsArray: AppliedJob[] = [];

          for (let i = 0; i < jobIds.length; i++) {
            const jobId = jobIds[i];
            const applicationData = await applicationContract.getApplication(
              jobId,
              address
            );
            const job: AppliedJob = {
              jobId: jobId,
              status: applicationData.status,
              feedback: applicationData.feedback,
              dateApplied: new Date().toISOString().split("T")[0], // Mock date
              category: "Software Development", // Mock category
            };
            jobsArray.push(job);
          }

          setAppliedJobs(jobsArray);
        } catch (error) {
          console.error("Failed to fetch applied jobs:", error);
          setStatus("Failed to load applied jobs. Please try again later.");
        }
      }
    };
    fetchAppliedJobs();
  }, [isConnected, walletClient, address, applicationContractAddress]);

  const handleJobClick = (jobId: number) => {
    navigate(`/job-details/${jobId}`);
  };

  if (!isConnected) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-10 mt-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Connect Your Wallet</h1>
          <p className="text-lg text-gray-300">
            Please connect your wallet to view your applied jobs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-10 mt-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Applied Jobs</h1>
        {status && <p className="text-red-500 mb-4">{status}</p>}
        {appliedJobs.length > 0 ? (
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-bold mb-4">Software Development</h2>
              {appliedJobs
                .filter((job) => job.category === "Software Development")
                .map((job) => (
                  <div
                    key={job.jobId}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition duration-200"
                    onClick={() => handleJobClick(job.jobId)}
                  >
                    <h3 className="text-2xl font-bold mb-2">
                      Job ID: {job.jobId}
                    </h3>
                    <p className="text-gray-400 mb-2">Status: {job.status}</p>
                    <p className="text-gray-400 mb-2">
                      Feedback: {job.feedback}
                    </p>
                    <p className="text-gray-400 mb-2">
                      Date Applied: {job.dateApplied}
                    </p>
                    <p className="text-green-400">
                      Role involves working on full-stack development,
                      collaborating with team members, and contributing to code
                      reviews. Seeking candidates with experience in React,
                      Node.js, and cloud technologies.
                    </p>
                  </div>
                ))}
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Design</h2>
              {appliedJobs
                .filter((job) => job.category === "Design")
                .map((job) => (
                  <div
                    key={job.jobId}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition duration-200"
                    onClick={() => handleJobClick(job.jobId)}
                  >
                    <h3 className="text-2xl font-bold mb-2">
                      Job ID: {job.jobId}
                    </h3>
                    <p className="text-gray-400 mb-2">Status: {job.status}</p>
                    <p className="text-gray-400 mb-2">
                      Feedback: {job.feedback}
                    </p>
                    <p className="text-gray-400 mb-2">
                      Date Applied: {job.dateApplied}
                    </p>
                    <p className="text-blue-400">
                      This role requires creating user-centric designs, working
                      closely with product teams, and ensuring the best user
                      experience. Proficiency in Figma and Adobe XD is
                      preferred.
                    </p>
                  </div>
                ))}
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Marketing</h2>
              {appliedJobs
                .filter((job) => job.category === "Marketing")
                .map((job) => (
                  <div
                    key={job.jobId}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition duration-200"
                    onClick={() => handleJobClick(job.jobId)}
                  >
                    <h3 className="text-2xl font-bold mb-2">
                      Job ID: {job.jobId}
                    </h3>
                    <p className="text-gray-400 mb-2">Status: {job.status}</p>
                    <p className="text-gray-400 mb-2">
                      Feedback: {job.feedback}
                    </p>
                    <p className="text-gray-400 mb-2">
                      Date Applied: {job.dateApplied}
                    </p>
                    <p className="text-yellow-400">
                      Looking for a marketing specialist to drive brand
                      campaigns, develop digital marketing strategies, and work
                      with cross-functional teams to boost engagement.
                    </p>
                  </div>
                ))}
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Product Management</h2>
              {appliedJobs
                .filter((job) => job.category === "Product Management")
                .map((job) => (
                  <div
                    key={job.jobId}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition duration-200"
                    onClick={() => handleJobClick(job.jobId)}
                  >
                    <h3 className="text-2xl font-bold mb-2">
                      Job ID: {job.jobId}
                    </h3>
                    <p className="text-gray-400 mb-2">Status: {job.status}</p>
                    <p className="text-gray-400 mb-2">
                      Feedback: {job.feedback}
                    </p>
                    <p className="text-gray-400 mb-2">
                      Date Applied: {job.dateApplied}
                    </p>
                    <p className="text-purple-400">
                      Responsible for overseeing product lifecycle,
                      collaborating with engineering and design teams, and
                      ensuring product-market fit. Ideal candidates have
                      experience in agile methodologies and stakeholder
                      management.
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-400">No jobs applied for yet.</p>
        )}
      </div>
    </div>
  );
}
