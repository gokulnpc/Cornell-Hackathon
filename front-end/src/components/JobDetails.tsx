import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

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
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>({
    jobId: 1,
    title: "Software Developer",
    description:
      "We are looking for a passionate Software Developer to join our growing team.",
    salary: "$100,000/year",
    location: "Remote",
    employer: "0xAbc...1234",
    isOpen: true,
  });
  const navigate = useNavigate();

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
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Job Overview */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-6">Job Overview</h1>
          <div className="mb-4">
            <h2 className="text-3xl font-bold mb-2">{job?.title}</h2>
            <p className="text-gray-300 mb-4">{job?.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-gray-400">Location</p>
              <p className="text-white font-bold">{job?.location}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-gray-400">Salary</p>
              <p className="text-white font-bold">{job?.salary}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-gray-400">Employer</p>
              <p className="text-white font-bold">{job?.employer}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-gray-400">Status</p>
              <p className="text-white font-bold">
                {job?.isOpen ? "Open" : "Closed"}
              </p>
            </div>
          </div>
          <div className="bg-gray-700 p-4 rounded mt-6">
            <p className="text-gray-400">H1B Sponsorship</p>
            <p className="text-white font-bold">
              Available for qualified candidates
            </p>
          </div>
          {job?.isOpen && (
            <button
              onClick={handleApplyClick}
              className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded"
            >
              Apply for Job
            </button>
          )}
        </div>

        {/* Application Details */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-6">Application Details</h1>
          <div className="mb-4">
            <p className="text-gray-400">Total Applicants</p>
            <h2 className="text-3xl font-bold">533</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-gray-400">Shortlisted Candidates</p>
              <p className="text-white font-bold">98</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-gray-400">Hired Candidates</p>
              <p className="text-white font-bold">21</p>
            </div>
          </div>
          <div className="bg-gray-700 p-4 rounded mt-6">
            <p className="text-gray-400">Gender Diversity Ratio</p>
            <p className="text-white font-bold">67.98%</p>
          </div>
          <div className="bg-gray-700 p-4 rounded mt-6">
            <p className="text-gray-400">Recruitment Funnel</p>
            <div className="w-full bg-purple-500 h-6 mt-2 rounded-lg relative">
              <div
                className="bg-blue-600 h-6 rounded-lg"
                style={{ width: "41.3%" }}
              ></div>
              <p className="absolute left-2 top-0 text-sm text-white">
                41.3% Applied
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Applicant Details Table */}
      <div className="mt-10 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6">Applicant Details</h1>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-4 text-gray-400">Applicant Name</th>
              <th className="p-4 text-gray-400">ETH Address</th>
              <th className="p-4 text-gray-400">Job Title</th>
              <th className="p-4 text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-700">
              <td className="p-4 text-white">Ronald Richards</td>
              <td className="p-4 text-white">0xA1b...4C67</td>
              <td className="p-4 text-white">Software Developer</td>
              <td className="p-4 text-green-500">Hired</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="p-4 text-white">Diane Russell</td>
              <td className="p-4 text-white">0xB2d...7D89</td>
              <td className="p-4 text-white">Sr. Analyst</td>
              <td className="p-4 text-yellow-400">Offer Initiated</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="p-4 text-white">Marvin McKinney</td>
              <td className="p-4 text-white">0xC3e...8E90</td>
              <td className="p-4 text-white">Executive Officer</td>
              <td className="p-4 text-green-500">Hired</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
