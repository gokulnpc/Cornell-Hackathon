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
  const [jobs, setJobs] = useState<Job[]>([
    {
      jobId: 5,
      title: "Product Manager",
      description:
        "We are looking for a talented Product Manager to join our dynamic team. You will be responsible for managing product lifecycles, collaborating with cross-functional teams, and ensuring customer satisfaction.",
      salary: "$105,000/year",
      location: "Austin, TX",
      employer: "Bubbles Studios",
      isOpen: true,
    },
    {
      jobId: 6,
      title: "Backend Developer",
      description:
        "We need a skilled Backend Developer to work on our REST APIs, database systems, and backend architecture. You should be experienced with Node.js, Express, and cloud platforms.",
      salary: "$95,000/year",
      location: "Chicago, IL",
      employer: "Kixon Studios",
      isOpen: true,
    },
    {
      jobId: 7,
      title: "Data Analyst",
      description:
        "We are seeking a Data Analyst to interpret complex data sets, create visualizations, and support decision-making processes. Strong SQL and Python skills are essential.",
      salary: "$85,000/year",
      location: "Remote",
      employer: "Kixon Studios",
      isOpen: true,
    },
    {
      jobId: 8,
      title: "UI Designer",
      description:
        "We are seeking a creative UI Designer to design and implement beautiful, user-friendly interfaces for our platform. Experience with Figma and Sketch is a must.",
      salary: "$90,000/year",
      location: "Manchester, England",
      employer: "Bubbles Studios",
      isOpen: true,
    },
    {
      jobId: 9,
      title: "Animator",
      description:
        "We need an Animator to create stunning animations for our products. You should have a portfolio showcasing animation skills and experience with Adobe After Effects.",
      salary: "$92,000/year",
      location: "Manchester, England",
      employer: "Kixon Studios",
      isOpen: true,
    },
    {
      jobId: 10,
      title: "Product Designer",
      description:
        "Join our design team as a Product Designer. You will be working on end-to-end user experiences, from wireframes to high-fidelity designs.",
      salary: "$100,000/year",
      location: "Manchester, England",
      employer: "Kixon Studios",
      isOpen: true,
    },
  ]);
  const [status, setStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);
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
          const jobsArray: Job[] = [...jobs];

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
          setFilteredJobs(jobsArray);
        } catch (error) {
          console.error("Failed to fetch jobs:", error);
          setStatus("Failed to load jobs. Please try again later.");
        }
      }
    };
    fetchJobs();
  }, [isConnected, walletClient, jobContractAddress]);

  useEffect(() => {
    const results = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.employer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(results);
  }, [searchTerm, jobs]);

  const handleJobClick = (jobId: number) => {
    navigate(`/job-details/${jobId}`);
  };

  const handleFilterClick = () => {
    // Placeholder for Ask AI to filter jobs based on user profile
    const aiFilteredJobs = jobs.filter((job) =>
      job.title.includes("Developer")
    ); // Example logic
    setFilteredJobs(aiFilteredJobs);
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
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <input
              type="text"
              placeholder="Search job title, description, location, or employer..."
              className="w-full p-4 rounded-lg text-black border-2 border-gray-300 focus:outline-none focus:border-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={handleFilterClick}
              className="ml-4 h-14 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition duration-300 flex items-center justify-center"
            >
              Ask AI
            </button>
          </div>
          <div className="text-gray-300 mb-6">
            <p>Suggested Searches:</p>
            <div className="flex gap-4 mt-2">
              <button
                className="px-4 py-2 bg-gray-700 rounded-full text-sm hover:bg-gray-600 transition duration-200"
                onClick={() => setSearchTerm("Developer")}
              >
                Developer
              </button>
              <button
                className="px-4 py-2 bg-gray-700 rounded-full text-sm hover:bg-gray-600 transition duration-200"
                onClick={() => setSearchTerm("Remote")}
              >
                Remote
              </button>
              <button
                className="px-4 py-2 bg-gray-700 rounded-full text-sm hover:bg-gray-600 transition duration-200"
                onClick={() => setSearchTerm("Designer")}
              >
                Designer
              </button>
              <button
                className="px-4 py-2 bg-gray-700 rounded-full text-sm hover:bg-gray-600 transition duration-200"
                onClick={() => setSearchTerm("Manager")}
              >
                Manager
              </button>
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-6">Available Jobs</h1>
        {status && <p className="text-red-500 mb-4">{status}</p>}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.jobId}
                className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition duration-200"
                onClick={() => handleJobClick(job.jobId)}
              >
                <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
                <p className="text-orange-400 mb-1">
                  {job.employer.length > 20
                    ? job.employer.slice(0, 5) + "..."
                    : job.employer}
                </p>
                <p className="text-gray-400 mb-2">Location: {job.location}</p>
                <p className="text-gray-400 mb-2">Salary: {job.salary}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No jobs available at the moment.</p>
        )}
      </div>
    </div>
  );
}
