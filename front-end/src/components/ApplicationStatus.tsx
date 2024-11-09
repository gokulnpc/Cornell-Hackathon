import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import { useJobContractAddress } from "../hooks/tokenAddress";
import ApplicationContractABI from "../abi/ApplicationContract.json";

interface ApplicationStatus {
  jobId: number;
  applicant: string;
  status: string;
  feedback: string;
}

export default function ApplicationStatus() {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const jobContractAddress = useJobContractAddress();
  const { jobId } = useParams<{ jobId: string }>();
  const [application, setApplication] = useState<ApplicationStatus | null>(
    null
  );
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      if (isConnected && walletClient && jobId) {
        try {
          const provider = new ethers.BrowserProvider(walletClient);
          const signer = await provider.getSigner();
          const applicationContract = new ethers.Contract(
            jobContractAddress,
            ApplicationContractABI.abi,
            signer
          );

          const applicationData = await applicationContract.getApplication(
            jobId
          );
          const applicationDetails: ApplicationStatus = {
            jobId: parseInt(jobId),
            applicant: applicationData[0],
            status: applicationData[1],
            feedback: applicationData[2],
          };

          setApplication(applicationDetails);
        } catch (error) {
          console.error("Failed to fetch application status:", error);
          setStatus(
            "Failed to load application status. Please try again later."
          );
        }
      }
    };
    fetchApplicationStatus();
  }, [isConnected, walletClient, jobContractAddress, jobId]);

  if (!isConnected) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-10 mt-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Connect Your Wallet</h1>
          <p className="text-lg text-gray-300">
            Please connect your wallet to view your application status.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-10 mt-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Application Status</h1>
        {status && <p className="text-red-500 mb-4">{status}</p>}
        {application ? (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-2">
              Job ID: {application.jobId}
            </h2>
            <p className="text-gray-300 mb-4">
              Applicant: {application.applicant}
            </p>
            <p className="text-gray-400 mb-2">Status: {application.status}</p>
            <p className="text-gray-400 mb-2">
              Feedback: {application.feedback}
            </p>
          </div>
        ) : (
          <p className="text-gray-400">Loading application status...</p>
        )}
      </div>
    </div>
  );
}
