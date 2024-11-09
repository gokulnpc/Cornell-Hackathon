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
  const [techStack, setTechStack] = useState<string>("");
  const [h1bSponsorship, setH1bSponsorship] = useState<boolean>(false);
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
          location,
          techStack,
          h1bSponsorship
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
      <div className="max-w-2xl mx-auto">
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
        <div className="mb-4">
          <label className="block text-lg mb-2">Tech Stack Requirements</label>
          <input
            type="text"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            className="w-full p-3 text-black rounded-lg"
            placeholder="e.g., React, Node.js, AWS"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg mb-2">
            H1B Sponsorship Available?
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={h1bSponsorship}
              onChange={(e) => setH1bSponsorship(e.target.checked)}
              className="mr-2"
            />
            <span>Yes</span>
          </div>
        </div>
        <button
          onClick={handleJobPost}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Post Job
        </button>
      </div>
    </div>
  );
}
