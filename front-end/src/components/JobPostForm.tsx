import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import { useJobContractAddress } from "../hooks/tokenAddress";
import JobContractABI from "../abi/JobContract.json";

export default function JobPostForm() {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const jobContractAddress = useJobContractAddress();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [salary, setSalary] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const handleJobPost = async () => {
    if (isConnected && walletClient) {
      try {
        const provider = new ethers.BrowserProvider(walletClient);
        const signer = await provider.getSigner();
        const jobContract = new ethers.Contract(
          jobContractAddress,
          JobContractABI.abi,
          signer
        );

        const tx = await jobContract.createJob(
          title,
          description,
          salary,
          location
        );
        await tx.wait();

        setStatus("Job successfully posted!");
      } catch (error) {
        console.error("Failed to post job:", error);
        setStatus("Failed to post job. Please try again later.");
      }
    } else {
      setStatus("Please connect your wallet to post a job.");
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-10 mt-10">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Post a Job</h1>
        {status && <p className="text-red-500 mb-4">{status}</p>}
        <div className="mb-4">
          <label className="block text-lg mb-2">Job Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 text-black rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg mb-2">Job Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 text-black rounded-lg"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-lg mb-2">Salary</label>
          <input
            type="text"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full p-3 text-black rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg mb-2">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 text-black rounded-lg"
          />
        </div>
        <button
          onClick={handleJobPost}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg"
        >
          Post Job
        </button>
      </div>
    </div>
  );
}
