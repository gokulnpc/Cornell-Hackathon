import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import { useApplicationContractAddress } from "../hooks/tokenAddress";
import ApplicationContractABI from "../abi/ApplicationContract.json";

interface AppliedJob {
  jobId: number;
  status: string;
  feedback: string;
}

export default function AppliedJobs() {
  const { isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const applicationContractAddress = useApplicationContractAddress();
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [status, setStatus] = useState<string>("");

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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Applied Jobs</h1>
        {status && <p className="text-red-500 mb-4">{status}</p>}
        {appliedJobs.length > 0 ? (
          appliedJobs.map((job) => (
            <div
              key={job.jobId}
              className="bg-gray-800 p-6 mb-6 rounded-lg shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-2">Job ID: {job.jobId}</h2>
              <p className="text-gray-400 mb-2">Status: {job.status}</p>
              <p className="text-gray-400 mb-2">Feedback: {job.feedback}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No jobs applied for yet.</p>
        )}
      </div>
    </div>
  );
}
