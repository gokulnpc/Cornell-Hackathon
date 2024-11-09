import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import { useApplicationContractAddress } from "../hooks/tokenAddress";
import ApplicationContractABI from "../abi/ApplicationContract.json";

export default function JobApplication() {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const applicationContractAddress = useApplicationContractAddress();
  const { jobId } = useParams<{ jobId: string }>();
  const [status, setStatus] = useState<string>("");
  const [applying, setApplying] = useState<boolean>(false);

  const handleApply = async () => {
    if (isConnected && walletClient && jobId) {
      setApplying(true);
      try {
        const provider = new ethers.BrowserProvider(walletClient);
        const signer = await provider.getSigner();
        const applicationContract = new ethers.Contract(
          applicationContractAddress,
          ApplicationContractABI.abi,
          signer
        );

        const tx = await applicationContract.applyToJob(jobId);
        await tx.wait();

        setStatus("Application submitted successfully!");
      } catch (error) {
        console.error("Failed to apply for job:", error);
        setStatus("Failed to submit application. Please try again later.");
      } finally {
        setApplying(false);
      }
    } else {
      setStatus("Please connect your wallet to apply for this job.");
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-10 mt-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Connect Your Wallet</h1>
          <p className="text-lg text-gray-300">
            Please connect your wallet to apply for the job.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-10 mt-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Job Application</h1>
        {status && <p className="text-green-500 mb-4">{status}</p>}
        <button
          onClick={handleApply}
          disabled={applying}
          className={`mt-4 px-6 py-2 ${
            applying ? "bg-gray-600" : "bg-purple-600 hover:bg-purple-700"
          } text-white font-bold rounded`}
        >
          {applying ? "Applying..." : "Submit Application"}
        </button>
      </div>
    </div>
  );
}
